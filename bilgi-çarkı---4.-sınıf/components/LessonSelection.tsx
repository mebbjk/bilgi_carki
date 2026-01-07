
import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { GradeLevel } from '../types';

interface LessonSelectionProps {
  onSelect: (mode: 'lessons' | 'test') => void;
  onExit: () => void;
  gradeLevel: GradeLevel;
}

const LessonSelection: React.FC<LessonSelectionProps> = ({ onSelect, onExit, gradeLevel }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in mt-10">
      <button onClick={onExit} className="text-gray-400 font-bold mb-8 flex items-center gap-2 hover:text-indigo-600">
        <ArrowLeft size={20} /> Geri Dön
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Ders Çalışma Merkezi</h2>
        <p className="text-gray-500 font-medium">Hangi yöntemle çalışmak istersin?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => onSelect('lessons')}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-blue-50 hover:border-blue-200 hover:scale-[1.02] transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen size={120} /></div>
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <Sparkles size={32} />
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-3">BİLGİ ÇARKI</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Ders kategorilerini çark ile belirle, rastgele soruları bilerek puanları topla!
          </p>
          <div className="flex items-center gap-2 text-blue-600 font-black">
            BAŞLA <Play size={16} fill="currentColor" />
          </div>
        </button>

        <button 
          onClick={() => onSelect('test')}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-purple-50 hover:border-purple-200 hover:scale-[1.02] transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle2 size={120} /></div>
          <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-3">SINAV MODU</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Kendi sınavını oluştur! Soru sayısını ve süreyi belirle, karneni hazırla.
          </p>
          <div className="flex items-center gap-2 text-purple-600 font-black">
            SINAVA GİR <Play size={16} fill="currentColor" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default LessonSelection;
