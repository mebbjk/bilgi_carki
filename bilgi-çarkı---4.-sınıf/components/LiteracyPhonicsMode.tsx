
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Loader2, RefreshCw, Volume2, CheckCircle2, Star } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { LITERACY_POOL, LiteracyItem } from '../data/literacyPool';
import { BINGO_POOLS } from '../data/bingoPool';

interface LiveLetter {
  char: string;
  id: string;
  used: boolean;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
}

interface SlotRect {
  index: number;
  centerX: number;
  centerY: number;
}

interface LiteracyPhonicsModeProps {
  history: string[];
  onRegisterHistory: (words: string[]) => void;
  onExit: () => void;
  onCorrect: (p: number, s: string) => void;
}

const COLORS = ['#FF4081', '#7C4DFF', '#00BCD4', '#4CAF50', '#FFC107', '#FF5722', '#3F51B5', '#E91E63'];
const WIN_MESSAGES = ["SÜPER!", "MÜKEMMEL!", "HARİKA!", "BÜYÜLEYİCİ!", "VAY CANINA!", "ÇOK HIZLISIN!", "ŞAMPİYON!"];
const WIN_EMOJIS = ["🌟", "🔥", "🏆", "🎯", "🚀", "🌈", "🎈"];

const LiteracyPhonicsMode: React.FC<LiteracyPhonicsModeProps> = ({ history, onRegisterHistory, onExit, onCorrect }) => {
  const [currentWord, setCurrentWord] = useState<LiteracyItem | null>(null);
  const [exampleSentence, setExampleSentence] = useState<string>("");
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [liveLetters, setLiveLetters] = useState<LiveLetter[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [winContent, setWinContent] = useState({ text: "", emoji: "" });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cachedSlotRects = useRef<SlotRect[]>([]);

  const updateCachedRects = useCallback(() => {
    cachedSlotRects.current = slotRefs.current.map((ref, idx) => {
      if (!ref) return null;
      const rect = ref.getBoundingClientRect();
      return {
        index: idx,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      };
    }).filter(Boolean) as SlotRect[];
  }, []);

  const createBurst = (x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random(),
      x,
      y,
      color,
      size: Math.random() * 15 + 5,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 800);
  };

  const startNewRound = useCallback(() => {
    setLoading(true);
    setShowSentence(false);
    setHoverIndex(null);
    setActiveId(null);
    SoundEffects.stopSpeechLoop();

    const available = LITERACY_POOL.filter(p => !history.includes(p.text));
    const item = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : LITERACY_POOL[Math.floor(Math.random() * LITERACY_POOL.length)];

    const bingoItem = BINGO_POOLS[1].find(b => b[1].toUpperCase() === item.text.toUpperCase());
    setExampleSentence(bingoItem ? bingoItem[2] : `${item.text} harika bir kelime!`);

    const text = item.text.toUpperCase();
    setCurrentWord({ ...item, text });
    setSlots(new Array(text.length).fill(null));

    const letters = text.split('').map((char, i) => ({
      char,
      id: `live-${i}-${Math.random()}`,
      used: false,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    setLiveLetters([...letters].sort(() => Math.random() - 0.5));
    setLoading(false);
    
    setTimeout(() => {
        SoundEffects.speak(text, 0.7);
        updateCachedRects(); 
    }, 600);
  }, [history, updateCachedRects]);

  useEffect(() => {
    startNewRound();
    return () => SoundEffects.stopSpeechLoop();
  }, []);

  useEffect(() => {
      window.addEventListener('resize', updateCachedRects);
      return () => window.removeEventListener('resize', updateCachedRects);
  }, [updateCachedRects]);

  const onPointerDown = (e: React.PointerEvent, letter: LiveLetter) => {
    if (letter.used || showSentence) return;
    
    e.preventDefault(); 
    (e.target as Element).setPointerCapture(e.pointerId); // Pointer capture ekledik

    SoundEffects.resumeContext();
    setActiveId(letter.id);
    
    setStartPos({ x: e.clientX, y: e.clientY });
    setDragPos({ x: e.clientX, y: e.clientY });
    
    SoundEffects.startSpeechLoop(letter.char);
    updateCachedRects();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeId) return;
    e.preventDefault(); 

    setDragPos({ x: e.clientX, y: e.clientY });

    let bestIdx: number | null = null;
    let minDistance = 80;

    cachedSlotRects.current.forEach((rect) => {
      if (!slots[rect.index]) {
        const distance = Math.sqrt(Math.pow(e.clientX - rect.centerX, 2) + Math.pow(e.clientY - rect.centerY, 2));
        if (distance < minDistance) {
          minDistance = distance;
          bestIdx = rect.index;
        }
      }
    });
    setHoverIndex(bestIdx);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeId) return;
    e.preventDefault();
    (e.target as Element).releasePointerCapture(e.pointerId);

    if (!currentWord) {
        setActiveId(null);
        return;
    }

    SoundEffects.stopSpeechLoop();
    
    const letter = liveLetters.find(l => l.id === activeId);
    if (!letter) {
        setActiveId(null);
        return;
    }

    if (hoverIndex !== null && currentWord.text[hoverIndex] === letter.char) {
      const newSlots = [...slots];
      newSlots[hoverIndex] = letter.char;
      setSlots(newSlots);
      setLiveLetters(prev => prev.map(l => l.id === activeId ? { ...l, used: true } : l));
      
      SoundEffects.playCorrect();
      createBurst(e.clientX, e.clientY, letter.color);

      if (newSlots.every(s => s !== null)) {
        handleWin();
      }
    } else {
      SoundEffects.playWrong();
    }
    setActiveId(null);
    setHoverIndex(null);
  };

  const handleWin = () => {
    setWinContent({
      text: WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
      emoji: WIN_EMOJIS[Math.floor(Math.random() * WIN_EMOJIS.length)]
    });
    onRegisterHistory([currentWord!.text]);
    onCorrect(5, 'Türkçe');
    
    setTimeout(() => {
        SoundEffects.speak(currentWord!.text, 0.6, () => {
            setTimeout(() => {
                setShowSentence(true);
                SoundEffects.speak(exampleSentence, 0.9);
            }, 800);
        });
    }, 1000);
  };

  const slotSize = useMemo(() => {
    if (!currentWord) return 'w-20 h-28';
    const len = currentWord.text.length;
    if (len > 8) return 'w-12 h-16 sm:w-14 sm:h-20 text-4xl sm:text-5xl';
    if (len > 6) return 'w-14 h-20 sm:w-18 sm:h-24 text-5xl sm:text-7xl';
    return 'w-20 h-28 sm:w-24 sm:h-32 text-6xl sm:text-8xl';
  }, [currentWord]);

  return (
    <div 
        className="fixed inset-0 z-50 bg-[#F0F9FF] flex flex-col items-center overflow-hidden font-sans touch-none"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 animate-pulse"><Star size={100} fill="#FFD700" /></div>
        <div className="absolute bottom-10 right-10 animate-bounce-slow"><Star size={120} fill="#FF4081" /></div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[300] bg-white flex flex-col items-center justify-center">
          <Loader2 size={80} className="text-yellow-500 animate-spin" />
          <p className="text-2xl font-black mt-4 text-slate-400 uppercase tracking-widest">Hazırlanıyor...</p>
        </div>
      )}

      {particles.map(p => (
        <div 
            key={p.id}
            className="fixed pointer-events-none z-[150] animate-particle-fade"
            style={{ 
                left: p.x, 
                top: p.y, 
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                transform: `translate(${p.vx * 10}px, ${p.vy * 10}px)`
            }}
        ></div>
      ))}

      <div className="w-full flex justify-between items-center p-4 sm:p-6 relative z-10 pointer-events-none">
        <button onClick={onExit} className="bg-white/80 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full text-slate-600 font-black hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 shadow-lg border-2 border-white pointer-events-auto text-sm sm:text-base">
          <ArrowLeft size={20}/> ÇIK
        </button>
        <div className="flex gap-4 pointer-events-auto">
            <button onClick={() => SoundEffects.speak(currentWord?.text || "", 0.8)} className="p-3 sm:p-4 bg-white rounded-2xl text-yellow-600 shadow-lg border-2 border-white active:scale-95 transition-transform">
                <Volume2 size={24} />
            </button>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-12 flex-wrap justify-center items-end min-h-[140px] relative z-[5] w-full px-4">
        {slots.map((char, i) => (
          <div 
            key={i} 
            ref={el => { slotRefs.current[i] = el; }}
            className={`
              ${slotSize} rounded-[1.5rem] sm:rounded-[2rem] border-4 flex items-center justify-center font-black transition-all duration-200 relative
              ${char 
                  ? 'bg-white border-green-500 text-green-600 shadow-xl scale-105 z-10' 
                  : hoverIndex === i 
                      ? 'bg-yellow-100 border-yellow-500 scale-110 shadow-[0_0_40px_rgba(255,193,7,0.5)] ring-4 ring-yellow-50 z-20'
                      : 'bg-slate-200/20 border-slate-300/40 border-dashed z-0'}
            `}
          >
            {!char && currentWord && (
                <span className="opacity-[0.06] pointer-events-none select-none text-black absolute inset-0 flex items-center justify-center">
                    {currentWord.text[i]}
                </span>
            )}
            {char || ''}
          </div>
        ))}
      </div>

      <div className="w-full max-w-5xl px-4 sm:px-8 flex flex-wrap justify-center gap-4 sm:gap-10 flex-1 items-start sm:items-center relative z-20 overflow-visible">
        {liveLetters.map((l) => {
          const isDragging = activeId === l.id;
          const x = isDragging ? dragPos.x - startPos.x : 0;
          const y = isDragging ? dragPos.y - startPos.y : 0;
          
          return (
            <div 
              key={l.id} 
              onPointerDown={(e) => onPointerDown(e, l)}
              onPointerMove={isDragging ? handlePointerMove : undefined}
              onPointerUp={isDragging ? handlePointerUp : undefined}
              className={`relative transition-opacity duration-300 ${l.used ? 'opacity-0 scale-0 pointer-events-none' : 'animate-monster-wobble'}`}
              style={{ 
                zIndex: isDragging ? 1000 : 10,
                transform: `translate3d(${x}px, ${y}px, 0) ${isDragging ? 'scale(1.4)' : 'scale(1)'}`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                touchAction: 'none', 
                position: 'relative',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
               <div 
                style={{ color: l.color }}
                className={`relative flex items-center justify-center font-black select-none
                  ${currentWord && currentWord.text.length > 7 ? 'text-5xl sm:text-7xl' : 'text-6xl sm:text-9xl'}
                `}
               >
                 {l.char}
                 <div className="absolute -top-4 right-0 w-full flex justify-end pr-3 pointer-events-none">
                     <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full border-2 border-black flex items-center justify-center overflow-hidden shadow-sm">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full translate-x-1"></div>
                     </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>

      {showSentence && (
        <div className="fixed inset-0 z-[200] bg-gradient-to-b from-[#FDFCF0] to-white animate-fade-in flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            <div className="absolute top-0 w-full h-24 bg-yellow-400/20 blur-3xl"></div>
            
            <div className="flex flex-col items-center gap-2 mb-4">
                <span className="text-3xl sm:text-4xl">{winContent.emoji}</span>
                <h3 className="text-5xl sm:text-7xl font-black text-yellow-500 drop-shadow-2xl animate-monster-hop uppercase tracking-tighter">
                    {winContent.text}
                </h3>
                <p className="text-2xl sm:text-4xl font-black text-slate-400 mt-2">{currentWord?.text}</p>
            </div>

            <div className="relative mb-6 group scale-90 sm:scale-100">
                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-[80px] opacity-50 animate-pulse"></div>
                <div className="text-[9rem] sm:text-[14rem] relative z-10 drop-shadow-2xl animate-float-slow">
                    {currentWord?.emoji}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-4 rounded-full shadow-2xl animate-bounce border-4 border-white">
                    <CheckCircle2 size={32} />
                </div>
            </div>

            <div className="bg-white border-4 sm:border-8 border-yellow-200 shadow-2xl rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 max-w-2xl w-full relative mx-2">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Biliyor muydun?</div>
                <p className="text-xl sm:text-3xl font-bold text-slate-800 leading-tight">
                    {exampleSentence}
                </p>
                <button 
                    onClick={() => SoundEffects.speak(exampleSentence, 0.9)}
                    className="mt-6 bg-yellow-50 text-yellow-700 px-5 py-2 rounded-2xl font-black flex items-center gap-2 mx-auto uppercase hover:bg-yellow-100 transition-colors border-b-4 border-yellow-200 text-sm"
                >
                    <Volume2 size={20} /> TEKRAR DİNLE
                </button>
            </div>

            <button 
              onClick={startNewRound} 
              className="mt-8 bg-green-500 text-white px-10 py-5 rounded-[2.5rem] font-black text-2xl shadow-xl shadow-green-200 hover:bg-green-600 flex items-center gap-4 transition-all hover:scale-110 active:scale-95 border-b-[8px] border-green-700 mb-6"
            >
              DEVAM ET <RefreshCw size={32}/>
            </button>
        </div>
      )}

      <style>{`
        @keyframes monster-wobble {
          0%, 100% { transform: rotate(-1deg) translateY(0); }
          50% { transform: rotate(1deg) translateY(-3px); }
        }
        .animate-monster-wobble {
          animation: monster-wobble 4s ease-in-out infinite;
        }
        @keyframes monster-hop {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
        }
        .animate-monster-hop {
          animation: monster-hop 0.6s ease-in-out infinite;
        }
        @keyframes particle-fade {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-particle-fade {
          animation: particle-fade 0.8s ease-out forwards;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LiteracyPhonicsMode;
