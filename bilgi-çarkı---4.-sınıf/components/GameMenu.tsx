
import React from 'react';
import { 
  Grid3X3, BookOpen, Mic2, Calculator, History, Languages, 
  PenTool, Package, Flower2, Shuffle, Type, Users, Trophy, Smile, Play, MapPin, ArrowLeft
} from 'lucide-react';
import { SiteStats, AppMode } from '../types';

interface GameMenuProps {
  siteStats: SiteStats;
  onChangeMode: (mode: AppMode) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ siteStats, onChangeMode }) => {
  
  const renderGameCard = (
    mode: AppMode, 
    title: string, 
    desc: string, 
    icon: React.ReactNode, 
    colorClass: string, 
    points: string, 
    statKey: string
  ) => (
    <button 
      onClick={() => onChangeMode(mode)} 
      className={`relative p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all text-left group overflow-hidden flex flex-col justify-between min-h-[180px] border-2 border-white/50 ${colorClass}`}
    >
      {/* Background Icon Watermark */}
      <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12 scale-150">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 100 })}
      </div>

      {/* Top Section: Icon and Stats */}
      <div className="flex justify-between items-start w-full relative z-10">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-sm">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 32, className: "text-white" })}
        </div>
        <div className="flex flex-col items-end gap-1">
           <div className="bg-black/20 px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 backdrop-blur-md">
              <Users size={10} /> {(siteStats.gameCounts?.[statKey] || 0).toLocaleString()}
           </div>
           <div className="bg-white text-gray-800 px-2 py-0.5 rounded-md text-[10px] font-black shadow-sm">
              {points}
           </div>
        </div>
      </div>

      {/* Bottom Section: Title and Description */}
      <div className="mt-4 relative z-10">
        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1 drop-shadow-md">
          {title}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm font-medium leading-snug">
          {desc}
        </p>
      </div>
      
      {/* Play Button Overlay (Visible on Hover) */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
        <div className="bg-white text-gray-900 rounded-full p-3 shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
           <Play size={32} fill="currentColor" />
        </div>
      </div>
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in pb-10">
        
        {/* Üst Bar / Geri Dönüş */}
        <div className="flex items-center px-2">
            <button 
                onClick={() => onChangeMode('home')} 
                className="flex items-center gap-2 text-gray-500 font-bold hover:text-indigo-600 bg-white px-4 py-2 rounded-full shadow-sm transition-colors"
            >
                <ArrowLeft size={20} /> Ana Menü
            </button>
        </div>

        {/* SERBEST ETKİNLİKLER */}
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 border border-white shadow-xl">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                <Smile className="text-green-500 fill-green-100" size={28} /> 
                Serbest Etkinlikler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {renderGameCard(
                    'bingo', 
                    'Tombala', 
                    'Görsel hafıza ve kelime dağarcığını geliştirir.', 
                    <Grid3X3 />, 
                    'bg-gradient-to-br from-emerald-400 to-teal-600', 
                    'Eğlence', 
                    'Tombala'
                )}
                {renderGameCard(
                    'story', 
                    'Hikaye Çarkı', 
                    'Hayal gücünü ve hikaye kurma becerisini geliştirir.', 
                    <BookOpen />, 
                    'bg-gradient-to-br from-pink-400 to-rose-500', 
                    'Yaratıcılık', 
                    'Hikaye'
                )}
                {renderGameCard(
                    'taboo', 
                    'Yasak Kelime', 
                    'Sözcük dağarcığını ve hızlı düşünme yeteneğini artırır.', 
                    <Mic2 />, 
                    'bg-gradient-to-br from-violet-400 to-purple-600', 
                    'Eğlence', 
                    'Yasak Kelime'
                )}
            </div>
        </div>

        {/* PUANLI YARIŞMALAR */}
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 border border-white shadow-xl">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                <Trophy className="text-yellow-500 fill-yellow-100" size={28} /> 
                Puanlı Yarışmalar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {renderGameCard(
                    'multiplication', 
                    'Çarpım Tablosu', 
                    'Matematiksel işlem hızını ve hafızayı güçlendirir.', 
                    <Calculator />, 
                    'bg-gradient-to-br from-orange-400 to-red-500', 
                    '+2 Puan', 
                    'Çarpım Tablosu'
                )}
                {renderGameCard(
                    'turkey_map', 
                    'Şehir Bulmaca', 
                    'Türkiye haritası üzerinde şehirleri bulma ve tanıma oyunu.', 
                    <MapPin />, 
                    'bg-gradient-to-br from-blue-400 to-cyan-600', 
                    '+5 Puan', 
                    'Şehir Bulmaca'
                )}
                {renderGameCard(
                    'history', 
                    'Zaman Tüneli', 
                    'Tarihsel sıralama ve kronolojik düşünme becerisi kazandırır.', 
                    <History />, 
                    'bg-gradient-to-br from-blue-400 to-indigo-600', 
                    '+2 / +5 Puan', 
                    'Zaman Tüneli'
                )}
                {renderGameCard(
                    'match', 
                    'Kelime Avcısı', 
                    'İngilizce kelime eşleştirme ve yabancı dil hafızasını geliştirir.', 
                    <Languages />, 
                    'bg-gradient-to-br from-fuchsia-400 to-purple-600', 
                    '+2 Puan', 
                    'Kelime Avcısı'
                )}
                {renderGameCard(
                    'sentence', 
                    'Cümle Ustası', 
                    'Dil bilgisi kurallarını ve cümle kurma mantığını pekiştirir.', 
                    <PenTool />, 
                    'bg-gradient-to-br from-indigo-400 to-violet-600', 
                    '+2 Puan', 
                    'Cümle Ustası'
                )}
                {renderGameCard(
                    'sorting', 
                    'Bilgi Kutuları', 
                    'Kategorize etme ve analitik düşünme becerisini artırır.', 
                    <Package />, 
                    'bg-gradient-to-br from-amber-400 to-orange-500', 
                    '+2 Puan', 
                    'Bilgi Kutuları'
                )}
                {renderGameCard(
                    'hangman', 
                    'Kelime Tahmin', 
                    'Harf-kelime ilişkisini kurmayı ve tahminde bulunmayı öğretir.', 
                    <Flower2 />, 
                    'bg-gradient-to-br from-rose-400 to-pink-600', 
                    '+2 Puan', 
                    'Kelime Tahmin'
                )}
                {renderGameCard(
                    'word_pairs', 
                    'Anlam İlişkisi', 
                    'Eş ve zıt anlamlı kelimelerle kelime hazinesini zenginleştirir.', 
                    <Shuffle />, 
                    'bg-gradient-to-br from-cyan-400 to-blue-600', 
                    '+2 Puan', 
                    'Anlam İlişkisi'
                )}
                {renderGameCard(
                    'scrabble', 
                    'Kelime Türetmece', 
                    'Harflerden bütün oluşturma ve kombinasyon yeteneğini geliştirir.', 
                    <Type />, 
                    'bg-gradient-to-br from-yellow-400 to-amber-600', 
                    '+2 Puan', 
                    'Kelime Türetmece'
                )}
            </div>
        </div>
    </div>
  );
};

export default GameMenu;
