
import React, { useState, useEffect } from 'react';
import { CURRICULUM_TOPICS, TestConfig, QuestionData, SubjectStats, GradeLevel, TopicStats } from '../types';
import { CheckCircle2, Circle, ArrowRight, Award, Timer, BookOpen, AlertCircle, Loader2, Users, Key, ArrowLeft } from 'lucide-react';
import { generateExamQuestions } from '../services/geminiService';
import { getGameStats } from '../src/firebase';
import { SoundEffects } from '../utils/sound';

interface TestModeProps {
  onFinish: (score: number, total: number) => void;
  onComplete: (subjectResults: Record<string, SubjectStats>, topicResults: Record<string, TopicStats>) => void;
  onExit: () => void;
  gradeLevel: GradeLevel;
  history: string[];
  onRegisterHistory: (questions: string[]) => void;
}

const TestMode: React.FC<TestModeProps> = ({ onFinish, onComplete, onExit, gradeLevel, history, onRegisterHistory }) => {
  // Config State
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<{subject: string, topic: string}[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState(15);
  const [timerDirection, setTimerDirection] = useState<'up' | 'down'>('down');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  // Runner State
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Status States
  const [isPreparing, setIsPreparing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  const gradeTopics = CURRICULUM_TOPICS[gradeLevel] || CURRICULUM_TOPICS[4];

  useEffect(() => {
    getGameStats('Sınav Modu').then(setTotalPlays);
    // Check API Key status
    if ((window as any).aistudio) {
        (window as any).aistudio.hasSelectedApiKey().then(setHasApiKey);
    }
  }, []);

  const handleSelectKey = async () => {
      if ((window as any).aistudio) {
          await (window as any).aistudio.openSelectKey();
          setHasApiKey(true);
      }
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => ({...prev, [subject]: !prev[subject]}));
  };

  const toggleTopic = (subject: string, topic: string) => {
    setSelectedTopics(prev => {
      const exists = prev.find(p => p.subject === subject && p.topic === topic);
      if (exists) {
        return prev.filter(p => !(p.subject === subject && p.topic === topic));
      } else {
        return [...prev, { subject, topic }];
      }
    });
  };

  const selectAllInSubject = (subject: string) => {
    const topics = gradeTopics[subject];
    const allSelected = topics.every(t => selectedTopics.some(s => s.subject === subject && s.topic === t));
    
    if (allSelected) {
        setSelectedTopics(prev => prev.filter(p => p.subject !== subject));
    } else {
        const newSelection = [...selectedTopics];
        topics.forEach(t => {
            if (!newSelection.some(s => s.subject === subject && s.topic === t)) {
                newSelection.push({ subject, topic: t });
            }
        });
        setSelectedTopics(newSelection);
    }
  };

  const startExamPreparation = async () => {
    if (selectedTopics.length === 0) return;
    
    setIsPreparing(true);
    const initialConfig: TestConfig = {
        selectedTopics,
        questionCount,
        durationMinutes: duration,
        timerDirection,
        gradeLevel
    };
    setConfig(initialConfig);

    try {
        const generatedQuestions = await generateExamQuestions(
            initialConfig.selectedTopics, 
            initialConfig.questionCount,
            history,
            initialConfig.gradeLevel
        );
        
        if (generatedQuestions.length === 0) throw new Error("No questions");

        setQuestions(generatedQuestions);
        setAnswers(new Array(generatedQuestions.length).fill(null));
        setIsPreparing(false);
        setIsReady(true);
    } catch (e: any) {
        console.error("Failed to prepare exam", e);
        setIsPreparing(false);
        setConfig(null);
        
        if (e.message?.includes("Requested entity was not found")) {
            setHasApiKey(false);
            alert("API Anahtarı hatası! Lütfen 'API Anahtarı Seç' butonuna basarak bir anahtar seçin.");
        } else {
            alert("Sınav hazırlanırken bir sorun oluştu. Lütfen tekrar dene.");
        }
    }
  };

  useEffect(() => {
    if (!config || !isReady || isFinished || questions.length === 0) return;
    
    const interval = setInterval(() => {
        setElapsedTime(prev => {
            const next = prev + 1;
            if (config.timerDirection === 'down' && config.durationMinutes * 60 - next <= 0) {
                finishTest();
                return config.durationMinutes * 60;
            }
            return next;
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [config, isReady, isFinished, questions.length]);

  const handleOptionSelect = (optionIdx: number) => {
    if (isFinished) return;
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = optionIdx;
    setAnswers(newAnswers);
    // Seçim yapınca ses çıkar (Kadın sesiyle harf)
    SoundEffects.speak(['A', 'B', 'C', 'D'][optionIdx], 1.2);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
    } else {
        finishTest();
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
        setCurrentQIndex(prev => prev - 1);
    }
  };

  const finishTest = () => {
    setIsFinished(true);
    setIsReady(false);

    const correctCount = answers.reduce((acc, ans, idx) => {
        if (ans === null || !questions[idx]) return acc;
        return acc + (ans === questions[idx].correctAnswerIndex ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / questions.length) * 100);

    const subjectResults: Record<string, SubjectStats> = {};
    const topicResults: Record<string, TopicStats> = {};
    
    questions.forEach((q, idx) => {
        const isCorrect = answers[idx] === q.correctAnswerIndex;
        if (!subjectResults[q.category]) subjectResults[q.category] = { correct: 0, total: 0 };
        subjectResults[q.category].total += 1;
        if (isCorrect) subjectResults[q.category].correct += 1;
        if (q.topic) {
            const topicKey = `${q.category}:${q.topic}`;
            if (!topicResults[topicKey]) topicResults[topicKey] = { correct: 0, total: 0 };
            topicResults[topicKey].total += 1;
            if (isCorrect) topicResults[topicKey].correct += 1;
        }
    });

    const newQuestionTexts = questions.map(q => q.questionText);
    onRegisterHistory(newQuestionTexts);

    if (onFinish) onFinish(score, questions.length);
    if (onComplete) onComplete(subjectResults, topicResults);
    
    // Sonuç anonsu (Kadın Sesi)
    setTimeout(() => {
        SoundEffects.speak(`Sınav bitti! ${questions.length} soruda ${correctCount} doğru yaptın. Tebrikler!`);
    }, 1000);
  };

  const getDisplayTime = () => {
      if (!config) return "00:00";
      const seconds = config.timerDirection === 'up' ? elapsedTime : Math.max(0, config.durationMinutes * 60 - elapsedTime);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDER: CONFIGURATION ---
  if (!config && !isPreparing) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-indigo-600 p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><BookOpen /> Sınav Oluştur</h2>
                {totalPlays !== null && (
                    <p className="text-xs font-bold text-indigo-200 mt-1 flex items-center gap-1">
                        <Users size={12}/> {totalPlays.toLocaleString()} kez çözüldü
                    </p>
                )}
            </div>
            <div className="flex gap-2">
                {!hasApiKey && (
                    <button onClick={handleSelectKey} className="bg-amber-400 text-amber-900 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm animate-pulse">
                        <Key size={14}/> Anahtar Seç
                    </button>
                )}
                <button onClick={onExit} className="text-indigo-100 hover:text-white text-sm font-bold bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1"><ArrowLeft size={16}/> Geri</button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Soru Sayısı</label>
                    <input type="number" min="1" max="50" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full p-2 border-2 border-gray-50 rounded-xl font-black text-indigo-600 text-2xl outline-none focus:border-indigo-200 transition-all text-center" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Süre (Dakika)</label>
                    <input type="number" min="1" max="120" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full p-2 border-2 border-gray-50 rounded-xl font-black text-indigo-600 text-2xl outline-none focus:border-indigo-200 transition-all text-center" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Zamanlayıcı</label>
                    <div className="flex bg-gray-100 rounded-xl p-1 h-12">
                        <button onClick={() => setTimerDirection('down')} className={`flex-1 rounded-lg text-xs font-bold transition-all ${timerDirection === 'down' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>Geri Sayım</button>
                        <button onClick={() => setTimerDirection('up')} className={`flex-1 rounded-lg text-xs font-bold transition-all ${timerDirection === 'up' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>Kronometre</button>
                    </div>
                </div>
            </div>

            <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-tighter">
                <CheckCircle2 className="w-5 h-5 text-indigo-600"/> Konu Seçimi ({selectedTopics.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                {Object.entries(gradeTopics).map(([subject, topics]) => {
                    const isExpanded = expandedSubjects[subject];
                    const subjectTopicsSelected = topics.filter(t => selectedTopics.some(s => s.subject === subject && s.topic === t));
                    const isAllSelected = subjectTopicsSelected.length === topics.length;

                    return (
                        <div key={subject} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all">
                            <div className="p-4 flex justify-between items-center bg-gray-50/50 cursor-pointer hover:bg-gray-100" onClick={() => toggleSubject(subject)}>
                                <span className="font-bold text-gray-700">{subject}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">{subjectTopicsSelected.length}</span>
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="p-4 border-t border-gray-100 space-y-2">
                                    <button onClick={() => selectAllInSubject(subject)} className="text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-widest hover:underline">{isAllSelected ? 'Tümünü Kaldır' : 'Tümünü Seç'}</button>
                                    {topics.map(topic => {
                                        const isSelected = selectedTopics.some(s => s.subject === subject && s.topic === topic);
                                        return (
                                            <div key={topic} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors" onClick={() => toggleTopic(subject, topic)}>
                                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200'}`}>
                                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>{topic}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shrink-0">
            <button onClick={startExamPreparation} disabled={selectedTopics.length === 0} className={`w-full py-4 rounded-2xl text-xl font-black text-white shadow-xl transition-all ${selectedTopics.length === 0 ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-green-500 hover:bg-green-600 hover:scale-[1.01] active:scale-95 shadow-green-100'}`}>SINAVI BAŞLAT</button>
        </div>
      </div>
    );
  }

  // --- RENDER: PREPARING ---
  if (isPreparing) {
      return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-fade-in flex flex-col items-center min-h-[400px] justify-center border-4 border-indigo-50">
            <div className="relative mb-8">
                <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
                <BookOpen className="w-8 h-8 text-indigo-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tighter uppercase">Sınav Hazırlanıyor</h2>
            <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                Yapay zeka öğretmen senin için özel sorular hazırlıyor. <br/>Lütfen bir saniye bekle şampiyon!
            </p>
        </div>
      );
  }

  // --- RENDER: RESULTS ---
  if (isFinished) {
      const correctCount = answers.filter((a, i) => questions[i] && a === questions[i].correctAnswerIndex).length;
      const score = Math.round((correctCount / questions.length) * 100);

      return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-scale-up border-4 border-indigo-50">
            <div className="bg-yellow-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-yellow-100">
                <Award className="w-20 h-20 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-1 tracking-tighter uppercase">Sınav Tamamlandı!</h2>
            <p className="text-gray-400 font-bold text-sm mb-6 uppercase tracking-widest">Karnen Hazır</p>
            
            <div className="text-8xl font-black text-indigo-600 mb-8 drop-shadow-md">{score}</div>
            
            <div className="bg-gray-50 p-6 rounded-3xl mb-10 flex justify-around items-center border border-gray-100">
                <div className="text-center">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Doğru</div>
                    <div className="text-2xl font-black text-green-600">{correctCount}</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Yanlış</div>
                    <div className="text-2xl font-black text-red-500">{questions.length - correctCount}</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Toplam Soru</div>
                    <div className="text-2xl font-black text-gray-700">{questions.length}</div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => { setConfig(null); setQuestions([]); setAnswers([]); setIsFinished(false); setIsReady(false); setCurrentQIndex(0); }} className="bg-gray-100 text-gray-600 px-10 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all flex-1 uppercase tracking-wider">Yeni Sınav</button>
                <button onClick={onExit} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex-1 uppercase tracking-wider">Geri</button>
            </div>
        </div>
      );
  }

  // --- RENDER: EXAM RUNNER ---
  const currentQ = questions[currentQIndex];
  if (!currentQ) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[550px] border border-gray-100">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0">
            <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 rounded-xl text-lg font-mono font-black flex items-center gap-2 ${config?.durationMinutes && config.durationMinutes * 60 - elapsedTime < 60 ? 'bg-red-500 animate-pulse' : 'bg-gray-800 text-green-400 border border-green-900/30'}`}>
                    <Timer size={20} /> {getDisplayTime()}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                    Soru <span className="text-white">{currentQIndex + 1}</span> / {questions.length}
                </div>
            </div>
            <button onClick={finishTest} className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all border border-red-500/20 uppercase tracking-widest">Sınavı Bitir</button>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col overflow-y-auto bg-white">
            <div className="mb-4">
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                    {currentQ.category} {currentQ.topic ? `• ${currentQ.topic}` : ''}
                </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug mb-8">
                {currentQ.questionText}
            </h3>
            
            <div className="grid grid-cols-1 gap-3 max-w-3xl">
                {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQIndex] === idx;
                    return (
                        <button key={idx} onClick={() => handleOptionSelect(idx)} className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group relative ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md ring-4 ring-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-100 hover:bg-gray-50 text-gray-600'}`}>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center shrink-0 text-lg font-black transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white rotate-6' : 'border-gray-100 bg-gray-50 text-gray-400 group-hover:border-indigo-200'}`}>
                                {['A', 'B', 'C', 'D'][idx]}
                            </div>
                            <span className="text-base sm:text-lg font-bold">{opt}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Navigation */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
            <button onClick={prevQuestion} disabled={currentQIndex === 0} className="px-6 py-3 rounded-xl font-black text-sm text-gray-400 hover:bg-white hover:text-indigo-600 disabled:opacity-0 transition-all uppercase tracking-widest">Önceki</button>
            <div className="flex gap-1.5">{questions.map((_, i) => ( <div key={i} className={`h-2 rounded-full transition-all ${i === currentQIndex ? 'w-8 bg-indigo-600' : answers[i] !== null ? 'w-2 bg-indigo-300' : 'w-2 bg-gray-200'}`}></div> ))}</div>
            <button onClick={nextQuestion} className="px-8 py-3 rounded-xl font-black text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 transition-transform active:scale-95 uppercase tracking-widest">
                {currentQIndex === questions.length - 1 ? 'Bitir' : 'Sonraki'} <ArrowRight size={18} />
            </button>
        </div>
    </div>
  );
};

export default TestMode;
