
import React, { useState, useEffect } from 'react';
import { GradeLevel, ScrabbleData, Subject } from '../types';
import { SCRABBLE_POOL } from '../data/scrabblePool';
import { RefreshCw, Trophy, Lightbulb, CheckCircle2, XCircle, Users, Shuffle, RotateCcw, List, ArrowLeft } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { getGameStats } from '../src/firebase';

interface ScrabbleGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number, subject?: string) => void;
  onWrong: () => void;
}

const ScrabbleGame: React.FC<ScrabbleGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong }) => {
  const [currentData, setCurrentData] = useState<ScrabbleData | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<{id: number, char: string, used: boolean}[]>([]);
  const [currentInput, setCurrentInput] = useState<{id: number, char: string}[]>([]);
  
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [mainWordFound, setMainWordFound] = useState(false);
  
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'|'info'} | null>(null);
  
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  useEffect(() => {
    getGameStats('Kelime Türetmece').then(setTotalPlays);
    startNewRound();
  }, [gradeLevel]);

  const startNewRound = () => {
    const rawPool = SCRABBLE_POOL[gradeLevel] || SCRABBLE_POOL[4];
    const pool = rawPool.filter(d => d.word.length >= 3);
    
    if (pool.length === 0) {
        onExit();
        return;
    }

    const data = pool[Math.floor(Math.random() * pool.length)];
    
    const letters = data.word.split('').map((char, i) => ({ id: i, char, used: false }));
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    setCurrentData(data);
    setScrambledLetters(letters);
    setCurrentInput([]);
    setFoundWords([]);
    setMainWordFound(false);
    setShowHint(false);
    setMessage(null);
  };

  const handleLetterClick = (id: number, char: string) => {
    setScrambledLetters(prev => prev.map(l => l.id === id ? { ...l, used: true } : l));
    setCurrentInput(prev => [...prev, { id, char }]);
    setMessage(null);
  };

  const handleInputSlotClick = (index: number) => {
    const itemToRemove = currentInput[index];
    const newInput = [...currentInput];
    newInput.splice(index, 1);
    setCurrentInput(newInput);
    
    setScrambledLetters(prev => prev.map(l => l.id === itemToRemove.id ? { ...l, used: false } : l));
    setMessage(null);
  };

  const handleClear = () => {
      setScrambledLetters(prev => prev.map(l => ({ ...l, used: false })));
      setCurrentInput([]);
      setMessage(null);
  };

  const handleShuffle = () => {
      const shuffled = [...scrambledLetters];
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setScrambledLetters(shuffled);
  };

  const checkWord = () => {
      if (!currentData) return;
      
      const formedWord = currentInput.map(l => l.char).join('');
      
      // Harf sınırı 2'ye indirildi (AŞ, AT, EL gibi kelimeler için)
      if (formedWord.length < 2) {
          setMessage({ text: "En az 2 harf seçmelisin!", type: 'error' });
          SoundEffects.playWrong();
          return;
      }

      if (foundWords.includes(formedWord)) {
          setMessage({ text: "Bu kelimeyi zaten buldun!", type: 'info' });
          handleClear();
          return;
      }

      if (formedWord === currentData.word) {
          setMainWordFound(true);
          if (!foundWords.includes(formedWord)) {
              setFoundWords(prev => [formedWord, ...prev]);
              const points = showHint ? 5 : 10;
              setScore(s => s + points);
              onCorrect(points, Subject.TURKISH);
              SoundEffects.playCorrect();
              setMessage({ text: `HARİKA! Ana Kelimeyi Buldun! (+${points})`, type: 'success' });
          }
          handleClear();
          return;
      }

      if (currentData.subWords && currentData.subWords.includes(formedWord)) {
          setFoundWords(prev => [formedWord, ...prev]);
          const points = formedWord.length;
          setScore(s => s + points);
          onCorrect(points, Subject.TURKISH);
          SoundEffects.playCorrect();
          setMessage({ text: `Güzel! +${points} Puan`, type: 'success' });
          handleClear();
          return;
      }

      setMessage({ text: "Böyle bir kelime yok veya listede değil.", type: 'error' });
      SoundEffects.playWrong();
      onWrong();
  };

  if (!currentData) return null;

  const totalSubWords = (currentData.subWords?.length || 0) + 1;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6 animate-fade-in min-h-[600px] flex flex-col md:flex-row gap-6">
      
      <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="text-gray-400 font-bold hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={16} /> Geri</button>
            <div className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-xl font-black text-xl flex items-center gap-2">
                <Trophy size={18} /> {score}
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Kelime Türetmece</h2>
            <p className="text-gray-500 text-sm">Harfleri kullanarak gizli kelimeleri bul!</p>
            <div className="mt-4 flex justify-center gap-1">
                {currentData.word.split('').map((_, i) => (
                    <div key={i} className={`w-8 h-10 border-b-4 flex items-center justify-center font-bold text-xl ${mainWordFound ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-gray-300'}`}>
                        {mainWordFound ? currentData.word[i] : '?'}
                    </div>
                ))}
            </div>
          </div>

          <div className="min-h-[80px] bg-gray-50 rounded-2xl border-2 border-gray-100 mb-6 flex items-center justify-center p-4 gap-2 flex-wrap">
              {currentInput.length === 0 && <span className="text-gray-400 text-sm italic">Harflere tıkla...</span>}
              {currentInput.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    onClick={() => handleInputSlotClick(idx)}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-b-4 border-indigo-200 rounded-lg text-indigo-700 font-black text-xl shadow-sm hover:-translate-y-1 transition-transform"
                  >
                      {item.char}
                  </button>
              ))}
          </div>
          
          <div className="h-8 mb-4 flex justify-center">
              {message && (
                  <div className={`px-4 py-1 rounded-full text-sm font-bold animate-bounce ${
                      message.type === 'success' ? 'bg-green-100 text-green-700' : 
                      message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'
                  }`}>
                      {message.text}
                  </div>
              )}
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {scrambledLetters.map((item, idx) => (
                <button
                    key={`${item.id}-${idx}-pool`}
                    onClick={() => !item.used && handleLetterClick(item.id, item.char)}
                    disabled={item.used}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-b-4 flex items-center justify-center text-2xl font-bold transition-all active:scale-95 ${
                        item.used 
                        ? 'opacity-20 pointer-events-none bg-gray-200 border-gray-300' 
                        : 'bg-yellow-400 border-yellow-600 text-white shadow-md hover:bg-yellow-300'
                    }`}
                >
                    {item.char}
                </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-auto">
             <button onClick={handleClear} className="col-span-1 bg-gray-200 text-gray-600 rounded-xl py-3 font-bold hover:bg-gray-300 transition-colors flex flex-col items-center justify-center text-xs sm:text-sm">
                 <RotateCcw size={18} className="mb-1"/> Temizle
             </button>
             <button onClick={handleShuffle} className="col-span-1 bg-blue-100 text-blue-600 rounded-xl py-3 font-bold hover:bg-blue-200 transition-colors flex flex-col items-center justify-center text-xs sm:text-sm">
                 <Shuffle size={18} className="mb-1"/> Karıştır
             </button>
             <button 
                onClick={checkWord} 
                disabled={currentInput.length === 0}
                className="col-span-2 bg-indigo-600 text-white rounded-xl py-3 font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
             >
                 <CheckCircle2 /> KONTROL ET
             </button>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
              {!showHint ? (
                  <button onClick={() => setShowHint(true)} className="text-xs text-gray-400 hover:text-yellow-600 flex items-center gap-1">
                      <Lightbulb size={12} /> İpucu
                  </button>
              ) : (
                  <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded">İpucu: {currentData.hint}</span>
              )}

              {foundWords.length >= totalSubWords && (
                  <button onClick={startNewRound} className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-bold hover:bg-green-600 flex items-center gap-1 animate-pulse">
                      Sonraki Seviye <RefreshCw size={12}/>
                  </button>
              )}
          </div>
      </div>

      <div className="w-full md:w-64 bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col h-64 md:h-auto">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <List size={18}/> Bulunanlar
              </h3>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {foundWords.length} / {totalSubWords > 50 ? '?' : totalSubWords}
              </span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {foundWords.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8 italic">
                      Henüz kelime bulunamadı.
                  </div>
              )}
              {foundWords.map((word, idx) => (
                  <div key={idx} className={`p-2 rounded-lg font-bold text-sm flex justify-between items-center ${word === currentData.word ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-gray-700 border border-gray-100'}`}>
                      <span>{word}</span>
                      <span className="text-xs opacity-50">{word.length} Puan</span>
                  </div>
              ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              {totalPlays !== null && (
                <div className="text-[10px] font-bold text-gray-400 flex items-center justify-center gap-1">
                    <Users size={10}/> {totalPlays.toLocaleString()} kez oynandı
                </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default ScrabbleGame;
