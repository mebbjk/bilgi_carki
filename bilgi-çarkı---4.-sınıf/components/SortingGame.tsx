
import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../types';
import { SORTING_POOLS, SortingCategory } from '../data/sortingPool';
import { Package, ArrowLeft, RefreshCw, Trophy, Zap, Box, CheckCircle, XCircle, BookOpen, Lightbulb, Users } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { getGameStats } from '../src/firebase';

interface SortingGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number, subject: string) => void;
  onWrong: (subject: string) => void;
  history: string[];
  onRegisterHistory: (itemId: string) => void;
}

interface GameItem {
  id: string;
  text: string;
  translation?: string; 
  categoryIndex: 1 | 2; 
}

const SortingGame: React.FC<SortingGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong, history, onRegisterHistory }) => {
  const [gameState, setGameState] = useState<'menu' | 'subject_select' | 'playing' | 'finished'>('menu');
  const [selectedSubject, setSelectedSubject] = useState<string | 'mixed'>('mixed');
  const [currentCategory, setCurrentCategory] = useState<SortingCategory | null>(null);
  const [queue, setQueue] = useState<GameItem[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [animationClass, setAnimationClass] = useState('');
  const [totalPlays, setTotalPlays] = useState<number | null>(null);
  const [lastMatch, setLastMatch] = useState<{text: string, translation: string | undefined} | null>(null);

  useEffect(() => {
    getGameStats('Bilgi Kutuları').then(setTotalPlays);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && queue.length === 0) {
      const timer = setTimeout(() => {
        setGameState('finished');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [queue, gameState]);

  const getAvailableSubjects = () => {
    const pool = SORTING_POOLS[gradeLevel] || SORTING_POOLS[4];
    const subjects = Array.from(new Set(pool.map(c => c.subject)));
    return subjects;
  };

  const handleStartClick = () => {
      setGameState('subject_select');
  };

  const startGame = (subject: string | 'mixed') => {
    setSelectedSubject(subject);
    const pool = SORTING_POOLS[gradeLevel] || SORTING_POOLS[4];
    let filteredPool = pool;
    if (subject !== 'mixed') {
        filteredPool = pool.filter(c => c.subject === subject);
    }
    if (filteredPool.length === 0) return;
    const randomCategory = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    setCurrentCategory(randomCategory);
    const items1 = randomCategory.items1.map(t => ({ id: `1-${t}`, text: t, translation: randomCategory.itemTranslations?.[t], categoryIndex: 1 as 1 | 2 }));
    const items2 = randomCategory.items2.map(t => ({ id: `2-${t}`, text: t, translation: randomCategory.itemTranslations?.[t], categoryIndex: 2 as 1 | 2 }));
    const combined = [...items1, ...items2].sort(() => Math.random() - 0.5);
    setQueue(combined);
    setGameState('playing');
    setLastResult(null);
    setStreak(0);
    setScore(0);
    setLastMatch(null);
  };

  const handleSort = (boxIndex: 1 | 2) => {
    if (queue.length === 0 || lastResult || !currentCategory) return;
    const currentItem = queue[0];
    const subject = currentCategory.subject;
    
    if (currentItem.categoryIndex === boxIndex) {
      SoundEffects.playCorrect();
      setLastResult('correct');
      setScore(s => s + 2);
      setStreak(s => s + 1);
      onCorrect(2, subject);
      onRegisterHistory(currentItem.text);
      setLastMatch({ text: currentItem.text, translation: currentItem.translation });
      setAnimationClass(boxIndex === 1 ? 'animate-fly-left' : 'animate-fly-right');
      const delay = currentItem.translation ? 1100 : 600;
      setTimeout(() => {
        setQueue(prev => prev.slice(1));
        setLastResult(null);
        setAnimationClass('');
      }, delay);
    } else {
      SoundEffects.playWrong();
      onWrong(subject);
      setLastResult('wrong');
      setStreak(0);
      setAnimationClass('animate-shake');
      setTimeout(() => {
        setLastResult(null);
        setAnimationClass('');
      }, 600);
    }
  };

  const renderCategoryLabel = (label: string) => {
    const parts = label.split('(');
    if (parts.length > 1) {
        const mainText = parts[0].trim();
        const subText = parts[1].replace(')', '').trim();
        return (
            <div className="flex flex-col items-center leading-tight">
                <span className="font-bold text-lg sm:text-xl text-gray-900">{mainText}</span>
                <span className="text-sm sm:text-base font-medium text-gray-500 mt-0.5">({subText})</span>
            </div>
        );
    }
    return <span className="font-bold text-lg sm:text-xl text-gray-900 leading-tight">{label}</span>;
  };

  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-6">
        <div className="flex justify-center mb-4"><div className="bg-orange-100 p-4 rounded-full"><Package size={48} className="text-orange-600" /></div></div>
        <div><h2 className="text-2xl font-black text-gray-800">Bilgi Kutuları</h2><p className="text-gray-500 mt-2">Kelimeleri doğru kutulara taşıyarak puanları topla!</p>{totalPlays !== null && (<p className="text-xs font-bold text-gray-400 mt-2 flex items-center justify-center gap-1"><Users size={12}/> {totalPlays.toLocaleString()} kez oynandı</p>)}</div>
        <button onClick={handleStartClick} className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg text-xl flex items-center justify-center gap-2 transition-transform active:scale-95"><Box size={24} /> OYUNA BAŞLA</button>
        <button onClick={onExit} className="mt-2 text-gray-400 font-bold hover:text-gray-600 flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
      </div>
    );
  }

  if (gameState === 'subject_select') {
      const subjects = getAvailableSubjects();
      return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hangi Dersten Oynamak İstersin?</h3>
            <div className="grid grid-cols-2 gap-3">
                {subjects.map(sub => (<button key={sub} onClick={() => startGame(sub)} className="bg-indigo-50 border-2 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-700 py-3 rounded-xl font-bold transition-all">{sub}</button>))}
                <button onClick={() => startGame('mixed')} className="col-span-2 bg-orange-50 border-2 border-orange-100 hover:bg-orange-100 hover:border-orange-300 text-orange-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"><RefreshCw size={18}/> Karışık Oyna</button>
            </div>
            <button onClick={() => setGameState('menu')} className="mt-4 text-gray-400 font-bold hover:text-gray-600 flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
        </div>
      );
  }

  if (gameState === 'finished') {
      return (
          <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-scale-up">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-gray-800 mb-2">Tur Tamamlandı!</h2>
              <div className="text-4xl font-black text-orange-500 mb-6">{score} Puan</div>
              <button onClick={() => startGame(selectedSubject)} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg w-full mb-3 hover:bg-orange-600 transition-colors">Sıradaki Oyun</button>
              <button onClick={() => setGameState('menu')} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold w-full hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
          </div>
      )
  }

  if (queue.length === 0 || !currentCategory) return null;
  const currentItem = queue[0];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6 animate-fade-in min-h-[600px] flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-10">
        <button onClick={() => setGameState('menu')} className="text-gray-400 font-bold text-sm hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={16}/> Geri</button>
        <div className="flex items-center gap-3">
            {streak > 1 && (<div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse"><Zap size={14}/> x{streak}</div>)}
            <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-sm">Puan: {score}</div>
        </div>
      </div>
      <div className="text-center mb-2 z-10"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full flex items-center justify-center gap-2 w-fit mx-auto"><BookOpen size={12}/> {currentCategory.subject}</span></div>
      <div className="w-full h-12 mb-4 flex items-center justify-center z-10">{lastMatch && (<div className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 animate-fade-in shadow-sm w-full justify-center"><span className="text-indigo-400 text-xs uppercase font-bold tracking-wider">Son:</span><span className="font-bold">{lastMatch.text}</span>{lastMatch.translation && (<><span className="text-indigo-300">•</span><span className="text-indigo-600 font-bold">({lastMatch.translation})</span></>)}</div>)}</div>
      <div className="flex-1 flex flex-col items-center justify-between py-2 relative">
          <div className={`w-full flex justify-center items-center flex-1 transition-all duration-300 ${animationClass}`}><div className={`bg-white border-4 border-indigo-200 shadow-2xl rounded-2xl p-6 sm:p-10 text-center transform transition-all hover:scale-105 min-w-[200px] flex flex-col items-center justify-center ${lastResult === 'wrong' ? 'border-red-400 bg-red-50' : lastResult === 'correct' ? 'border-green-400 bg-green-50 scale-0 opacity-0' : ''}`}>{lastResult === 'correct' && <CheckCircle className="absolute -top-4 -right-4 text-green-500 w-8 h-8 bg-white rounded-full" />}{lastResult === 'wrong' && <XCircle className="absolute -top-4 -right-4 text-red-500 w-8 h-8 bg-white rounded-full" />}<span className="text-3xl sm:text-5xl font-black text-gray-800 break-words leading-tight">{currentItem.text}</span></div></div>
          <div className="w-full grid grid-cols-2 gap-4 mt-8 z-10"><button onClick={() => handleSort(1)} className="bg-blue-50 border-b-8 border-blue-500 rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-2 hover:bg-blue-100 transition-all active:border-b-0 active:translate-y-2 group"><div className="bg-blue-200 p-3 rounded-full group-hover:scale-110 transition-transform"><Box className="text-blue-600 w-8 h-8 sm:w-10 sm:h-10" /></div>{renderCategoryLabel(currentCategory.category1)}</button><button onClick={() => handleSort(2)} className="bg-orange-50 border-b-8 border-orange-500 rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-2 hover:bg-orange-100 transition-all active:border-b-0 active:translate-y-2 group"><div className="bg-orange-200 p-3 rounded-full group-hover:scale-110 transition-transform"><Box className="text-orange-600 w-8 h-8 sm:w-10 sm:h-10" /></div>{renderCategoryLabel(currentCategory.category2)}</button></div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl -z-0 opacity-50 pointer-events-none"></div>
      <style>{`.animate-fly-left { animation: flyLeft 0.5s ease-in forwards; } .animate-fly-right { animation: flyRight 0.5s ease-in forwards; } @keyframes flyLeft { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 30% { transform: translate(0, 0) scale(1.1); opacity: 1; } 100% { transform: translate(-150px, 300px) scale(0.2); opacity: 0; } } @keyframes flyRight { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 30% { transform: translate(0, 0) scale(1.1); opacity: 1; } 100% { transform: translate(150px, 300px) scale(0.2); opacity: 0; } }`}</style>
    </div>
  );
};

export default SortingGame;
