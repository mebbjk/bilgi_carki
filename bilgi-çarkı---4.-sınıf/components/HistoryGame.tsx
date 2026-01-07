
import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../types';
import { CheckCircle, Clock, RotateCcw, Trophy, ArrowRight, Brain, BookOpen, Loader2, Users, ArrowLeft } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { HISTORY_SETS, HistorySet, HistoryEventItem } from '../data/historyPool';
import { getGameStats } from '../src/firebase';

interface HistoryGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number) => void;
  onWrong: () => void;
  history: string[];
  onRegisterHistory: (ids: string[]) => void;
}

const HistoryGame: React.FC<HistoryGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong, history, onRegisterHistory }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [loading, setLoading] = useState(false);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);
  
  const [currentSet, setCurrentSet] = useState<HistorySet | null>(null);
  const [shuffledEvents, setShuffledEvents] = useState<HistoryEventItem[]>([]);
  const [timeline, setTimeline] = useState<HistoryEventItem[]>([]);
  const [wrongShake, setWrongShake] = useState(false);
  
  useEffect(() => {
    getGameStats('Zaman Tüneli').then(setTotalPlays);
  }, []);

  const startGame = (diff: 'easy' | 'hard') => {
      setDifficulty(diff);
      resetRound();
  };

  const resetRound = async () => {
    setLoading(true);
    setGameState('playing');
    setTimeline([]);
    setShuffledEvents([]);
    
    setTimeout(() => {
        try {
            const pool = HISTORY_SETS[gradeLevel] || HISTORY_SETS[4];
            
            // Daha önce çözülmemiş bir set bulmaya çalış
            const availableSets = pool.filter(s => !history.includes(s.id));
            const selected = availableSets.length > 0 
                ? availableSets[Math.floor(Math.random() * availableSets.length)]
                : pool[Math.floor(Math.random() * pool.length)];

            setCurrentSet(selected);
            setShuffledEvents([...selected.events].sort(() => Math.random() - 0.5));
        } catch (err) {
            console.error("Round reset error:", err);
        } finally {
            setLoading(false);
            setWrongShake(false);
        }
    }, 600);
  };

  const handleCardClick = (event: HistoryEventItem) => {
    const currentOrderNeeded = timeline.length + 1;
    
    if (event.order === currentOrderNeeded) {
      SoundEffects.playCorrect();
      if (gradeLevel === 1) SoundEffects.speak(event.text);
      
      const newTimeline = [...timeline, event];
      setTimeline(newTimeline);
      setShuffledEvents(prev => prev.filter(e => e.text !== event.text));
      
      if (newTimeline.length === 4) {
        onCorrect(difficulty === 'hard' ? 5 : 2);
        if (currentSet) onRegisterHistory([currentSet.id]);
        setTimeout(() => setGameState('result'), 800);
      }
    } else {
      SoundEffects.playWrong();
      onWrong();
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
    }
  };

  if (gameState === 'menu') {
      return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-6">
            <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                    <Clock size={48} className="text-blue-600" />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-800">Zaman Tüneli</h2>
                <p className="text-gray-500 mt-2">
                    {gradeLevel === 1 
                      ? "Olayları oluş sırasına göre dizebilir misin? Resimlere dikkat et!" 
                      : `${gradeLevel}. Sınıf seviyesine uygun olayları oluş sırasına göre dizebilir misin?`}
                </p>
                {totalPlays !== null && <p className="text-xs font-bold text-gray-400 mt-2 flex items-center justify-center gap-1"><Users size={12}/> {totalPlays.toLocaleString()} kez oynandı</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <button onClick={() => startGame('easy')} className="flex flex-col items-center p-6 rounded-2xl border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all group">
                    <BookOpen className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform"/><span className="font-bold text-green-800 text-lg">Kolay Mod</span><span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded mt-2">+2 Puan</span>
                </button>
                <button onClick={() => startGame('hard')} className="flex flex-col items-center p-6 rounded-2xl border-2 border-orange-100 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition-all group">
                    <Brain className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform"/><span className="font-bold text-orange-800 text-lg">Zor Mod</span><span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded mt-2">+5 Puan</span>
                </button>
            </div>
            <button onClick={onExit} className="mt-4 text-gray-400 font-bold hover:text-gray-600 flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
        </div>
      );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-6 animate-fade-in flex flex-col items-center min-h-[600px]">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={() => setGameState('menu')} className="text-gray-400 font-bold text-sm hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={16}/> Geri</button>
        <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-tighter">
            {currentSet?.title || 'Sıralama'}
        </span>
        <button onClick={() => resetRound()} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><RotateCcw size={16}/></button>
      </div>
      
      {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-pulse">
              <Loader2 size={64} className="text-blue-500 animate-spin mb-4"/>
              <p className="font-black text-blue-900 uppercase tracking-tighter">Hazırlanıyor...</p>
          </div>
      ) : gameState === 'result' ? (
           <div className="flex-1 flex flex-col items-center justify-center mb-8 text-center animate-scale-up py-10">
              <div className="bg-yellow-100 p-6 rounded-full mb-6">
                <Trophy size={80} className="text-yellow-500" />
              </div>
              <h3 className="text-4xl font-black text-indigo-900 mb-6 uppercase tracking-tighter">MÜKEMMEL!</h3>
              <button 
                onClick={() => resetRound()} 
                className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
              >
                SIRADAKİ SET <ArrowRight size={28} />
              </button>
           </div>
      ) : (
          <>
            {/* TIMELINE AREA */}
            <div className="flex flex-col items-center w-full mb-8 relative min-h-[250px] gap-3">
                <div className="absolute left-1/2 top-4 bottom-4 w-1.5 bg-indigo-50 -translate-x-1/2 z-0 rounded-full hidden sm:block"></div>
                
                {timeline.map((event, index) => (
                    <div key={index} className="z-10 bg-green-500 text-white px-6 py-4 rounded-[2rem] font-bold shadow-lg w-full max-w-sm animate-scale-up flex items-center gap-4 border-b-4 border-green-600">
                        <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">{index + 1}</span> 
                        <span className="text-4xl">{event.emoji}</span>
                        <div className="flex flex-col text-left">
                            <span className="text-base sm:text-lg leading-tight">{event.text}</span>
                        </div>
                        <CheckCircle size={24} className="text-green-200 ml-auto" />
                    </div>
                ))}

                {timeline.length < 4 && (
                    <div className="z-10 border-4 border-dashed border-indigo-100 bg-indigo-50/30 text-indigo-300 px-6 py-8 rounded-[2rem] font-bold w-full max-w-sm text-center animate-pulse flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white text-indigo-200 flex items-center justify-center text-lg font-black shadow-sm">{timeline.length + 1}</div>
                        <span className="uppercase tracking-widest text-sm">Sıradaki Olay Ne?</span>
                    </div>
                )}
            </div>

            {/* CARDS TO PICK */}
            <div className={`grid grid-cols-2 gap-4 w-full border-t-2 border-gray-50 pt-8 mt-auto ${wrongShake ? 'animate-shake' : ''}`}>
                {shuffledEvents.map((event, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => handleCardClick(event)} 
                        className="bg-white border-2 border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 p-4 rounded-[2rem] shadow-md transition-all active:scale-95 active:shadow-none flex flex-col items-center justify-center text-center min-h-[140px] group"
                    >
                        <span className="text-5xl sm:text-6xl mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">{event.emoji}</span>
                        <span className="text-xs sm:text-sm font-black text-gray-500 uppercase tracking-tight leading-tight">{event.text}</span>
                    </button>
                ))}
            </div>
          </>
      )}
    </div>
  );
};

export default HistoryGame;
