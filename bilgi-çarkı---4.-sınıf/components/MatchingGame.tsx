
import React, { useState, useEffect } from 'react';
import { GradeLevel, Subject } from '../types';
import { RefreshCw, Trophy, Languages, CheckCircle2, XCircle, Loader2, Users } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { VOCAB_POOLS, VocabularyItem } from '../data/vocabPool';
import { generateMatchingPairs } from '../services/geminiService';
import { getGameStats } from '../src/firebase';

interface MatchingGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number, subject?: string) => void;
  onWrong: () => void;
  history: string[]; // List of termIds already matched
  onRegisterHistory: (ids: string[]) => void;
}

interface Card {
  uniqueId: string;
  termId: string;
  content: string; // The text to display (English Word) or the Emoji
  subContent?: string; // Turkish translation
  type: 'term' | 'match';
  isMatched: boolean;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong, history, onRegisterHistory }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wrongShakeIndex, setWrongShakeIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalPlays, setTotalPlays] = useState<number | null>(null);

  useEffect(() => {
    getGameStats('Kelime Avcısı').then(setTotalPlays);
    startNewGame();
  }, [gradeLevel]);

  const startNewGame = async () => {
    setLoading(true);
    setGameWon(false);
    setSelectedIndices([]);
    setIsLocked(false);
    
    // 1. Get Static Pool
    let pool = VOCAB_POOLS[gradeLevel];
    if (!pool || pool.length === 0) pool = VOCAB_POOLS[4];

    // 2. Filter out history
    let availableItems = pool.filter(item => !history.includes(item.id));
    
    let selectedItems: VocabularyItem[] = [];

    // 3. Logic: If pool has enough items, use them. If not, generate via AI.
    if (availableItems.length >= 6) {
        selectedItems = availableItems.sort(() => Math.random() - 0.5).slice(0, 6);
    } else {
        // Pool exhausted! Call AI to generate new matching pairs
        try {
            const aiItems = await generateMatchingPairs(gradeLevel, 6);
            if (aiItems.length > 0) {
                // Assign temporary unique IDs for this session so we don't clash
                selectedItems = aiItems.map((item, idx) => ({
                    ...item,
                    id: `ai-${Date.now()}-${idx}`
                }));
            } else {
                // Fallback if AI fails: reuse pool
                selectedItems = pool.sort(() => Math.random() - 0.5).slice(0, 6);
            }
        } catch (e) {
            selectedItems = pool.sort(() => Math.random() - 0.5).slice(0, 6);
        }
    }

    // 4. Construct Deck
    const deck: Card[] = [];
    selectedItems.forEach(item => {
      // Card 1: The English Term (Now includes translation as subContent for reveal)
      deck.push({ 
        uniqueId: `${item.id}-term`, 
        termId: item.id, 
        content: item.term,
        subContent: item.translation, // Add translation here to show after match
        type: 'term',
        isMatched: false
      });

      // Card 2: The Match (Emoji + Turkish)
      deck.push({ 
        uniqueId: `${item.id}-match`, 
        termId: item.id, 
        content: item.emoji,
        subContent: item.translation,
        type: 'match',
        isMatched: false
      });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setLoading(false);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isMatched || selectedIndices.includes(index)) return;

    const newSelection = [...selectedIndices, index];
    setSelectedIndices(newSelection);

    if (newSelection.length === 2) {
      setIsLocked(true);
      checkForMatch(newSelection[0], newSelection[1]);
    }
  };

  const checkForMatch = (idx1: number, idx2: number) => {
    const card1 = cards[idx1];
    const card2 = cards[idx2];

    if (card1.termId === card2.termId) {
      // MATCH!
      SoundEffects.playCorrect();
      // FIX: Pass Subject.ENGLISH so it updates the English stats
      onCorrect(2, Subject.ENGLISH);
      
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isMatched = true;
        newCards[idx2].isMatched = true;
        setCards(newCards);
        setSelectedIndices([]);
        setIsLocked(false);

        if (newCards.every(c => c.isMatched)) {
           setGameWon(true);
           const matchedIds = Array.from(new Set(newCards.map(c => c.termId)));
           onRegisterHistory(matchedIds);
        }
      }, 400);
    } else {
      // WRONG!
      SoundEffects.playWrong();
      onWrong();
      setWrongShakeIndex(idx2);

      setTimeout(() => {
        setSelectedIndices([]);
        setIsLocked(false);
        setWrongShakeIndex(null);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6 animate-fade-in flex flex-col items-center min-h-[600px]">
      
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-gray-400 font-bold text-sm hover:text-gray-600">Geri</button>
        <div className="bg-purple-100 px-4 py-1.5 rounded-full text-purple-700 font-bold flex items-center gap-2">
           <Languages size={18} />
           <span>Kelime Avcısı ({gradeLevel}. Sınıf)</span>
        </div>
        <button onClick={startNewGame} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200" title="Yeniden Başlat">
            <RefreshCw size={16}/>
        </button>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm sm:text-base font-medium">
            İngilizce kelimeyi anlamıyla (emoji) eşleştir!
        </p>
        {totalPlays !== null && (
            <p className="text-xs font-bold text-gray-400 mt-1 flex items-center justify-center gap-1">
                <Users size={12}/> {totalPlays.toLocaleString()} kez oynandı
            </p>
        )}
      </div>

      {loading ? (
          <div className="flex flex-col items-center justify-center flex-1">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4"/>
              <p className="text-purple-600 font-bold">Yeni kelimeler hazırlanıyor...</p>
          </div>
      ) : gameWon ? (
         <div className="flex flex-col items-center justify-center flex-1 animate-scale-up text-center p-8">
            <Trophy className="w-24 h-24 text-yellow-500 mb-6" />
            <h2 className="text-3xl font-black text-gray-800 mb-2">Harikasın!</h2>
            <p className="text-gray-500 mb-8">Tüm kelimeleri doğru eşleştirdin.</p>
            <button 
                onClick={startNewGame}
                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg"
            >
                Sonraki Seviye
            </button>
         </div>
      ) : (
         <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full flex-1 content-start">
            {cards.map((card, index) => {
                const isSelected = selectedIndices.includes(index);
                const isWrong = selectedIndices.length === 2 && isSelected && cards[selectedIndices[0]].termId !== cards[selectedIndices[1]].termId;
                
                // Base Style
                let containerClass = "aspect-[4/3] sm:aspect-square relative cursor-pointer rounded-2xl overflow-hidden shadow-md transition-all duration-300 transform border-4 ";
                
                if (card.isMatched) {
                    containerClass += "border-green-200 bg-green-50 opacity-70 scale-95 pointer-events-none"; // Increased opacity to read text
                } else if (isWrong) {
                    containerClass += "border-red-400 bg-red-50 animate-shake z-20";
                } else if (isSelected) {
                    containerClass += "border-purple-500 bg-white shadow-2xl scale-105 z-20 ring-4 ring-purple-200";
                } else {
                    containerClass += "border-gray-100 bg-white hover:border-purple-300 hover:shadow-lg hover:-translate-y-1";
                }

                if (!isSelected && !card.isMatched && !isWrong) {
                    containerClass += " bg-gradient-to-br from-white to-gray-50";
                }

                return (
                    <div 
                        key={card.uniqueId}
                        onClick={() => handleCardClick(index)}
                        className={containerClass}
                    >
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none">
                            
                            {card.type === 'term' ? (
                                // English Word Card
                                <>
                                    <span className="font-black text-gray-800 text-base sm:text-2xl break-words leading-tight">
                                        {card.content}
                                    </span>
                                    {/* SHOW TRANSLATION WHEN MATCHED */}
                                    {card.isMatched ? (
                                        <span className="text-xs sm:text-sm text-green-600 font-bold mt-1 animate-fade-in bg-white/50 px-2 rounded-full">
                                            {card.subContent}
                                        </span>
                                    ) : (
                                        <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">ENG</span>
                                    )}
                                </>
                            ) : (
                                // Emoji + Translation Card
                                <>
                                    <span className="text-4xl sm:text-6xl mb-1 filter drop-shadow-sm">
                                        {card.content}
                                    </span>
                                    <span className="font-bold text-gray-600 text-xs sm:text-sm">
                                        {card.subContent}
                                    </span>
                                </>
                            )}

                            {card.isMatched && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className="text-green-500 w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
                                </div>
                            )}
                            {isSelected && !isWrong && !card.isMatched && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full animate-pulse"></div>
                                </div>
                            )}
                             {isWrong && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-100/20">
                                    <XCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 drop-shadow-md" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
         </div>
      )}
    </div>
  );
};

export default MatchingGame;
