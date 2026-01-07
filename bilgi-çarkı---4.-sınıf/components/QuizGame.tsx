
import React, { useState, useEffect } from 'react';
import Wheel from './Wheel';
import QuestionModal from './QuestionModal';
import { generateQuestion } from '../services/geminiService';
import { WheelSegment, QuestionData, GradeLevel } from '../types';
import { Loader2, ArrowLeft, Trophy, Star, Sparkles } from 'lucide-react';
import { updateGlobalStats } from '../src/firebase';
import { SoundEffects } from '../utils/sound';

const SEGMENTS_MAP: Record<number, WheelSegment[]> = {
  1: [
    { label: 'Matematik', color: '#f87171', textColor: '#fff' },
    { label: 'Türkçe', color: '#22d3ee', textColor: '#fff' },
    { label: 'Hayat Bilgisi', color: '#f472b6', textColor: '#fff' },
    { label: 'İngilizce', color: '#a78bfa', textColor: '#fff' }
  ],
  2: [
    { label: 'Matematik', color: '#f87171', textColor: '#fff' },
    { label: 'Türkçe', color: '#22d3ee', textColor: '#fff' },
    { label: 'Hayat Bilgisi', color: '#f472b6', textColor: '#fff' },
    { label: 'İngilizce', color: '#a78bfa', textColor: '#fff' }
  ],
  3: [
    { label: 'Matematik', color: '#f87171', textColor: '#fff' },
    { label: 'Türkçe', color: '#22d3ee', textColor: '#fff' },
    { label: 'Fen Bilimleri', color: '#fbbf24', textColor: '#fff' },
    { label: 'Hayat Bilgisi', color: '#f472b6', textColor: '#fff' },
    { label: 'İngilizce', color: '#a78bfa', textColor: '#fff' }
  ],
  4: [
    { label: 'Matematik', color: '#ef4444', textColor: '#fff' },
    { label: 'Türkçe', color: '#06b6d4', textColor: '#fff' },
    { label: 'Fen Bilimleri', color: '#f59e0b', textColor: '#fff' },
    { label: 'Sosyal Bilgiler', color: '#10b981', textColor: '#fff' },
    { label: 'İngilizce', color: '#8b5cf6', textColor: '#fff' },
    { label: 'Din Kültürü', color: '#6366f1', textColor: '#fff' }
  ],
  5: [
    { label: 'Genel Kültür', color: '#ef4444', textColor: '#fff' },
    { label: 'Tarih', color: '#3b82f6', textColor: '#fff' },
    { label: 'Coğrafya', color: '#10b981', textColor: '#fff' },
    { label: 'Bilim & Teknoloji', color: '#f59e0b', textColor: '#fff' },
    { label: 'Edebiyat & Sanat', color: '#8b5cf6', textColor: '#fff' },
    { label: 'Sinema & TV', color: '#ec4899', textColor: '#fff' },
    { label: 'Spor', color: '#06b6d4', textColor: '#fff' },
    { label: 'Müzik', color: '#f97316', textColor: '#fff' }
  ]
};

interface QuizGameProps {
    gradeLevel: GradeLevel;
    history: string[];
    onCorrect: (p: number, s: string) => void;
    onRegisterHistory: (questions: string[]) => void;
    onExit: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ gradeLevel, history, onCorrect, onRegisterHistory, onExit }) => {
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const segments = SEGMENTS_MAP[gradeLevel] || SEGMENTS_MAP[4];

  const handleSpinEnd = async (category: string) => {
    setLoading(true);
    try {
      const q = await generateQuestion(category, history, gradeLevel);
      setQuestion(q);
      updateGlobalStats('game', 'Bilgi Çarkı');
      SoundEffects.playQuestionAppear();
    } catch(e) {
        alert("Bir hata oluştu, lütfen tekrar çevir.");
    } finally { setLoading(false); }
  };

  const handleResult = (isCorrect: boolean) => {
      if (isCorrect) {
          const points = 10 + (combo * 2);
          setSessionScore(prev => prev + points);
          setCombo(prev => prev + 1);
          onCorrect(points, question?.category || 'Genel');
          if (question) onRegisterHistory([question.questionText]);
          SoundEffects.playCorrect();
          
          // Yıldız Yağmuru Efekti
          setShowStars(true);
          setTimeout(() => setShowStars(false), 2000);
      } else {
          setCombo(0);
          SoundEffects.playWrong();
      }
      setQuestion(null);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 py-4 animate-fade-in relative min-h-[600px]">
      
      {/* Yıldız Yağmuru Parçacıkları */}
      {showStars && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="star-particle animate-star-fall text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 1}s`
              }}
            >
              <Star fill="currentColor" size={20 + Math.random() * 20} />
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white">
          <button onClick={onExit} className="text-gray-400 font-bold flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={20}/> Geri
          </button>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100 shadow-sm">
                  <Trophy size={18} className="text-yellow-500" />
                  <span className="font-black text-yellow-800 text-lg">{sessionScore}</span>
              </div>
          </div>
      </div>

      <div className="text-center mt-8 relative z-10 w-full flex flex-col items-center">
          {combo > 1 && (
              <div className="absolute -top-12 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-1.5 rounded-full text-sm font-black animate-bounce shadow-xl border-2 border-white">
                  {combo} COMBO! 🔥
              </div>
          )}
          <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter flex items-center justify-center gap-2 drop-shadow-sm">
              <Star className="text-indigo-500 fill-indigo-200" />
              {gradeLevel === 5 ? "BÜYÜK ÇARK" : "BİLGİ ÇARKİ"}
          </h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2">
              {gradeLevel === 5 ? "Genel Kültür Yarışması" : `${gradeLevel}. Sınıf Macerası`}
          </p>
      </div>

      <div className="relative mt-2">
          <Wheel segments={segments} onSpinEnd={handleSpinEnd} />
          
          {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-full z-50 animate-fade-in border-4 border-white/50">
                  <div className="bg-white p-6 rounded-full shadow-2xl flex flex-col items-center">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-3" />
                    <p className="font-black text-indigo-900 uppercase tracking-tighter">Sorun Hazırlanıyor</p>
                  </div>
              </div>
          )}
      </div>

      {question && (
          <QuestionModal 
            data={question} 
            onClose={(isCorrect) => handleResult(isCorrect)} 
          />
      )}

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
      </div>
    </div>
  );
};

export default QuizGame;
