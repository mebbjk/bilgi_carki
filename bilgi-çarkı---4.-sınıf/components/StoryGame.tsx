
import React, { useState } from 'react';
import Wheel from './Wheel';
import StoryModal from './StoryModal';
import { generateStoryStarter } from '../services/geminiService';
import { STORY_CATEGORIES } from '../data/storyPool';
import { WheelSegment, StoryData, GradeLevel } from '../types';
import { Loader2, ArrowLeft, BookOpen } from 'lucide-react';

const GENRE_METADATA: Record<string, { color: string, icon: string }> = {
  'Macera': { color: '#ef4444', icon: '⛺' },
  'Bilim Kurgu': { color: '#3b82f6', icon: '🚀' },
  'Fantastik / Masal': { color: '#ec4899', icon: '🪄' },
  'Gizem / Dedektif': { color: '#8b5cf6', icon: '🔍' },
  'Komedi / Eğlence': { color: '#f59e0b', icon: '😂' },
  'Doğa / Hayvanlar': { color: '#10b981', icon: '🐾' }
};

const StoryGame: React.FC<{ gradeLevel: GradeLevel, onExit: () => void }> = ({ gradeLevel, onExit }) => {
  const [step, setStep] = useState<'genre' | 'sub' | 'story'>('genre');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setStep('sub');
  };

  const handleSpinEnd = async (subCategory: string) => {
    if (!selectedGenre) return;
    setLoading(true);
    try {
      // Artık bu fonksiyon önce havuzu kontrol ediyor
      const s = await generateStoryStarter(selectedGenre, subCategory, gradeLevel);
      if (s && s.starterText) {
          setStory(s);
          setStep('story');
      } else {
          alert("Hikaye bulunamadı, lütfen tekrar dene.");
      }
    } finally { setLoading(false); }
  };

  const subSegments: WheelSegment[] = selectedGenre ? (STORY_CATEGORIES as any)[selectedGenre].map((label: string) => ({
      label,
      color: GENRE_METADATA[selectedGenre].color,
      textColor: '#fff'
  })) : [];

  return (
    <div className="w-full flex flex-col items-center gap-6 py-4 animate-fade-in relative">
      <button onClick={onExit} className="absolute top-0 left-0 text-gray-400 font-bold flex items-center gap-1"><ArrowLeft size={20}/> Geri</button>
      
      {step === 'genre' && (
          <div className="w-full max-w-4xl mt-12">
              <div className="text-center mb-10">
                  <h2 className="text-4xl font-black text-gray-800 flex items-center gap-3 justify-center uppercase tracking-tighter"><BookOpen size={40} className="text-pink-500" /> HİKAYE MERKEZİ</h2>
                  <p className="text-gray-500 font-bold">Bir tür seç ve macerayı başlat!</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2">
                  {Object.keys(STORY_CATEGORIES).map(genre => (
                      <button 
                        key={genre}
                        onClick={() => handleGenreSelect(genre)}
                        className="bg-white p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-pink-200 hover:scale-105 transition-all text-center group"
                      >
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{GENRE_METADATA[genre].icon}</div>
                          <div className="font-black text-gray-700 text-lg">{genre}</div>
                      </button>
                  ))}
              </div>
          </div>
      )}

      {step === 'sub' && (
          <div className="flex flex-col items-center gap-6 mt-6">
              <div className="text-center">
                  <button onClick={() => setStep('genre')} className="text-pink-500 font-bold mb-2 flex items-center gap-1 mx-auto"><ArrowLeft size={16}/> Tür Değiştir</button>
                  <h2 className="text-2xl font-black text-gray-800 uppercase">{selectedGenre} DÜNYASI</h2>
                  <p className="text-gray-500">Konuyu belirlemek için çarkı çevir!</p>
              </div>
              <div className="relative">
                  <Wheel segments={subSegments} onSpinEnd={handleSpinEnd} />
                  {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-full z-50">
                          <Loader2 size={48} className="text-pink-600 animate-spin mb-2" />
                          <p className="font-black text-pink-900">Hikaye Getiriliyor...</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {step === 'story' && story && (
          <StoryModal data={story} onClose={() => { setStory(null); setStep('genre'); }} />
      )}
    </div>
  );
};

export default StoryGame;
