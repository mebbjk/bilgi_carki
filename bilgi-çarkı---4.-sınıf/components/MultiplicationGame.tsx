
import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../types';
import { Sparkles, Trophy, Zap, Users, ArrowLeft } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { getGameStats } from '../src/firebase';

interface MultiplicationGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number) => void; 
  onWrong: () => void;   
}

interface Question {
  num1: number;
  num2: number;
  options: number[];
  correctAnswer: number;
}

const MultiplicationGame: React.FC<MultiplicationGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0); 
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  useEffect(() => {
    getGameStats('Çarpım Tablosu').then(setTotalPlays);
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    let min = 1, max1 = 5, max2 = 5;

    if (gradeLevel === 1) {
      max1 = 3; max2 = 5; 
    } else if (gradeLevel === 2) {
      max1 = 5; max2 = 10; 
    } else if (gradeLevel === 3) {
      max1 = 10; max2 = 10; 
    } else {
      max1 = 12; max2 = 12; 
    }

    const n1 = Math.floor(Math.random() * (max1 - min + 1)) + min;
    const n2 = Math.floor(Math.random() * (max2 - min + 1)) + min;
    const correct = n1 * n2;

    const options = new Set<number>();
    options.add(correct);
    
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5; 
      const wrong = correct + offset;
      if (wrong > 0 && wrong !== correct) {
        options.add(wrong);
      } else {
        options.add(Math.floor(Math.random() * (max1 * max2)) + 1);
      }
    }

    setQuestion({
      num1: n1,
      num2: n2,
      correctAnswer: correct,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    });
    setFeedback(null);
    setSelectedOption(null);
  };

  const handleAnswer = (answer: number) => {
    if (feedback !== null || !question) return;

    setSelectedOption(answer);

    if (answer === question.correctAnswer) {
      setFeedback('correct');
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);
      SoundEffects.playCorrect();
      
      // Notify parent to update global stats (2 Points for Math game)
      onCorrect(2);
      
      setTimeout(generateQuestion, 1000);
    } else {
      setFeedback('wrong');
      setStreak(0);
      SoundEffects.playWrong();
      
      onWrong();

      setTimeout(generateQuestion, 2000);
    }
  };

  if (!question) return <div>Yükleniyor...</div>;

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-6 animate-fade-in border-4 border-orange-400">
      
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600 font-bold text-sm flex items-center gap-1">
          <ArrowLeft size={16} /> Geri
        </button>
        <div className="flex items-center gap-4">
           {streak > 1 && (
             <div className="flex items-center gap-1 text-orange-500 font-black animate-pulse">
               <Zap size={20} fill="currentColor" />
               <span>x{streak}</span>
             </div>
           )}
           <div className="bg-orange-100 px-4 py-2 rounded-full text-orange-800 font-bold flex items-center gap-2">
             <Trophy size={18} /> {score}
           </div>
        </div>
      </div>

      <div className="text-center mb-10 relative">
        <div className="text-7xl sm:text-8xl font-black text-gray-800 tracking-tighter drop-shadow-sm flex justify-center items-center gap-4">
           <span>{question.num1}</span>
           <span className="text-orange-500">×</span>
           <span>{question.num2}</span>
        </div>
        
        {feedback === 'correct' && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Sparkles className="w-24 h-24 text-green-500 animate-ping" />
           </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((opt, idx) => {
           let btnClass = "py-6 rounded-2xl text-3xl font-bold shadow-md transition-all transform active:scale-95 border-b-4 ";
           
           if (feedback === 'correct' && opt === question.correctAnswer) {
             btnClass += "bg-green-500 text-white border-green-700 scale-105";
           } else if (feedback === 'wrong' && opt === selectedOption) {
             btnClass += "bg-red-500 text-white border-red-700";
           } else if (feedback === 'wrong' && opt === question.correctAnswer) {
             btnClass += "bg-green-500 text-white border-green-700 opacity-50";
           } else {
             btnClass += "bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200";
           }

           return (
             <button
               key={idx}
               onClick={() => handleAnswer(opt)}
               disabled={feedback !== null}
               className={btnClass}
             >
               {opt}
             </button>
           );
        })}
      </div>
      
      {feedback === 'wrong' && (
          <div className="mt-4 text-center text-red-500 font-bold animate-shake">
             Doğru Cevap: {question.correctAnswer} <br/>
             <span className="text-xs text-red-400">(-1 Puan)</span>
          </div>
      )}

      <div className="mt-6 text-center text-gray-400 text-xs font-medium">
         {gradeLevel}. Sınıf Seviyesi • Çarpım Tablosu • Her doğru = 2 Puan!
      </div>
      {totalPlays !== null && (
          <div className="mt-2 text-center text-gray-300 text-xs font-bold flex items-center justify-center gap-1">
              <Users size={12}/> {totalPlays.toLocaleString()} kez oynandı
          </div>
      )}

    </div>
  );
};

export default MultiplicationGame;
