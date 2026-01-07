
import React, { useState, useEffect } from 'react';
import { generateBingoItem, getTotalBingoCount } from '../services/geminiService';
import { BingoData, GradeLevel } from '../types';
import { Loader2, RefreshCw, Lightbulb, Volume2, Users, ArrowLeft } from 'lucide-react';
import { getGameStats, updateGlobalStats } from '../src/firebase';
import { SoundEffects } from '../utils/sound';

interface BingoGameProps {
    history: string[];
    onRegisterHistory: (words: string[]) => void;
    gradeLevel: GradeLevel;
    onExit: () => void;
}

const BingoGame: React.FC<BingoGameProps> = ({ history, onRegisterHistory, gradeLevel, onExit }) => {
  const [currentCard, setCurrentCard] = useState<BingoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  useEffect(() => {
      setTotalWords(getTotalBingoCount(gradeLevel));
      getGameStats('Tombala').then(count => setTotalPlays(count));
  }, [gradeLevel]);

  const drawCard = async () => {
    if (loading) return;
    
    setIsShaking(true);
    setLoading(true);
    setShowHint(false);
    
    setTimeout(async () => {
        try {
            const data = await generateBingoItem(history, gradeLevel);
            setCurrentCard(data);
            
            // Kelimeyi hemen geçmişe ekle ki tekrar gelmesin
            onRegisterHistory([data.word]);
            updateGlobalStats('game', 'Tombala');
            SoundEffects.playCorrect(); // Çekiliş sesi niyetine
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsShaking(false);
        }
    }, 1000);
  };

  const poolFinished = history.length >= totalWords && totalWords > 0;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 min-h-[500px]">
        
        <div className="absolute top-0 left-0 w-full p-2 sm:p-4 flex justify-between items-start z-20 pointer-events-none">
            <button 
                onClick={onExit} 
                className="pointer-events-auto text-gray-500 font-bold text-sm hover:text-indigo-600 flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-colors"
            >
                <ArrowLeft size={16}/> Geri
            </button>
            
            <div className="bg-white/80 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                {poolFinished ? 'Ekstra Kartlar (Yapay Zeka)' : `Kalan Kart: ${Math.max(0, totalWords - history.length)}`}
            </div>
        </div>

        <div className="relative mb-6 cursor-pointer group flex flex-col items-center mt-12 sm:mt-0" onClick={drawCard}>
             <div className={`transition-transform duration-300 ${isShaking ? 'animate-wiggle' : 'group-hover:scale-105 group-hover:-rotate-3'}`}>
                <svg width="220" height="260" viewBox="0 0 200 240" className="drop-shadow-2xl filter saturate-125 w-40 h-48 sm:w-[220px] sm:h-[260px]">
                     <defs>
                        <radialGradient id="bagGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#e74c3c" />
                            <stop offset="100%" stopColor="#c0392b" />
                        </radialGradient>
                    </defs>
                    <path d="M40 60 Q 100 0, 160 60 L 190 220 Q 200 240, 170 240 L 30 240 Q 0 240, 10 220 Z" fill="url(#bagGradient)" />
                    <path d="M40 60 Q 100 80, 160 60" fill="none" stroke="#922b21" strokeWidth="4" opacity="0.5" />
                    <path d="M50 200 Q 100 220, 150 200" fill="none" stroke="#922b21" strokeWidth="3" opacity="0.3" />
                    <path d="M35 60 Q 100 90, 165 60" fill="none" stroke="#f1c40f" strokeWidth="8" strokeLinecap="round" className="drop-shadow-md"/>
                    <path d="M35 60 Q 100 90, 165 60" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </svg>
             </div>
             
             {!currentCard && !loading && (
                 <div className="flex flex-col items-center gap-2">
                    <div className="mt-8 bg-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-xl border-2 border-indigo-100 animate-bounce flex items-center gap-3 transform hover:scale-105 transition-transform max-w-[280px] sm:max-w-none">
                        <span className="text-2xl sm:text-3xl">👆</span>
                        <div className="flex flex-col items-start text-left">
                            <span className="text-indigo-900 font-black text-base sm:text-lg">KART ÇEK</span>
                            <span className="text-indigo-500 font-medium text-xs sm:text-sm">Keseye dokun, şansına ne çıkacak?</span>
                        </div>
                    </div>
                    {totalPlays !== null && (
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                            <Users size={12} /> {totalPlays.toLocaleString()} kez oynandı
                        </div>
                    )}
                 </div>
             )}
        </div>

        {loading && (
            <div className="text-lg sm:text-xl font-bold text-indigo-600 animate-pulse flex items-center gap-2 mb-4">
                <Loader2 className="animate-spin" /> Kese Karıştırılıyor...
            </div>
        )}

        {currentCard && !loading && (
            <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-400 animate-scale-up transform transition-all">
                <div className="bg-yellow-400 p-3 sm:p-4 text-center">
                    <span className="bg-white/30 text-yellow-900 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        {currentCard.type}
                    </span>
                </div>
                
                <div className="p-6 sm:p-8 text-center">
                    <h2 className="text-3xl sm:text-5xl font-black text-gray-800 mb-4 sm:mb-6 drop-shadow-sm">
                        {currentCard.word}
                    </h2>
                    
                    <p className="text-gray-500 text-sm sm:text-lg mb-6 sm:mb-8">
                        Bu kelime ile harika bir cümle kurabilir misin?
                    </p>

                    {showHint ? (
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-fade-in">
                            <h4 className="text-indigo-900 font-bold text-xs sm:text-sm mb-1">Örnek Cümle:</h4>
                            <p className="text-indigo-700 italic text-base sm:text-lg">"{currentCard.exampleSentence}"</p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowHint(true)}
                            className="text-indigo-500 font-bold hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
                        >
                            <Lightbulb size={18} className="sm:w-5 sm:h-5" /> İpucu / Örnek Göster
                        </button>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-center">
                    <button 
                        onClick={drawCard}
                        className="bg-indigo-600 text-white px-6 py-3 sm:px-8 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 flex items-center gap-2 text-sm sm:text-base"
                    >
                        <RefreshCw size={18} className="sm:w-5 sm:h-5" /> Yeni Kart Çek
                    </button>
                </div>
            </div>
        )}
        
        <style>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
          }
          .animate-wiggle {
            animation: wiggle 0.3s ease-in-out infinite;
          }
        `}</style>
    </div>
  );
};

export default BingoGame;
