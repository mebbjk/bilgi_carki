
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Eraser, Volume2, CheckCircle2, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { LITERACY_POOL } from '../data/literacyPool';
import { analyzeHandwriting } from '../services/geminiService';

const LETTERS = "ELAKİNOMUTÜYÖRIDSBZCÇGĞHPŞJV".split("");

interface LiteracyWritingProps {
    mode: 'letter' | 'word';
    history: string[];
    onRegisterHistory: (words: string[]) => void;
    onExit: () => void;
    onCorrect: (p: number, s: string) => void;
}

const LiteracyWriting: React.FC<LiteracyWritingProps> = ({ mode, history, onRegisterHistory, onExit, onCorrect }) => {
  const [target, setTarget] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  useEffect(() => { 
    startNewTask(); 
    window.addEventListener('resize', handleResize);
    return () => {
      SoundEffects.stopSpeechLoop();
      window.removeEventListener('resize', handleResize);
    }
  }, [mode]);

  const handleResize = () => {
    if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const canvas = canvasRef.current;
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
  };

  // Harf sayısına göre dinamik font boyutu hesaplama
  const getDynamicFontSize = (text: string, isGuide: boolean = false) => {
    const len = text.length;
    if (isGuide) {
      // Yazı alanındaki silik kılavuz metin boyutu
      if (len <= 1) return 'text-[12rem] sm:text-[18rem]';
      if (len <= 3) return 'text-[10rem] sm:text-[14rem]';
      if (len <= 5) return 'text-[8rem] sm:text-[12rem]';
      if (len <= 7) return 'text-[6rem] sm:text-[9rem]';
      return 'text-[4.5rem] sm:text-[7rem]';
    } else {
      // Yukarıdaki mavi kutudaki metin boyutu
      if (len <= 1) return 'text-6xl sm:text-8xl';
      if (len <= 3) return 'text-5xl sm:text-7xl';
      if (len <= 5) return 'text-4xl sm:text-6xl';
      if (len <= 7) return 'text-3xl sm:text-5xl';
      return 'text-2xl sm:text-4xl';
    }
  };

  // Harf sayısına göre harf aralığı (tracking) hesaplama
  const getTrackingClass = (text: string) => {
    const len = text.length;
    if (len <= 1) return 'tracking-[0.2em]';
    if (len <= 4) return 'tracking-[0.1em]';
    if (len <= 6) return 'tracking-normal';
    return 'tracking-tighter';
  };

  const startNewTask = async () => {
    setLoading(true);
    setIsComplete(false);
    setAiFeedback(null);
    clearCanvas();
    SoundEffects.stopSpeechLoop();
    
    let itemText = '';
    if (mode === 'letter') {
        itemText = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    } else {
        const available = LITERACY_POOL.filter(p => !(history || []).includes(p.text));
        itemText = (available.length > 0 
            ? available[Math.floor(Math.random() * available.length)].text 
            : LITERACY_POOL[Math.floor(Math.random() * LITERACY_POOL.length)].text).toUpperCase();
    }
    
    setTarget(itemText);
    setLoading(false);
    
    setTimeout(handleResize, 100);
    
    setTimeout(() => {
        if (mode === 'letter') {
            SoundEffects.speakLetterWithExample(itemText);
        } else {
            SoundEffects.speak(itemText, 0.8);
        }
    }, 600);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getCoordinates = (e: React.PointerEvent | PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    setIsDrawing(true);
    if (mode === 'letter') {
        SoundEffects.startSpeechLoop(target);
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        const coords = getCoordinates(e);
        ctx.beginPath(); 
        ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        const coords = getCoordinates(e);
        ctx.lineWidth = mode === 'letter' ? 24 : 16; 
        ctx.lineCap = 'round'; 
        ctx.lineJoin = 'round'; 
        ctx.strokeStyle = '#4f46e5';
        ctx.lineTo(coords.x, coords.y); 
        ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (mode === 'letter') {
        SoundEffects.stopSpeechLoop();
    }
  };

  const handleComplete = async () => {
    if (!canvasRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
        const canvas = canvasRef.current;
        const imageB64 = canvas.toDataURL('image/png').split(',')[1];
        const result = await analyzeHandwriting(imageB64, target);
        
        setAiFeedback(result.feedback);
        setIsComplete(true);
        
        if (mode === 'word') onRegisterHistory([target]);
        onCorrect(5, 'Türkçe');
        SoundEffects.playCorrect();
        
        if (result.feedback) {
            SoundEffects.speak(result.feedback, 1.1);
        }
    } catch (err) {
        console.error("Analysis error:", err);
        setAiFeedback("Harika bir çizim! Çok beğendim.");
        setIsComplete(true);
        SoundEffects.playCorrect();
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-4 sm:p-6 animate-fade-in flex flex-col items-center border-4 border-rose-100 relative touch-none h-[calc(100vh-100px)] min-h-[600px]">
      
      {isAnalyzing && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md rounded-[3rem] flex flex-col items-center justify-center text-center p-10">
              <div className="bg-rose-100 p-8 rounded-full shadow-2xl mb-4 border-4 border-white animate-bounce">
                  <Wand2 size={80} className="text-rose-600" />
              </div>
              <h2 className="text-3xl font-black text-rose-900 uppercase tracking-tighter">Harika Görünüyor!</h2>
              <p className="text-rose-700 font-bold mt-2">Öğretmenimiz puanını veriyor...</p>
          </div>
      )}

      <div className="w-full flex justify-between items-center mb-4 shrink-0">
        <button onClick={onExit} className="bg-slate-100 px-4 py-2 rounded-full text-slate-500 font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1">
          <ArrowLeft size={18}/> Kapat
        </button>
        <div className="flex gap-2">
            <button onClick={clearCanvas} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors shadow-sm" aria-label="Ekranı Temizle" title="Sil">
                <Eraser size={20} />
            </button>
            <button 
                onClick={() => {
                    if (mode === 'letter') SoundEffects.speakLetterWithExample(target);
                    else SoundEffects.speak(target, 0.7);
                }} 
                aria-label="Tekrar Dinle"
                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm" 
                title="Tekrar Dinle"
            >
                <Volume2 size={20} />
            </button>
        </div>
      </div>

      <div className="text-center mb-6 flex flex-col justify-center w-full px-4 shrink-0">
          <div className="bg-indigo-50/50 py-4 rounded-[2rem] border-2 border-indigo-100/50 shadow-inner overflow-hidden flex items-center justify-center">
              <h2 className={`font-black text-indigo-600 drop-shadow-sm break-all ${getDynamicFontSize(target)} ${getTrackingClass(target)}`}>
                  {target}
              </h2>
          </div>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-3 flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-yellow-400" />
              ŞİMDİ SENİN SIRAN! ÇİZGİLERİN ÜZERİNDEN GEÇ
          </p>
      </div>

      <div ref={containerRef} className="relative w-full flex-1 bg-slate-50 rounded-[2.5rem] border-4 border-slate-100 shadow-inner overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] text-indigo-900 pointer-events-none px-4 text-center">
              <span className={`font-black select-none w-full leading-none flex items-center justify-center ${getDynamicFontSize(target, true)} ${getTrackingClass(target)}`}>
                {target}
              </span>
          </div>
          <div className="absolute inset-0 flex flex-col justify-around py-8 opacity-10 pointer-events-none">
              <div className="w-full h-px bg-indigo-500"></div>
              <div className="w-full h-px bg-indigo-500"></div>
              <div className="w-full h-px bg-indigo-500"></div>
          </div>
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full cursor-crosshair z-10" 
            onPointerDown={startDrawing} 
            onPointerMove={draw} 
            onPointerUp={stopDrawing} 
            onPointerLeave={stopDrawing} 
          />
      </div>

      {aiFeedback && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl animate-slide-up shadow-sm flex items-start gap-4 w-full shrink-0">
              <div className="bg-yellow-400 p-2 rounded-xl text-white shrink-0 shadow-md"><Sparkles size={18}/></div>
              <p className="text-yellow-900 font-black italic leading-tight text-sm sm:text-base">{aiFeedback}</p>
          </div>
      )}

      <div className="w-full flex justify-center mt-6 shrink-0 pb-4">
          {isComplete ? (
              <button onClick={startNewTask} className="bg-green-500 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-xl shadow-green-200 hover:bg-green-600 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 border-b-8 border-green-700">
                  HARİKA! DEVAM ET <RefreshCw size={28}/>
              </button>
          ) : (
              <button 
                onClick={handleComplete} 
                disabled={isAnalyzing}
                className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border-b-8 border-indigo-900"
              >
                  BİTİRDİM! <CheckCircle2 size={28}/>
              </button>
          )}
      </div>
    </div>
  );
};

export default LiteracyWriting;
