
import React, { useState, useRef } from 'react';
import { WheelSegment } from '../types';
import { SoundEffects } from '../utils/sound';

interface WheelProps {
  segments: WheelSegment[];
  onSpinEnd: (segmentLabel: string) => void;
  onSpinStart?: () => void;
}

const Wheel: React.FC<WheelProps> = ({ segments, onSpinEnd, onSpinStart }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const spinWheel = () => {
    if (isSpinning || segments.length === 0) return;

    if (onSpinStart) onSpinStart();
    setIsSpinning(true);
    
    // En az 5 tam tur (1800 derece) + rastgele bir açı
    const extraRotation = 1800 + Math.floor(Math.random() * 360);
    const newRotation = rotation + extraRotation;
    setRotation(newRotation);

    const totalDuration = 4000;
    const startTime = Date.now();
    
    // Tıkırtı sesi efekti
    const playTickLoop = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= totalDuration) return;

        SoundEffects.playSpinTick();
        
        // Dönüş yavaşladıkça tıkırtı aralığı artar
        const progress = elapsed / totalDuration;
        const nextDelay = 80 + (Math.pow(progress, 2) * 600); 
        
        timerRef.current = window.setTimeout(playTickLoop, nextDelay);
    };

    playTickLoop();

    setTimeout(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsSpinning(false);
      
      const normalizedRotation = newRotation % 360;
      const segmentAngle = 360 / segments.length;
      
      // Pointer 12 yönünde (270 derece SVG koordinatlarında).
      let winningAngle = (270 - normalizedRotation) % 360;
      if (winningAngle < 0) winningAngle += 360;
      
      const winningIndex = Math.floor(winningAngle / segmentAngle);
      const safeIndex = Math.min(segments.length - 1, Math.max(0, winningIndex));
      
      onSpinEnd(segments[safeIndex].label);
    }, totalDuration);
  };

  const createSectorPath = (index: number, total: number) => {
    const startAngle = (index * 360) / total;
    const endAngle = ((index + 1) * 360) / total;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 50 * Math.cos(startRad);
    const y1 = 50 + 50 * Math.sin(startRad);
    const x2 = 50 + 50 * Math.cos(endRad);
    const y2 = 50 + 50 * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  const getFontSize = (label: string) => {
      const len = label.length;
      const count = segments.length;
      let size = 4.5; 
      if (count > 8) size = 3.5;
      if (len > 8) size = size * 0.9;
      if (len > 12) size = size * 0.8;
      return Math.max(2.0, size);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 wheel-container">
        <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] pointer-events-none z-0"></div>
        
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg filter">
          <svg width="40" height="50" viewBox="0 0 40 50">
            <path d="M20 50 L0 0 L40 0 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
            <circle cx="20" cy="5" r="3" fill="#FFF" />
          </svg>
        </div>
        
        <div
          className="w-full h-full transition-transform duration-[4000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full rounded-full overflow-visible">
            {segments.map((seg, i) => {
                 const angle = 360 / segments.length;
                 const midAngle = (i * angle) + (angle / 2);
                 
                 return (
                  <g key={i}>
                    <path d={createSectorPath(i, segments.length)} fill={seg.color} stroke="#fff" strokeWidth="0.8" />
                    <g transform={`rotate(${midAngle}, 50, 50)`}>
                       {/* 
                         Yazı Ayarları Düzeltildi:
                         x=95: Dış çembere çok yakın (başlangıç noktası).
                         textAnchor="start": Yazı 95'ten başlayıp sağa doğru gider (ancak döndürüldüğü için merkeze doğru akar).
                         rotate(180, 95, 50): Yazıyı kendi olduğu yerde 180 derece çevirir, böylece dıştan içe okunur.
                       */}
                       <text 
                         x="95" 
                         y="50" 
                         fill={seg.textColor} 
                         fontSize={getFontSize(seg.label)} 
                         fontWeight="700" 
                         fontFamily="'Quicksand', sans-serif"
                         textAnchor="start" 
                         dominantBaseline="middle"
                         transform="rotate(180, 95, 50)" 
                         style={{ pointerEvents: 'none', stroke: "rgba(0,0,0,0.1)", strokeWidth: "0.2px" }}
                       >
                           {seg.label}
                       </text>
                    </g>
                  </g>
                );
            })}
            <circle cx="50" cy="50" r="14" fill="#FFF" stroke="#E2E8F0" strokeWidth="3" />
            <circle cx="50" cy="50" r="9" fill="#4F46E5" className="animate-pulse" />
            <path d="M46 50 L49 53 L54 47" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      <button
        onClick={spinWheel}
        disabled={isSpinning || segments.length === 0}
        className={`mt-10 px-12 py-5 rounded-[2rem] text-2xl font-black text-white shadow-xl transition-all transform active:scale-95 border-b-8 ${
          isSpinning 
          ? 'bg-slate-400 border-slate-500 cursor-not-allowed border-b-0 translate-y-2' 
          : 'bg-indigo-600 border-indigo-800 hover:bg-indigo-500 hover:border-indigo-700 hover:-translate-y-1'
        }`}
      >
        {isSpinning ? 'DÖNÜYOR...' : 'ÇEVİR VE BAŞLA!'}
      </button>
    </div>
  );
};

export default Wheel;
