
import React from 'react';
import { Trophy, Play, BookOpen, Grid3X3, Star, Sparkles, PenTool } from 'lucide-react';
import { SiteStats, GradeLevel } from '../types';

interface HomeProps {
  userName: string;
  gradeLevel: GradeLevel;
  score: number;
  siteStats: SiteStats;
  totalGamesPlayed: number;
  onNavigate: (mode: 'lesson_selection' | 'games' | 'custom' | 'literacy' | 'lessons') => void;
}

const Home: React.FC<HomeProps> = ({ userName, gradeLevel, score, siteStats, totalGamesPlayed, onNavigate }) => {
  const isAdult = gradeLevel === 5;
  const isGrade1 = gradeLevel === 1;
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "Tünaydın";
    return "İyi Akşamlar";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2 flex items-center justify-center sm:justify-start gap-2"><Sparkles size={16} /> {getGreeting()}</div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-800 mb-2">{userName}</h1>
            <p className="text-gray-500 font-medium text-lg">
                {isAdult ? "Genel Kültür Çarkına Hazır Mısın?" : "Bugün ne öğrenmek istersin?"}
            </p>
          </div>
          <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg flex flex-col items-center min-w-[140px] transform hover:scale-105 transition-transform">
            <Trophy className="w-8 h-8 mb-2 text-yellow-300" />
            <span className="text-3xl font-black">{score}</span>
            <span className="text-xs opacity-80 uppercase font-bold">Toplam Puan</span>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isAdult ? 'md:grid-cols-2' : isGrade1 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
        {isAdult ? (
             <>
                <button onClick={() => onNavigate('lessons')} className="bg-gradient-to-br from-indigo-500 to-slate-800 text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"><BookOpen size={100} /></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><BookOpen size={32} /></div>
                        <h2 className="text-2xl font-black mb-2">Genel Kültür Çarkı</h2>
                        <p className="text-indigo-100 text-sm">Tarih, Coğrafya, Sanat ve dahası!</p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">Başla <Play size={16} fill="currentColor" /></div>
                    </div>
                </button>
                <button onClick={() => onNavigate('custom')} className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"><Star size={100} /></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><Star size={32} /></div>
                        <h2 className="text-2xl font-black mb-2">Özel Çark</h2>
                        <p className="text-purple-100 text-sm">Kendi maddelerini oluştur.</p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">Oluştur <Play size={16} fill="currentColor" /></div>
                    </div>
                </button>
             </>
        ) : (
            <>
                {isGrade1 && (
                    <button onClick={() => onNavigate('literacy')} className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"><PenTool size={100} /></div>
                        <div className="relative z-10">
                            <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><PenTool size={32} /></div>
                            <h2 className="text-2xl font-black mb-2">Okuma Yazma</h2>
                            <p className="text-pink-100 text-sm">Harfleri birleştir, kelime üret!</p>
                            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">Başla <Play size={16} fill="currentColor" /></div>
                        </div>
                    </button>
                )}
                <button onClick={() => onNavigate('lesson_selection')} className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"><BookOpen size={100} /></div>
                <div className="relative z-10">
                    <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><BookOpen size={32} /></div>
                    <h2 className="text-2xl font-black mb-2">Ders Çalış</h2>
                    <p className="text-blue-100 text-sm">Çarkı çevir veya sınava gir!</p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">Hemen Başla <Play size={16} fill="currentColor" /></div>
                </div>
                </button>
                <button onClick={() => onNavigate('games')} className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"><Grid3X3 size={100} /></div>
                <div className="relative z-10">
                    <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><Grid3X3 size={32} /></div>
                    <h2 className="text-2xl font-black mb-2">Oyun Oyna</h2>
                    <p className="text-green-100 text-sm">Zeka geliştiren oyunlar.</p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">Oyunlara Git <Play size={16} fill="currentColor" /></div>
                </div>
                </button>
                <button onClick={() => onNavigate('custom')} className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity"><Star size={100} /></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4"><Star size={32} /></div>
                        <h2 className="text-2xl font-black mb-2">Özel Çark</h2>
                        <p className="text-purple-100 text-sm">Kendi çarkını tasarla!</p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">Oluştur <Play size={16} fill="currentColor" /></div>
                    </div>
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default Home;
