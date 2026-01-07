
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Loader2, RefreshCw, Volume2, Sparkles, Wand2 } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { LITERACY_POOL, LiteracyItem } from '../data/literacyPool';

interface LetterItem { 
  char: string; 
  id: string; 
  used: boolean;
  startX: number;
  startY: number;
}

interface LiteracyWordBuilderProps {
    history: string[];
    onRegisterHistory: (words: string[]) => void;
    onExit: () => void;
    onCorrect: (p: number, s: string) => void;
}

const LiteracyWordBuilder: React.FC<LiteracyWordBuilderProps> = ({ history, onRegisterHistory, onExit, onCorrect }) => {
  const [currentWord, setCurrentWord] = useState<LiteracyItem | null>(null);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<LetterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startNewRound = useCallback(() => {
    setLoading(true);
    setIsWon(false);
    setHoverIndex(null);
    setActiveId(null);
    SoundEffects.stopSpeechLoop();
    
    const available = LITERACY_POOL.filter(p => !(history || []).includes(p.text));
    const item = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : LITERACY_POOL[Math.floor(Math.random() * LITERACY_POOL.length)];

    const text = item.text.toUpperCase();
    setCurrentWord({ ...item, text });
    setSlots(new Array(text.length).fill(null));
    
    const letters = text.split('').map((char: string, i: number) => ({ 
      char, 
      id: `l-${i}-${Math.random()}`, 
      used: false,
      startX: 0,
      startY: 0
    }));
    
    setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
    setLoading(false);
    // Kelimenin tamamını bir kez seslendir
    setTimeout(() => SoundEffects.speak(text, 0.8), 500);
  }, [history]);

  useEffect(() => { 
    startNewRound();
    return () => SoundEffects.stopSpeechLoop();
  }, []);

  const onPointerDown = (e: React.PointerEvent, letter: LetterItem) => {
    if (letter.used || isWon) return;
    SoundEffects.resumeContext();
    setActiveId(letter.id);
    setStartPos({ x: e.clientX, y: e.clientY });
    setDragPos({ x: e.clientX, y: e.clientY });
    
    // Harfi seslendir (Örnekle birlikte: B - Bebek)
    SoundEffects.speakLetterWithExample(letter.char);
    // Sürekli harf sesini (döngü) başlat
    SoundEffects.startSpeechLoop(letter.char);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!activeId) return;
    setDragPos({ x: e.clientX, y: e.clientY });

    let bestIdx: number | null = null;
    let minDistance = 100;

    slotRefs.current.forEach((ref, idx) => {
      if (ref && !slots[idx]) {
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        if (distance < minDistance) {
          minDistance = distance;
          bestIdx = idx;
        }
      }
    });
    setHoverIndex(bestIdx);
  }, [activeId, slots]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!activeId || !currentWord) return;
    SoundEffects.stopSpeechLoop();
    const letter = shuffledLetters.find(l => l.id === activeId);
    if (!letter) return;

    if (hoverIndex !== null && currentWord.text[hoverIndex] === letter.char) {
      const newSlots = [...slots];
      newSlots[hoverIndex] = letter.char;
      setSlots(newSlots);
      setShuffledLetters(prev => prev.map(l => l.id === activeId ? { ...l, used: true } : l));
      SoundEffects.playCorrect();

      if (newSlots.every(s => s !== null)) {
        setIsWon(true);
        onRegisterHistory([currentWord.text]);
        onCorrect(5, 'Türkçe');
        setTimeout(() => SoundEffects.speak(currentWord.text, 0.7), 600);
      }
    } else {
      SoundEffects.playWrong();
    }
    setActiveId(null);
    setHoverIndex(null);
  }, [activeId, currentWord, shuffledLetters, slots, hoverIndex, onCorrect, onRegisterHistory]);

  useEffect(() => {
    if (activeId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeId, handlePointerMove, handlePointerUp]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-4 sm:p-6 animate-fade-in flex flex-col items-center border-4 border-indigo-50 relative h-[calc(100vh-100px)] min-h-[650px] touch-none select-none overflow-hidden">
      {loading && (
          <div className="absolute inset-0 z-[100] bg-white/95 rounded-[3rem] flex flex-col items-center justify-center">
              <Loader2 size={64} className="text-indigo-500 animate-spin mb-4" />
              <p className="font-black text-indigo-900 tracking-tighter text-xl uppercase">Hazırlanıyor...</p>
          </div>
      )}

      <div className="w-full flex justify-between items-center mb-4 shrink-0">
        <button onClick={onExit} className="bg-slate-100 px-4 py-2 rounded-full text-slate-500 font-bold hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-1">
          <ArrowLeft size={18}/> Kapat
        </button>
        <button onClick={() => SoundEffects.speak(currentWord?.text || "", 0.7)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 shadow-sm transition-all border-b-4 border-indigo-200">
          <Volume2 size={24} />
        </button>
      </div>

      <div className="w-28 h-28 bg-gradient-to-b from-indigo-50 to-white rounded-full flex items-center justify-center text-[4rem] shadow-xl border-4 border-white mb-6 shrink-0 transform hover:scale-110 transition-transform">
        {currentWord?.emoji || '❓'}
      </div>
      
      <div className="flex gap-4 sm:gap-6 mb-12 flex-wrap justify-center min-h-[110px] shrink-0">
        {slots.map((char, i) => (
            <div 
              key={i} 
              ref={el => { slotRefs.current[i] = el; }}
              className={`
                w-16 h-24 sm:w-20 sm:h-28 rounded-3xl border-4 flex items-center justify-center text-4xl sm:text-6xl font-black transition-all duration-200 relative
                ${char 
                    ? 'bg-white border-green-500 text-green-600 shadow-xl scale-105' 
                    : hoverIndex === i 
                        ? 'bg-indigo-50 border-indigo-500 border-solid scale-110 shadow-[0_0_30px_rgba(79,70,229,0.4)] ring-4 ring-indigo-200'
                        : 'bg-slate-50 border-slate-200 border-dashed'}
              `}
            >
                {!char && currentWord && <span className="opacity-[0.05] text-black">{currentWord.text[i]}</span>}
                {char || ''}
            </div>
        ))}
      </div>

      <div className="w-full bg-slate-50/80 rounded-[2.5rem] p-6 sm:p-8 flex flex-wrap justify-center gap-4 sm:gap-5 flex-1 items-center border-4 border-white shadow-inner relative overflow-visible">
          {shuffledLetters.map((l) => {
              const isDragging = activeId === l.id;
              const x = isDragging ? dragPos.x - startPos.x : 0;
              const y = isDragging ? dragPos.y - startPos.y : 0;
              return (
                <div 
                  key={l.id} 
                  onPointerDown={(e) => onPointerDown(e, l)}
                  style={{
                    transform: `translate3d(${x}px, ${y}px, 0) ${isDragging ? 'scale(1.3) rotate(5deg)' : 'scale(1)'}`,
                    zIndex: isDragging ? 50 : 10,
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s'
                  }}
                  className={`
                      w-14 h-14 sm:w-18 sm:h-18 rounded-2xl border-b-8 flex items-center justify-center text-2xl sm:text-3xl font-black shadow-xl cursor-grab active:cursor-grabbing touch-none transition-opacity
                      ${l.used ? 'opacity-0 pointer-events-none' : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400'}
                      ${isDragging ? 'shadow-2xl opacity-90 border-indigo-500 bg-indigo-50' : ''}
                  `}
                >
                  {l.char}
                </div>
              );
          })}
      </div>

      {isWon && (
          <div className="absolute inset-0 z-[110] bg-white/95 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center p-6 animate-fade-in text-center">
              <div className="bg-green-100 p-6 rounded-full mb-6 border-4 border-white shadow-2xl animate-bounce">
                <Wand2 size={80} className="text-green-600" />
              </div>
              <h3 className="text-4xl font-black text-green-700 mb-2 tracking-tighter">MÜKEMMEL!</h3>
              <p className="text-slate-500 font-black text-xl mb-10 uppercase tracking-widest">{currentWord?.text}</p>
              <button 
                onClick={startNewRound} 
                className="bg-green-500 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-xl shadow-green-200 hover:bg-green-600 flex items-center gap-4 transition-all hover:scale-105 border-b-8 border-green-700"
              >
                SIRADAKİ KELİME <RefreshCw size={28}/>
              </button>
          </div>
      )}
    </div>
  );
};

export default LiteracyWordBuilder;
