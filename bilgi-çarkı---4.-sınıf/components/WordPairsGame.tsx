
import React, { useState, useEffect } from 'react';
import { GradeLevel, WordPairData } from '../types';
import { WORD_PAIRS_POOL } from '../data/wordPairsPool';
import { Shuffle, Trophy, CheckCircle2, XCircle, ArrowRight, Users, ArrowLeftRight, Equal, ArrowLeft } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { getGameStats } from '../src/firebase';

interface WordPairsGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number) => void;
  onWrong: () => void;
}

const WordPairsGame: React.FC<WordPairsGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong }) => {
  const [currentQuestion, setCurrentQuestion] = useState<WordPairData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  useEffect(() => {
    getGameStats('Anlam İlişkisi').then(setTotalPlays);
    generateNewRound();
  }, [gradeLevel]);

  const generateNewRound = () => {
    const pool = WORD_PAIRS_POOL[gradeLevel] || WORD_PAIRS_POOL[4];
    
    // Rastgele bir soru seç
    const question = pool[Math.floor(Math.random() * pool.length)];
    
    // Yanıltıcı şıkları seç (Distractors)
    const distractors = new Set<string>();
    let attempts = 0;
    
    while (distractors.size < 3 && attempts < 50) {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      // Şıkkın doğru cevapla veya soru kelimesiyle aynı olmamasını sağla
      if (randomItem.pair !== question.pair && randomItem.word !== question.pair && randomItem.pair !== question.word) {
        distractors.add(randomItem.pair);
      }
      attempts++;
    }
    
    // Eğer yeterli şık bulunamazsa havuzdan rastgele doldur
    if (distractors.size < 3) {
         distractors.add("Elma"); 
         distractors.add("Kalem"); 
         distractors.add("Masa"); 
    }
    
    const allOptions = [...Array.from(distractors), question.pair].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion(question);
    setOptions(allOptions);
    setFeedback(null);
    setSelectedOption(null);
  };

  const handleOptionClick = (option: string) => {
    if (feedback || !currentQuestion) return;
    
    setSelectedOption(option);
    
    if (option === currentQuestion.pair) {
      setFeedback('correct');
      SoundEffects.playCorrect();
      const points = 2 + Math.min(streak, 3);
      setScore(s => s + points);
      setStreak(s => s + 1);
      onCorrect(points);
      setTimeout(generateNewRound, 1500);
    } else {
      setFeedback('wrong');
      SoundEffects.playWrong();
      setStreak(0);
      onWrong();
      setTimeout(generateNewRound, 2000);
    }
  };

  if (!currentQuestion) return <div>Yükleniyor...</div>;

  const isSynonym = currentQuestion.type === 'synonym';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-6 animate-fade-in min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-gray-400 font-bold hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={16}/> Geri</button>
        <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold text-sm">
                x{streak} Seri
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-xl font-black text-xl flex items-center gap-2">
                <Trophy size={18} /> {score}
            </div>
        </div>
      </div>

      {/* QUESTION TYPE INDICATOR (Büyük ve Belirgin) */}
      <div className="flex justify-center mb-6">
          <div className={`
              px-8 py-4 rounded-2xl shadow-lg border-4 transform transition-all duration-300 hover:scale-105
              flex flex-col items-center justify-center gap-2 w-full max-w-xs text-center
              ${isSynonym 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-200 text-white' 
                  : 'bg-gradient-to-br from-red-500 to-orange-500 border-red-200 text-white'}
          `}>
              <div className="bg-white/20 p-2 rounded-full mb-1">
                  {isSynonym ? <Equal size={32} strokeWidth={3} /> : <ArrowLeftRight size={32} strokeWidth={3} />}
              </div>
              <div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider drop-shadow-md">
                      {isSynonym ? 'EŞ ANLAM' : 'ZIT ANLAM'}
                  </h3>
                  <p className="text-white/90 text-sm font-medium mt-1">
                      {isSynonym ? 'Aynı anlama geleni bul!' : 'Karşıt anlama geleni bul!'}
                  </p>
              </div>
          </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-start mb-8">
        
        <div className="bg-gray-50 border-2 border-gray-100 px-10 py-6 rounded-3xl mb-8 shadow-inner">
            <div className="text-4xl sm:text-6xl font-black text-gray-800 text-center animate-scale-up tracking-tight">
                {currentQuestion.word}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {options.map((opt, idx) => {
                let btnClass = "py-4 sm:py-5 rounded-2xl font-bold text-xl sm:text-2xl transition-all border-b-4 active:scale-95 shadow-md flex items-center justify-center ";
                
                if (feedback === 'correct' && opt === currentQuestion.pair) {
                    btnClass += "bg-green-500 text-white border-green-700 shadow-green-200 scale-[1.02]";
                } else if (feedback === 'wrong' && opt === selectedOption) {
                    btnClass += "bg-red-500 text-white border-red-700 shadow-red-200";
                } else if (feedback === 'wrong' && opt === currentQuestion.pair) {
                    btnClass += "bg-green-100 text-green-700 border-green-300 opacity-70";
                } else {
                    btnClass += "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-900";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        disabled={feedback !== null}
                        className={btnClass}
                    >
                        {opt}
                    </button>
                )
            })}
        </div>
      </div>

      {/* Feedback Message */}
      <div className="h-14 flex items-center justify-center">
          {feedback === 'correct' && (
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 animate-bounce shadow-sm">
                  <CheckCircle2 size={24} /> Harika! Doğru Cevap
              </div>
          )}
          {feedback === 'wrong' && (
              <div className="bg-red-100 text-red-600 px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 animate-shake shadow-sm">
                  <XCircle size={24} /> Yanlış! Doğrusu: {currentQuestion.pair}
              </div>
          )}
      </div>

       {totalPlays !== null && (
          <div className="mt-4 text-center text-gray-300 text-xs font-bold flex items-center justify-center gap-1">
              <Users size={12}/> {totalPlays.toLocaleString()} kez oynandı
          </div>
      )}

    </div>
  );
};

export default WordPairsGame;
