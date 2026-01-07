
import React, { useState } from 'react';
import { ArrowLeft, PenTool, Puzzle, Sparkles, BookOpen, Ghost } from 'lucide-react';
import LiteracyWordBuilder from './LiteracyWordBuilder';
import LiteracyWriting from './LiteracyWriting';
import LiteracyPhonicsMode from './LiteracyPhonicsMode';

export type LiteracyMode = 'menu' | 'builder' | 'writing_letter' | 'writing_word' | 'phonics_live';

interface LiteracyGameProps {
  history: string[];
  onRegisterHistory: (words: string[]) => void;
  onExit: () => void;
  onCorrect: (points: number, subject: string) => void;
}

const LiteracyGame: React.FC<LiteracyGameProps> = ({ history, onRegisterHistory, onExit, onCorrect }) => {
  const [subMode, setSubMode] = useState<LiteracyMode>('menu');

  if (subMode === 'builder') {
    return <LiteracyWordBuilder history={history} onRegisterHistory={onRegisterHistory} onExit={() => setSubMode('menu')} onCorrect={onCorrect} />;
  }

  if (subMode === 'writing_letter' || subMode === 'writing_word') {
    return <LiteracyWriting 
             mode={subMode === 'writing_letter' ? 'letter' : 'word'} 
             history={history}
             onRegisterHistory={onRegisterHistory}
             onExit={() => setSubMode('menu')} 
             onCorrect={onCorrect} 
           />;
  }

  if (subMode === 'phonics_live') {
    return <LiteracyPhonicsMode history={history} onRegisterHistory={onRegisterHistory} onExit={() => setSubMode('menu')} onCorrect={onCorrect} />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <button onClick={onExit} className="bg-white px-4 py-2 rounded-full shadow-sm text-gray-500 font-bold hover:text-rose-500 transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Ana Menü
        </button>
        <div className="bg-pink-100 text-pink-600 px-6 py-2 rounded-2xl font-black flex items-center gap-2 border-2 border-pink-200 shadow-sm text-xs sm:text-base">
          <Sparkles size={20} /> OKUMA YAZMA MACERASI
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 px-2">
        {/* Card: Phonics Live (YENİ - VİDEODAKİ MOD) */}
        <button 
          onClick={() => setSubMode('phonics_live')}
          className="group relative bg-gradient-to-b from-white to-yellow-50 border-4 border-yellow-200 rounded-[2.5rem] p-8 text-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden flex flex-col items-center gap-4"
        >
          <div className="bg-yellow-400 w-20 h-20 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
            <Ghost size={48} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 mb-1">Canlı Kelimeler</h2>
            <p className="text-gray-500 font-medium text-xs leading-snug">
              Harfler canlanıyor! Sürükle, birleştir ve izle.
            </p>
          </div>
          <div className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md group-hover:bg-yellow-600 transition-colors">
            Maceraya Başla
          </div>
        </button>

        {/* Card: Word Builder */}
        <button 
          onClick={() => setSubMode('builder')}
          className="group relative bg-white border-4 border-indigo-50 rounded-[2.5rem] p-8 text-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden flex flex-col items-center gap-4"
        >
          <div className="bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Puzzle size={48} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 mb-1">Kelime Bulmaca</h2>
            <p className="text-gray-500 font-medium text-xs leading-snug">
              Harfleri doğru yuvalara yerleştir!
            </p>
          </div>
          <div className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md group-hover:bg-indigo-700 transition-colors">
            Hemen Oyna
          </div>
        </button>

        {/* Card: Letter Writing */}
        <button 
          onClick={() => setSubMode('writing_letter')}
          className="group relative bg-white border-4 border-rose-50 rounded-[2.5rem] p-8 text-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden flex flex-col items-center gap-4"
        >
          <div className="bg-rose-100 w-20 h-20 rounded-3xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
            <PenTool size={48} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 mb-1">Harf Yazma</h2>
            <p className="text-gray-500 font-medium text-xs leading-snug">
              Seslerin üzerinden geçerek yazmayı öğren!
            </p>
          </div>
          <div className="bg-rose-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md group-hover:bg-rose-600 transition-colors">
            Yazmaya Başla
          </div>
        </button>

        {/* Card: Word Writing */}
        <button 
          onClick={() => setSubMode('writing_word')}
          className="group relative bg-white border-4 border-orange-50 rounded-[2.5rem] p-8 text-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden flex flex-col items-center gap-4"
        >
          <div className="bg-orange-100 w-20 h-20 rounded-3xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <PenTool size={48} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 mb-1">Kelime Yazma</h2>
            <p className="text-gray-500 font-medium text-xs leading-snug">
              Kelimeleri doğru formda yaz, puan topla!
            </p>
          </div>
          <div className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md group-hover:bg-orange-600 transition-colors">
            Kelimeleri Yaz
          </div>
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-white/60 backdrop-blur-sm border-2 border-white rounded-3xl p-6 mt-4 flex items-start gap-4 mx-2">
        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
          <BookOpen size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">Pedagojik Not</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Yeni eklenen <b>Canlı Kelimeler</b> modu, harflerin fonetik seslerini (uzatılarak) ve kelimenin cümle içindeki kullanımını görselleştirerek kalıcı öğrenmeyi destekler.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiteracyGame;
