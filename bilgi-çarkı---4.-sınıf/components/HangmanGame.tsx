
import React, { useState, useEffect, useMemo } from 'react';
import { GradeLevel, Subject } from '../types';
import { HANGMAN_POOLS, HangmanCategory, HangmanWord } from '../data/hangmanPool';
import { ArrowLeft, Lightbulb, RefreshCw, Trophy, Heart, BookOpen, Globe, Smile, Star, HelpCircle, Users } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { getGameStats, updateGlobalStats } from '../src/firebase';

interface HangmanGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number, subject: string) => void;
  onWrong: (subject: string) => void;
  history: string[];
  onRegisterHistory: (word: string) => void;
}

const ALPHABET_TR = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
const ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Çiçek bileşeni dışarı alındı ve memoize edildi
// Sadece yanlış sayısı değiştiğinde (props.count) yeniden çizilir
const Flower = React.memo(({ count, isGameOver }: { count: number, isGameOver: boolean }) => {
  const petals = [0, 60, 120, 180, 240, 300];
  
  return (
    <div className={`relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-4 mt-8 flex flex-col items-center justify-end transition-all duration-700 ${isGameOver && count >= 6 ? 'grayscale opacity-60' : ''}`}>
      {/* Saksı ve Sap */}
      <div className="absolute bottom-0 w-24 h-20 bg-[#8D6E63] rounded-b-[2rem] rounded-t-sm shadow-md z-20 border-t-8 border-[#6D4C41]"></div>
      <div className="absolute bottom-16 w-4 h-24 bg-green-500 z-10 rounded-full"></div>
      
      {/* Yapraklar (Gövdedeki yeşil yapraklar) */}
      <div className="absolute bottom-24 right-[50%] w-10 h-5 bg-green-400 rounded-full rounded-tr-none -rotate-[30deg] origin-right shadow-sm border-b-2 border-green-600/20 translate-x-1"></div>
      <div className="absolute bottom-32 left-[50%] w-9 h-4 bg-green-400 rounded-full rounded-tl-none rotate-[30deg] origin-left shadow-sm border-b-2 border-green-600/20 -translate-x-1"></div>

      {/* Çiçek Kafası ve Taç Yapraklar */}
      <div className="absolute top-0 left-1/2 w-0 h-0 z-30">
        {petals.map((angle, index) => {
          const isJustFallen = index === count - 1; // Tam şu an düşen yaprak
          const isAlreadyFallen = index < count - 1; // Daha önce düşmüş olanlar
          
          return (
            <div 
              key={index} 
              className={`absolute left-1/2 top-1/2 w-12 h-16 rounded-full border-2 border-white/40 shadow-sm origin-bottom z-20 transition-opacity duration-300 
                ${isJustFallen ? 'bg-pink-300 animate-petal-fall' : isAlreadyFallen ? 'opacity-0' : 'bg-[#FF4081]'}`}
              style={{ 
                marginLeft: '-1.5rem', 
                marginTop: '-4rem', 
                transform: `rotate(${angle}deg) translateY(-35px)` 
              }}
            ></div>
          );
        })}

        {/* Çiçek Merkezi (Gözlü Gülen Yüz) */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#FFEB3B] rounded-full z-40 shadow-lg flex flex-col items-center justify-center border-4 border-[#FBC02D]">
          <div className="flex gap-4 mb-1">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          <div className={`w-8 h-3 border-b-4 border-black rounded-full transition-all duration-500 ${count >= 4 ? 'border-t-4 border-b-0 mt-3' : ''}`}></div>
        </div>
      </div>
    </div>
  );
});

const HangmanGame: React.FC<HangmanGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong, history, onRegisterHistory }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [category, setCategory] = useState<HangmanCategory>('english');
  const [totalPlays, setTotalPlays] = useState<number | null>(null);
  
  const [currentWordData, setCurrentWordData] = useState<HangmanWord | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  
  const MAX_WRONG = 6;

  useEffect(() => {
    getGameStats('Kelime Tahmin').then(setTotalPlays);
  }, []);

  const getSubjectName = (cat: HangmanCategory) => {
      if (cat === 'english') return 'İngilizce';
      if (cat === 'turkish') return 'Türkçe';
      return 'Din Kültürü';
  };

  const startGame = (selectedCat: HangmanCategory) => {
    setCategory(selectedCat);
    const gradePools = HANGMAN_POOLS[gradeLevel] || HANGMAN_POOLS[4];
    let pool = gradePools[selectedCat];
    const available = pool.filter(item => !history.includes(item.word));
    const selectionSource = available.length > 0 ? available : pool;
    const randomItem = selectionSource[Math.floor(Math.random() * selectionSource.length)];
    setCurrentWordData(randomItem);
    setGuessedLetters(new Set());
    setWrongCount(0);
    setHintUsed(false);
    setGameState('playing');
    updateGlobalStats('game', 'Kelime Tahmin');
  };

  const handleGuess = (letter: string) => {
    if (gameState !== 'playing' || !currentWordData || guessedLetters.has(letter)) return;
    
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);
    
    const upperWord = currentWordData.word.toUpperCase();
    if (upperWord.includes(letter)) {
        SoundEffects.playCorrect();
        const isWin = upperWord.split('').every(char => newGuessed.has(char) || char === ' ');
        if (isWin) handleWin();
    } else {
        SoundEffects.playWrong();
        const subject = getSubjectName(category);
        setWrongCount(prev => {
            const newCount = prev + 1;
            if (newCount >= MAX_WRONG) handleLoss();
            return newCount;
        });
        onWrong(subject);
    }
  };

  const handleWin = () => {
      let points = hintUsed ? 1 : 2;
      const subjectName = getSubjectName(category);
      onCorrect(points, subjectName);
      if (currentWordData) onRegisterHistory(currentWordData.word);
      setTimeout(() => setGameState('result'), 1000);
  };

  const handleLoss = () => {
      setTimeout(() => setGameState('result'), 1000); 
  };

  const currentAlphabet = category === 'english' ? ALPHABET_EN : ALPHABET_TR;

  if (gameState === 'menu') {
      return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-6">
            <div className="flex justify-center mb-2"><div className="bg-pink-100 p-6 rounded-full shadow-inner ring-4 ring-pink-50"><Smile size={64} className="text-pink-500" /></div></div>
            <div><h2 className="text-3xl font-black text-gray-800 mb-2">Kelime Tahmin</h2><p className="text-gray-500 font-medium text-sm sm:text-base px-4">Çiçeğin yaprakları dökülmeden gizli kelimeyi bulabilir misin?</p>{totalPlays !== null && <p className="text-xs font-bold text-gray-400 mt-2 flex items-center justify-center gap-1"><Users size={12}/> {totalPlays.toLocaleString()} kez oynandı</p>}</div>
            <div className="flex flex-col gap-3 mt-2">
              <button onClick={() => startGame('english')} className="bg-purple-50 border-2 border-purple-100 hover:bg-purple-100 text-purple-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg group shadow-sm hover:shadow-md"><Globe size={24}/> İngilizce Kelimeler</button>
              <button onClick={() => startGame('turkish')} className="bg-red-50 border-2 border-red-100 hover:bg-red-100 text-red-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg group shadow-sm hover:shadow-md"><BookOpen size={24}/> Türkçe Kavramlar</button>
              <button onClick={() => startGame('religion')} className="bg-green-50 border-2 border-green-100 hover:bg-green-100 text-green-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg group shadow-sm hover:shadow-md"><Heart size={24}/> Din Kültürü</button>
            </div>
            <button onClick={onExit} className="mt-2 text-gray-400 font-bold hover:text-gray-600 text-sm flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
        </div>
      );
  }

  const renderWord = () => {
      if (!currentWordData) return null;
      return (
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-6 px-2 min-h-[50px]">
            {currentWordData.word.toUpperCase().split('').map((char, index) => { 
              if (char === ' ') return <div key={index} className="w-4 sm:w-6"></div>; 
              const isGuessed = guessedLetters.has(char); 
              // Fix: Changed logic to rely on wrongCount to avoid unreachable type narrowing error with gameState
              const isLost = wrongCount >= MAX_WRONG; 
              return ( 
                <div key={index} className={`w-8 h-10 sm:w-10 sm:h-12 flex items-center justify-center text-xl sm:text-2xl font-black rounded-lg shadow-sm border-b-4 transition-all duration-300 ${isGuessed ? 'bg-white border-indigo-200 text-indigo-700' : isLost ? 'bg-red-50 border-red-200 text-red-500' : 'bg-indigo-50/50 border-indigo-100 text-transparent'}`}> 
                  {isGuessed || isLost ? char : '_'} 
                </div> 
              ); 
            })}
          </div>
      );
  };

  if (gameState === 'result') {
      const isWin = wrongCount < MAX_WRONG;
      return (
          <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-scale-up border-4 border-white ring-4 ring-indigo-50">
            {isWin ? <div className="relative inline-block mb-6"><Trophy className="w-28 h-28 text-yellow-400 mx-auto drop-shadow-lg" /><Star className="w-10 h-10 text-orange-400 absolute -top-1 -right-1 animate-spin-slow" fill="currentColor" /></div> : <div className="text-8xl mb-6 grayscale opacity-50">🥀</div>}
            <h2 className={`text-4xl font-black mb-2 ${isWin ? 'text-green-500' : 'text-gray-400'}`}>{isWin ? 'HARİKA!' : 'BİLEMEDİN'}</h2>
            <div className="bg-indigo-50 rounded-2xl p-4 mb-4 border border-indigo-100">
              <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest mb-1">DOĞRU CEVAP</p>
              <p className="text-3xl text-indigo-800 font-black tracking-widest">{currentWordData?.word}</p>
            </div>
            <div className="bg-white border-2 border-indigo-50 rounded-xl p-4 mb-6 text-left shadow-sm">
              <div className="mb-3">
                <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block mb-1 flex items-center gap-1"><Lightbulb size={12} /> ANLAMI</span>
                <p className="text-gray-700 font-medium leading-snug text-sm">{currentWordData?.hint}</p>
              </div>
              {currentWordData?.example && <div className="pt-3 border-t border-indigo-50"><span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block mb-1">ÖRNEK CÜMLE</span><p className="text-indigo-600 italic text-sm">"{currentWordData?.example}"</p></div>}
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => startGame(category)} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"><RefreshCw size={24}/> Yeni Kelime</button>
              <button onClick={() => setGameState('menu')} className="bg-white border-2 border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
            </div>
          </div>
      );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 animate-fade-in min-h-[600px] flex flex-col border-2 border-white/50">
      <div className="flex justify-between items-center mb-4 mt-2">
        <button onClick={() => setGameState('menu')} className="text-gray-400 font-bold text-sm hover:text-gray-600 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"><ArrowLeft size={16}/> Geri</button>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
          {category === 'english' ? <Globe size={16} className="text-indigo-500"/> : category === 'religion' ? <Heart size={16} className="text-indigo-500"/> : <BookOpen size={16} className="text-indigo-500"/>}
          <span className="text-sm font-black text-indigo-600 uppercase tracking-wider">
            {category === 'english' ? 'İngilizce' : category === 'turkish' ? 'Türkçe' : 'Din Kültürü'}
          </span>
        </div>
        <div className="w-16"></div>
      </div>
      
      {/* Flower Bileşeni memoize edildiği için doğru tahminlerde animasyon tetiklenmez */}
      <div className="flex-shrink-0 mb-6 bg-gradient-to-b from-blue-50/50 to-white rounded-3xl border border-blue-50/30 pt-12 pb-2 mt-4 relative overflow-visible">
        <Flower count={wrongCount} isGameOver={wrongCount >= MAX_WRONG} />
      </div>

      {renderWord()}

      <div className="text-center mb-6 min-h-[3.5rem] flex flex-col items-center justify-center px-4">
        {hintUsed ? (
          <div className="bg-yellow-50 text-yellow-800 px-5 py-3 rounded-xl text-sm font-medium animate-fade-in border border-yellow-200 shadow-sm flex items-start gap-2 max-w-md">
            <Lightbulb size={20} className="text-yellow-600 shrink-0 mt-0.5" /> 
            <span className="text-left leading-relaxed">{currentWordData?.hint}</span>
          </div>
        ) : (
          <button onClick={() => setHintUsed(true)} className="group flex items-center gap-2 text-sm font-bold transition-all bg-white border-2 border-gray-100 text-gray-500 px-5 py-2.5 rounded-full hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 shadow-sm" disabled={wrongCount >= MAX_WRONG}>
            <HelpCircle size={18}/> İpucu Al (Puan Yarıya Düşer)
          </button>
        )}
      </div>

      <div className="mt-auto">
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2 max-w-2xl mx-auto">
          {currentAlphabet.map((letter) => { 
            const isGuessed = guessedLetters.has(letter); 
            const isCorrect = isGuessed && currentWordData?.word.toUpperCase().includes(letter); 
            const isWrong = isGuessed && !currentWordData?.word.toUpperCase().includes(letter); 
            let btnClass = "aspect-square rounded-xl font-bold text-lg sm:text-xl transition-all shadow-[0_3px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[3px] border-b-2 "; 
            
            if (isCorrect) btnClass += "bg-green-500 text-white border-green-600 opacity-50 cursor-default scale-95"; 
            else if (isWrong) btnClass += "bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-default scale-95"; 
            else btnClass += "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-0.5"; 
            
            return <button key={letter} onClick={() => handleGuess(letter)} disabled={isGuessed || wrongCount >= MAX_WRONG} className={btnClass}>{letter}</button>; 
          })}
        </div>
      </div>
      
      <style>{` 
        @keyframes floatDown { 
          0% { transform: rotate(0deg) translate(0, 0); opacity: 1; } 
          25% { transform: rotate(20deg) translate(20px, 60px); } 
          50% { transform: rotate(-20deg) translate(-20px, 140px); } 
          75% { transform: rotate(10deg) translate(10px, 220px); opacity: 0.8; } 
          100% { transform: rotate(0deg) translate(0, 300px); opacity: 0; } 
        } 
        .animate-petal-fall { animation: floatDown 2s ease-in-out forwards; } 
      `}</style>
    </div>
  );
};

export default HangmanGame;
