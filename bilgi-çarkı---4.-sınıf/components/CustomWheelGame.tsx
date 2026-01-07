
import React, { useState, useEffect } from 'react';
import Wheel from './Wheel';
import { WheelSegment } from '../types';
import { ArrowLeft, Plus, Trash2, Star, Sparkles, RotateCcw } from 'lucide-react';
// Fix: Import SoundEffects to handle audio feedback after spin
import { SoundEffects } from '../utils/sound';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
const DEFAULT_ITEMS = ["Kitap Oku 📖", "Oyun Oyna 🎮", "Meyve Ye 🍎", "Film İzle 🎬", "Resim Yap 🎨", "Spor Yap ⚽"];

const CustomWheelGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bilgicarki_custom_items');
    if (saved) {
        setItems(JSON.parse(saved));
    } else {
        setItems(DEFAULT_ITEMS);
    }
  }, []);

  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [...items, newItem.trim()];
    setItems(updated);
    setNewItem('');
    localStorage.setItem('bilgicarki_custom_items', JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('bilgicarki_custom_items', JSON.stringify(updated));
  };

  const resetToDefaults = () => {
    setItems(DEFAULT_ITEMS);
    localStorage.setItem('bilgicarki_custom_items', JSON.stringify(DEFAULT_ITEMS));
  };

  const segments: WheelSegment[] = items.map((label, i) => ({
    label,
    color: COLORS[i % COLORS.length],
    textColor: '#fff'
  }));

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-10 p-4 animate-fade-in">
      <div className="w-full md:w-1/3 bg-white rounded-[2.5rem] shadow-xl p-8 border-4 border-indigo-50">
        <button onClick={onExit} className="text-gray-400 font-bold flex items-center gap-1 mb-6 hover:text-indigo-600"><ArrowLeft size={18}/> Ana Menü</button>
        <h2 className="text-2xl font-black text-gray-800 mb-2 flex items-center gap-2"><Star className="text-yellow-500" fill="currentColor"/> ÖZEL ÇARK</h2>
        <p className="text-gray-500 text-sm mb-6 font-medium">Kendi aktivitelerini ekle!</p>
        
        <div className="flex gap-2 mb-4">
          <input 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Yeni madde..."
            className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 font-bold focus:outline-none focus:border-indigo-500"
          />
          <button onClick={addItem} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 shadow-md"><Plus /></button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mb-6">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-indigo-50/50 px-4 py-2 rounded-xl group">
                    <span className="font-bold text-indigo-900 truncate">{item}</span>
                    <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                </div>
            ))}
        </div>
        
        <button onClick={resetToDefaults} className="w-full py-2 text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center justify-center gap-1 border-t pt-4">
            <RotateCcw size={12} /> Örnek Maddeleri Geri Getir
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
          {winner && (
              <div className="absolute top-0 z-30 bg-yellow-400 text-yellow-900 px-8 py-3 rounded-2xl font-black text-2xl shadow-xl animate-bounce border-4 border-white flex items-center gap-2">
                  <Sparkles /> {winner}
              </div>
          )}
          <Wheel segments={segments} onSpinEnd={(l) => { setWinner(l); SoundEffects.playCorrect(); }} onSpinStart={() => setWinner(null)} />
      </div>
    </div>
  );
};

export default CustomWheelGame;
