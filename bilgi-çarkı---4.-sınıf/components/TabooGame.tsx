
import React, { useState, useEffect } from 'react';
import { GradeLevel, TabooCard, Subject } from '../types';
import { TABOO_POOL } from '../data/tabooPool';
import { Timer, CheckCircle, XCircle, RotateCcw, AlertCircle, ArrowRight, Mic2, Pause, Play, Users, ArrowLeft } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { getGameStats } from '../src/firebase';

interface TabooGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number, subject?: string) => void;
  onWrong: () => void;
}

const TabooGame: React.FC<TabooGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [cards, setCards] = useState<TabooCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const [score, setScore] = useState(0); // Local session score (count of corrects)
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [passCount, setPassCount] = useState(3);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  const [lastAction, setLastAction] = useState<'correct' | 'wrong' | 'pass' | null>(null);

  useEffect(() => {
    getGameStats('Yasak Kelime').then(setTotalPlays);
  }, []);

  // Load cards based on grade level
  const loadCards = () => {
    let pool = TABOO_POOL[gradeLevel];
    if (!pool || pool.length === 0) pool = TABOO_POOL[4];
    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const startGame = () => {
    loadCards();
    setScore(0);
    setTimeLeft(60);
    setPassCount(3);
    setCurrentCardIndex(0);
    setGameState('playing');
    setIsPaused(false);
  };

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
      SoundEffects.playWrong(); // Time's up sound
    }
    return () => clearInterval(interval);
  }, [gameState, isPaused, timeLeft]);

  // Game Actions
  const handleCorrect = () => {
    setScore(s => s + 1); // Increment local count
    setLastAction('correct');
    SoundEffects.playCorrect();
    // Send 0 points so it doesn't affect global stats or subjects
    onCorrect(0); 
    nextCard();
  };

  const handleWrong = () => {
    // For Taboo, usually wrong guess just buzzes, maybe penalty or just move on.
    // We'll keep local score non-negative.
    setScore(s => Math.max(0, s - 1)); 
    setLastAction('wrong');
    SoundEffects.playWrong();
    onWrong();
    nextCard();
  };

  const handlePass = () => {
    if (passCount > 0) {
      setPassCount(p => p - 1);
      setLastAction('pass');
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
        // Reshuffle if deck ends
        const newDeck = [...cards].sort(() => Math.random() - 0.5);
        setCards(newDeck);
        setCurrentCardIndex(0);
    }
    // Reset feedback overlay after a short delay
    setTimeout(() => setLastAction(null), 500);
  };

  const currentCard = cards[currentCardIndex];

  // --- MENU RENDER ---
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-6">
        <div className="flex justify-center mb-2">
          <div className="bg-purple-100 p-6 rounded-full shadow-inner ring-4 ring-purple-50">
            <Mic2 size={64} className="text-purple-600" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Yasak Kelime</h2>
          <p className="text-gray-500 font-medium text-sm sm:text-base px-4">
            Kelimeleri anlatırken yasaklı kelimeleri kullanma! <br/>
            Bu oyun serbest etkinliktir, puan etkilemez.
          </p>
          {totalPlays !== null && (
            <p className="text-xs font-bold text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Users size={12}/> {totalPlays.toLocaleString()} kez oynandı
            </p>
          )}
        </div>
        
        <button 
          onClick={startGame}
          className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-xl"
        >
          <Play size={24} fill="currentColor"/> OYUNA BAŞLA
        </button>
        
        <button onClick={onExit} className="mt-2 text-gray-400 font-bold hover:text-gray-600 text-sm flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
      </div>
    );
  }

  // --- FINISHED RENDER ---
  if (gameState === 'finished') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-scale-up border-4 border-white ring-4 ring-purple-50">
        <div className="text-6xl mb-4">⌛</div>
        <h2 className="text-4xl font-black mb-2 text-gray-800">SÜRE BİTTİ!</h2>
        <div className="bg-purple-50 rounded-2xl p-6 mb-6 border border-purple-100">
          <p className="text-xs text-purple-400 uppercase font-bold tracking-widest mb-1">DOĞRU SAYISI</p>
          <p className="text-6xl text-purple-800 font-black tracking-widest">{score}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={startGame} className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 shadow-xl transition-all flex items-center justify-center gap-2 text-lg">
            <RotateCcw size={24}/> Tekrar Oyna
          </button>
          <button onClick={() => setGameState('menu')} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={16}/> Geri
          </button>
        </div>
      </div>
    );
  }

  // --- PLAYING RENDER ---
  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full min-h-[600px] animate-fade-in relative">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 font-mono text-xl font-bold px-3 py-1 rounded-lg ${timeLeft < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                <Timer size={18} /> {timeLeft}
            </div>
            <button onClick={() => setIsPaused(!isPaused)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
                {isPaused ? <Play size={18} fill="currentColor"/> : <Pause size={18} fill="currentColor"/>}
            </button>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-gray-400">Pas: {passCount}</div>
            <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded-lg font-black text-xl">
                {score}
            </div>
        </div>
      </div>

      {isPaused ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl z-50">
              <h2 className="text-3xl font-black text-gray-400 mb-4">OYUN DURAKLATILDI</h2>
              <button onClick={() => setIsPaused(false)} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-xl">Devam Et</button>
          </div>
      ) : (
          <>
            {/* The Card */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-2xl border-8 border-white ring-1 ring-gray-100 overflow-hidden flex flex-col relative transform transition-all duration-300 mb-6">
                
                {/* Last Action Feedback Overlay */}
                {lastAction && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-ping-once bg-white/50">
                        {lastAction === 'correct' && <CheckCircle size={100} className="text-green-500 drop-shadow-lg" />}
                        {lastAction === 'wrong' && <XCircle size={100} className="text-red-500 drop-shadow-lg" />}
                        {lastAction === 'pass' && <ArrowRight size={100} className="text-yellow-500 drop-shadow-lg" />}
                    </div>
                )}

                {/* Top Section: Target Word */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide drop-shadow-md relative z-10">
                        {currentCard?.word}
                    </h2>
                </div>

                {/* Bottom Section: Forbidden Words */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center bg-red-50/50">
                    <div className="flex items-center gap-2 mb-4 text-red-400 font-bold uppercase tracking-widest text-xs">
                        <AlertCircle size={14} /> Yasaklı Kelimeler
                    </div>
                    <div className="w-full space-y-3">
                        {currentCard?.forbidden.map((word, idx) => (
                            <div key={idx} className="w-full bg-white py-3 px-4 rounded-xl shadow-sm border border-red-100 text-center font-bold text-gray-700 text-lg sm:text-xl">
                                {word}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-3 h-24">
                <button 
                    onClick={handleWrong}
                    className="bg-red-100 hover:bg-red-200 border-2 border-red-200 text-red-600 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                    <XCircle size={32} />
                    <span className="font-bold text-sm">YASAKLI</span>
                </button>

                <button 
                    onClick={handlePass}
                    disabled={passCount <= 0}
                    className={`border-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${passCount > 0 ? 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200 text-yellow-700' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    <RotateCcw size={28} />
                    <span className="font-bold text-sm">PAS ({passCount})</span>
                </button>

                <button 
                    onClick={handleCorrect}
                    className="bg-green-100 hover:bg-green-200 border-2 border-green-200 text-green-700 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                    <CheckCircle size={32} />
                    <span className="font-bold text-sm">DOĞRU</span>
                </button>
            </div>
          </>
      )}
    </div>
  );
};

export default TabooGame;
