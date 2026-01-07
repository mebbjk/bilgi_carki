
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, MapPin, Users, RefreshCw, Home, Target } from 'lucide-react';
import { TURKEY_MAP_DATA, CityMapData } from '../data/turkeyMapData';
import { SoundEffects } from '../utils/sound';
import { getGameStats, updateGlobalStats } from '../src/firebase';

interface TurkeyMapGameProps {
  onExit: () => void;
  onCorrect: (points: number, subject: string) => void;
  onWrong: (subject: string) => void;
}

type GameMode = 'find' | 'name';

// Türkiye haritası için genişletilmiş ve ortalanmış viewBox
const INITIAL_VIEWBOX = { x: -100, y: -50, w: 1700, h: 850 };

const TurkeyMapGame: React.FC<TurkeyMapGameProps> = ({ onExit, onCorrect, onWrong }) => {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentCity, setCurrentCity] = useState<CityMapData | null>(null);
  const [options, setOptions] = useState<CityMapData[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [clickedCityId, setClickedCityId] = useState<string | null>(null);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);
  const [knownCities, setKnownCities] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // --- HARİTA HAREKET STATE'LERİ ---
  const [viewBox, setViewBox] = useState(INITIAL_VIEWBOX);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragMoved = useRef(false);

  // Harita verisini filtrele
  const validCities = React.useMemo(() => TURKEY_MAP_DATA.filter(c => c.d && c.d.length > 5), []);

  useEffect(() => {
    getGameStats('Şehir Bulmaca').then(setTotalPlays);
  }, []);

  useEffect(() => {
      if (!feedback || !mode) return;

      const timer = setTimeout(() => {
          if (feedback === 'correct') {
              if (knownCities.length >= validCities.length) {
                  setIsGameOver(true);
                  SoundEffects.playCorrect();
              } else {
                  generateRound();
              }
          } else {
              generateRound();
          }
      }, feedback === 'correct' ? 1500 : 2000);

      return () => clearTimeout(timer);
  }, [feedback, knownCities, validCities, mode]);

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setScore(0);
    setStreak(0);
    setKnownCities([]);
    setIsGameOver(false);
    setViewBox(INITIAL_VIEWBOX);
    updateGlobalStats('game', 'Şehir Bulmaca');
    generateRound(selectedMode, []); 
  };

  const generateRound = (overrideMode?: GameMode, forceKnownCities?: string[]) => {
    const currentMode = overrideMode || mode;
    if (!currentMode) return;

    setFeedback(null);
    setClickedCityId(null);
    
    const currentKnownList = forceKnownCities !== undefined ? forceKnownCities : knownCities;
    const availableCities = validCities.filter(c => !currentKnownList.includes(c.id));
    
    if (availableCities.length === 0) {
        setIsGameOver(true);
        return;
    }

    const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    setCurrentCity(randomCity);

    if (currentMode === 'name') {
      const distractors = new Set<CityMapData>();
      while (distractors.size < 3) {
        const d = TURKEY_MAP_DATA[Math.floor(Math.random() * TURKEY_MAP_DATA.length)];
        if (d.id !== randomCity.id && d.title) {
          distractors.add(d);
        }
      }
      const allOptions = [...Array.from(distractors), randomCity].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
  };

  // --- HARİTA SÜRÜKLEME MANTIĞI ---
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragMoved.current = false;
    setDragStart({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragMoved.current = true;
    }

    const { width, height } = svgRef.current.getBoundingClientRect();
    const scaleX = viewBox.w / width;
    const scaleY = viewBox.h / height;

    setViewBox(prev => ({
        ...prev,
        x: prev.x - dx * scaleX,
        y: prev.y - dy * scaleY
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  // --- OYUN MANTIĞI ---
  const handleMapClick = (cityId: string) => {
    if (dragMoved.current) return;
    if (mode !== 'find' || feedback !== null || !currentCity) return;

    setClickedCityId(cityId);

    if (cityId === currentCity.id) {
      handleSuccess(cityId);
    } else {
      handleFailure();
    }
  };

  const handleOptionClick = (cityId: string) => {
    if (mode !== 'name' || feedback !== null || !currentCity) return;

    if (cityId === currentCity.id) {
      handleSuccess(cityId);
    } else {
      handleFailure();
    }
  };

  const handleSuccess = (cityId: string) => {
    setFeedback('correct');
    SoundEffects.playCorrect();
    const points = 5 + streak;
    setScore(s => s + points);
    setStreak(s => s + 1);
    
    setKnownCities(prev => [...prev, cityId]);
    onCorrect(points, 'Coğrafya');
    
    const city = TURKEY_MAP_DATA.find(c => c.id === cityId);
    if(city) SoundEffects.speak(`Doğru! Burası ${city.title}`);
  };

  const handleFailure = () => {
    setFeedback('wrong');
    SoundEffects.playWrong();
    setStreak(0);
    onWrong('Coğrafya');
  };

  if (isGameOver) {
      return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-scale-up flex flex-col gap-6 min-h-[500px] justify-center items-center border-4 border-indigo-50">
            <div className="bg-yellow-100 p-6 rounded-full shadow-inner ring-4 ring-yellow-50 mb-4 animate-bounce">
                <Trophy size={80} className="text-yellow-600" />
            </div>
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Tebrikler!</h2>
            <p className="text-gray-500 font-medium text-xl">
                Haritadaki tüm şehirleri başarıyla tamamladın.
            </p>
            <div className="text-5xl font-black text-indigo-600 my-4">
                {score} Puan
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                <button 
                    onClick={() => startGame(mode!)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <RefreshCw size={24} /> Tekrar Oyna
                </button>
                <button 
                    onClick={onExit}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <ArrowLeft size={24} /> Geri
                </button>
            </div>
        </div>
      );
  }

  if (!mode) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-8 min-h-[500px] justify-center items-center border-4 border-indigo-50">
        <div className="flex flex-col items-center gap-2">
            <div className="bg-red-100 p-6 rounded-full shadow-inner ring-4 ring-red-50 mb-4 animate-bounce">
                <MapPin size={64} className="text-red-600" />
            </div>
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Türkiye Haritası</h2>
            <p className="text-gray-500 font-medium max-w-md text-lg">
                Şehirleri haritada bul veya isimlerini tahmin et!
            </p>
            {totalPlays !== null && (
                <div className="text-xs font-bold text-gray-400 flex items-center gap-1 mt-2 bg-gray-50 px-3 py-1 rounded-full">
                    <Users size={12}/> {totalPlays.toLocaleString()} kez oynandı
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
          <button 
            onClick={() => startGame('find')}
            className="flex flex-col items-center p-8 rounded-[2rem] border-4 border-indigo-100 bg-gradient-to-b from-white to-indigo-50 hover:border-indigo-500 hover:shadow-2xl hover:-translate-y-1 transition-all group"
          >
            <div className="bg-white p-4 rounded-2xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                <Target size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Şehri Bul</h3>
            <p className="text-gray-500 text-sm font-bold">Haritada göster!</p>
          </button>

          <button 
            onClick={() => startGame('name')}
            className="flex flex-col items-center p-8 rounded-[2rem] border-4 border-emerald-100 bg-gradient-to-b from-white to-emerald-50 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all group"
          >
            <div className="bg-white p-4 rounded-2xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                <MapPin size={40} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">İsmi Bil</h3>
            <p className="text-gray-500 text-sm font-bold">Kırmızı şehri tanı!</p>
          </button>
        </div>

        <button onClick={onExit} className="text-gray-400 font-bold hover:text-gray-600 flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20}/> Geri
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-80px)] min-h-[600px] border border-gray-200">
      
      {/* Üst Bar */}
      <div className="bg-white p-4 flex justify-between items-center shadow-sm z-20 shrink-0">
        <button onClick={() => setMode(null)} className="text-gray-500 font-bold hover:text-indigo-600 flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl transition-colors">
            <ArrowLeft size={20}/> Menü
        </button>
        
        {mode === 'find' && (
            <div className="bg-indigo-50 border-2 border-indigo-100 px-8 py-2 rounded-2xl text-center shadow-sm animate-scale-up">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">BULMAN GEREKEN ŞEHİR</span>
                <span className="text-2xl sm:text-4xl font-black text-indigo-900 tracking-tight">{currentCity?.title}</span>
            </div>
        )}

        <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg font-bold text-sm hidden sm:block border border-orange-100">
                x{streak} Seri
            </div>
            <div className="bg-yellow-50 text-yellow-700 px-5 py-2 rounded-xl font-black text-xl flex items-center gap-2 border border-yellow-200 shadow-sm">
                <Trophy size={20} className="text-yellow-500" /> {score}
            </div>
        </div>
      </div>

      {/* HARİTA ALANI */}
      <div className="relative w-full flex-1 bg-[#81D4FA] overflow-hidden group">
          <svg 
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} 
            className={`w-full h-full select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <filter id="shadow">
                <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.2" />
            </filter>

            <g filter="url(#shadow)">
            {TURKEY_MAP_DATA.map((city) => {
                const isCorrect = currentCity?.id === city.id && feedback === 'correct';
                const isWrong = clickedCityId === city.id && feedback === 'wrong';
                const isTarget = currentCity?.id === city.id;
                const isKnown = knownCities.includes(city.id);
                
                // Sadece yolu olanları çiz
                if (!city.d) return null;

                let fill = "#FCF3CF"; 
                let stroke = "#5F6A6A"; 
                let strokeWidth = "0.5";
                
                if (mode === 'name') {
                    if (isTarget && feedback === 'correct') { fill = "#2ECC71"; strokeWidth="2"; }
                    else if (isTarget && feedback === 'wrong') { fill = "#3498DB"; strokeWidth="2"; }
                    else if (isTarget) { fill = "#E74C3C"; strokeWidth="3"; } 
                } 
                else if (mode === 'find') {
                    if (isCorrect) { fill = "#2ECC71"; strokeWidth="2"; } 
                    else if (isWrong) { fill = "#E74C3C"; strokeWidth="2"; } 
                    else if (feedback === 'wrong' && isTarget) { fill = "#3498DB"; strokeWidth="2"; } 
                }

                if (isKnown && !isTarget) fill = "#ABEBC6"; 

                return (
                    <g key={city.id} className="transition-all duration-300">
                        <path
                            id={city.id}
                            d={city.d}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                            onClick={() => handleMapClick(city.id)}
                        >
                            {/* KOPYA OLMAMASI İÇİN TITLE KALDIRILDI */}
                        </path>
                    </g>
                );
            })}
            </g>
          </svg>
      </div>

      {/* Alt Seçenekler */}
      {mode === 'name' && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 shrink-0">
              <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {options.map((opt) => {
                      let btnClass = "py-4 rounded-xl font-bold text-lg shadow-sm border-b-4 transition-all active:scale-95 ";
                      
                      if (feedback === 'correct' && opt.id === currentCity?.id) {
                          btnClass += "bg-green-500 text-white border-green-700";
                      } else if (feedback === 'wrong' && opt.id === currentCity?.id) {
                           btnClass += "bg-green-500 text-white border-green-700 opacity-50"; 
                      } else if (feedback === 'wrong' && opt.id !== currentCity?.id) {
                           btnClass += "bg-red-500 text-white border-red-700"; 
                      } else {
                           btnClass += "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200";
                      }

                      return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt.id)}
                            disabled={feedback !== null}
                            className={btnClass}
                          >
                              {opt.title}
                          </button>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
};

export default TurkeyMapGame;
