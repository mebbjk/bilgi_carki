
import React from 'react';
import { StoryData } from '../types';
import { BookOpen, Sparkles, X, Lightbulb } from 'lucide-react';

interface StoryModalProps {
  data: StoryData;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fff9e6] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-8 border-[#8B4513] relative">
        {/* Binder Rings Effect */}
        <div className="absolute top-0 left-8 h-full w-0.5 bg-black/10 z-0"></div>
        <div className="absolute top-10 -left-2 w-6 h-6 rounded-full bg-gray-300 shadow-inner z-10"></div>
        <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-gray-300 shadow-inner z-10"></div>
        <div className="absolute bottom-10 -left-2 w-6 h-6 rounded-full bg-gray-300 shadow-inner z-10"></div>

        {/* Header */}
        <div className="bg-[#8B4513] p-4 text-white flex justify-between items-center z-10 relative shadow-md">
          <div className="flex items-center gap-3">
             <BookOpen className="w-6 h-6 text-yellow-300" />
             <div>
                <span className="text-yellow-200 text-xs uppercase font-bold tracking-widest block">Hikaye Başlangıcı</span>
                <h2 className="text-xl font-bold font-story">{data.genre || 'Harika Bir Hikaye'}</h2>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 overflow-y-auto z-10 relative flex flex-col items-center text-center">
           
           <div className="mb-8">
             <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
             <h3 className="text-2xl font-bold text-[#8B4513] font-story mb-2">Bir varmış, bir yokmuş...</h3>
           </div>

           {/* Story Starter */}
           <div className="w-full bg-white p-8 rounded-xl shadow-sm border border-[#e6dcc5] italic text-xl text-gray-800 leading-loose font-story relative mb-8 whitespace-pre-line text-left">
              <span className="absolute -top-4 -left-2 text-6xl text-[#8B4513] opacity-20 font-serif">"</span>
              {data.starterText}
              <span className="absolute -bottom-8 -right-2 text-6xl text-[#8B4513] opacity-20 font-serif">"</span>
           </div>

           <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 max-w-lg w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="w-6 h-6 text-orange-500" />
                <h4 className="text-orange-800 font-bold text-lg">Sıra Senin Hayal Gücünde!</h4>
              </div>
              <p className="text-orange-700/80 leading-relaxed text-sm">
                Şimdi gözlerini kapat ve hikayenin devamını zihninde canlandır. Kahramanımız ne yapacak? Olaylar nasıl çözülecek? Hikayeyi ailene anlatmayı unutma!
              </p>
           </div>
           
           <div className="mt-8">
                <button
                    onClick={onClose}
                    className="bg-[#8B4513] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-[#6d360f] transition-all transform hover:scale-105 active:scale-95"
                >
                    Tamam, Hayal Ettim!
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
