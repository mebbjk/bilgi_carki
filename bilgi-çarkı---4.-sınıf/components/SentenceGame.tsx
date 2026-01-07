
import React, { useState, useEffect } from 'react';
import { GradeLevel, Subject } from '../types';
import { SENTENCE_POOLS } from '../data/sentencePool';
import { RefreshCw, CheckCircle2, XCircle, PenTool, ArrowUp, Globe, Languages, Loader2, Lightbulb, Users, ArrowLeft } from 'lucide-react';
import { SoundEffects } from '../utils/sound';
import { generateSentenceChallenge } from '../services/geminiService';
import { getGameStats } from '../src/firebase';

interface SentenceGameProps {
  gradeLevel: GradeLevel;
  onExit: () => void;
  onCorrect: (points: number, subject: string) => void;
  onWrong: (subject: string) => void;
  history: string[]; 
  onRegisterHistory: (sentence: string) => void;
}

type Language = 'tr' | 'en';

const SentenceGame: React.FC<SentenceGameProps> = ({ gradeLevel, onExit, onCorrect, onWrong, history, onRegisterHistory }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [language, setLanguage] = useState<Language>('tr');
  const [totalPlays, setTotalPlays] = useState<number | null>(null);
  
  const [targetSentence, setTargetSentence] = useState<string>("");
  const [targetTranslation, setTargetTranslation] = useState<string>("");
  
  const [shuffledWords, setShuffledWords] = useState<{id: string, text: string}[]>([]);
  const [placedWords, setPlacedWords] = useState<{id: string, text: string}[]>([]);
  
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false); 
  
  useEffect(() => {
    setGameState('menu');
    getGameStats('Cümle Ustası').then(setTotalPlays);
  }, [gradeLevel]);

  const startGame = (lang: Language) => {
      setLanguage(lang);
      setGameState('playing');
      startNewRound(lang);
  };

  const startNewRound = async (langParam?: Language) => {
    setLoading(true);
    setHintUsed(false);
    setShowTranslation(false);
    
    const activeLang = langParam || language;
    const gradePool = SENTENCE_POOLS[gradeLevel] || SENTENCE_POOLS[4];
    const pool = gradePool[activeLang];
    
    const availableSentences = pool.filter(s => !history.includes(s.text));
    
    let selectedItem = { text: "", translation: "" };

    if (availableSentences.length > 0) {
        selectedItem = availableSentences[Math.floor(Math.random() * availableSentences.length)];
    } else {
        try {
            selectedItem = await generateSentenceChallenge(gradeLevel, activeLang);
        } catch (e) {
            const fallback = pool[Math.floor(Math.random() * pool.length)]; 
            selectedItem = { text: fallback.text, translation: fallback.translation };
        }
    }

    setTargetSentence(selectedItem.text);
    setTargetTranslation(selectedItem.translation);
    
    const words = selectedItem.text.split(' ');
    const wordObj = words.map((w, i) => ({
      id: `word-${i}-${Math.random()}`,
      text: w
    }));

    setShuffledWords([...wordObj].sort(() => Math.random() - 0.5));
    setPlacedWords([]);
    setIsSuccess(null);
    setLoading(false);
  };

  const handleWordClick = (wordId: string) => {
    if (isSuccess === true) return;

    const inSource = shuffledWords.find(w => w.id === wordId);
    
    if (inSource) {
      setShuffledWords(prev => prev.filter(w => w.id !== wordId));
      setPlacedWords(prev => [...prev, inSource]);
    } else {
      const inPlaced = placedWords.find(w => w.id === wordId);
      if (inPlaced) {
        setPlacedWords(prev => prev.filter(w => w.id !== wordId));
        setShuffledWords(prev => [...prev, inPlaced]);
      }
    }
    
    if (isSuccess === false) setIsSuccess(null);
  };

  const handleHint = () => {
      setHintUsed(true);
      setShowTranslation(true);
  };

  const checkSentence = () => {
    const currentSentence = placedWords.map(w => w.text).join(' ');
    const subject = language === 'tr' ? Subject.TURKISH : Subject.ENGLISH;
    
    if (currentSentence === targetSentence) {
      setIsSuccess(true);
      SoundEffects.playCorrect();
      const points = hintUsed ? 1 : 2;
      onCorrect(points, subject); 
      onRegisterHistory(targetSentence);
    } else {
      setIsSuccess(false);
      SoundEffects.playWrong();
      onWrong(subject);
    }
  };

  if (gameState === 'menu') {
      return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in flex flex-col gap-6">
            <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                    <PenTool size={48} className="text-indigo-600" />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-800">Cümle Ustası</h2>
                <p className="text-gray-500 mt-2">
                    {gradeLevel}. Sınıf için karışık kelimelerden anlamlı cümleler kur. Hangi dilde oynamak istersin?
                </p>
                {totalPlays !== null && (
                    <p className="text-xs font-bold text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <Users size={12}/> {totalPlays.toLocaleString()} kez oynandı
                    </p>
                )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <button 
                    onClick={() => startGame('tr')}
                    className="flex flex-col items-center p-6 rounded-2xl border-2 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all group"
                >
                    <img src="https://flagcdn.com/w80/tr.png" alt="Türkçe" className="w-16 h-10 object-cover rounded shadow-sm mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-red-800 text-lg">Türkçe</span>
                    <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded mt-2">+2 Puan</span>
                </button>

                <button 
                    onClick={() => startGame('en')}
                    className="flex flex-col items-center p-6 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all group"
                >
                    <img src="https://flagcdn.com/w80/gb.png" alt="English" className="w-16 h-10 object-cover rounded shadow-sm mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-blue-800 text-lg">English</span>
                    <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded mt-2">+2 Puan</span>
                </button>
            </div>
            
            <button onClick={onExit} className="mt-4 text-gray-400 font-bold hover:text-gray-600 flex items-center justify-center gap-2"><ArrowLeft size={16}/> Geri</button>
        </div>
      );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6 animate-fade-in min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <button onClick={() => setGameState('menu')} className="text-gray-400 font-bold text-sm hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={16}/> Geri</button>
        <div className="bg-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 font-bold flex items-center gap-2 text-xs sm:text-sm">
           {language === 'tr' ? <img src="https://flagcdn.com/w40/tr.png" className="w-6 h-4 rounded"/> : <img src="https://flagcdn.com/w40/gb.png" className="w-6 h-4 rounded"/>}
           <span>{gradeLevel}. Sınıf</span>
        </div>
        <button onClick={() => startNewRound()} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200" title="Yeniden Başlat">
            <RefreshCw size={16}/>
        </button>
      </div>
      <div className="text-center mb-4">
        <p className="text-gray-500 font-medium text-sm sm:text-base mb-2">
            {language === 'tr' ? 'Kelimeleri doğru sıraya dizerek cümleyi oluştur.' : 'Put the words in the correct order.'}
        </p>
        {language === 'en' && targetTranslation && !isSuccess && (
            <div className="flex justify-center">
                {!showTranslation ? (
                    <button 
                        onClick={handleHint}
                        className="flex items-center gap-2 text-orange-500 font-bold text-sm bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                        <Lightbulb size={16} /> İpucu (Puan yarıya düşer)
                    </button>
                ) : (
                    <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold animate-fade-in border border-orange-100">
                        🇹🇷 {targetTranslation}
                    </div>
                )}
            </div>
        )}
      </div>
      {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4"/>
              <p>Yeni cümle hazırlanıyor...</p>
          </div>
      ) : (
      <>
        <div className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl mb-6 transition-colors border-2 min-h-[150px] ${
            isSuccess === true ? 'bg-green-50 border-green-200' : 
            isSuccess === false ? 'bg-red-50 border-red-200' : 
            'bg-gray-50 border-gray-200 border-dashed'
        }`}>
            <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                {placedWords.length === 0 && (
                <span className="text-gray-300 font-bold select-none text-sm sm:text-base">
                    {language === 'tr' ? 'Kelimeleri buraya taşı...' : 'Drag words here...'}
                </span>
                )}
                {placedWords.map((word) => (
                <button 
                    key={word.id}
                    onClick={() => handleWordClick(word.id)}
                    className="bg-white text-indigo-900 font-bold px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-md border-b-4 border-indigo-200 hover:border-indigo-300 active:scale-95 transition-all text-base sm:text-xl animate-scale-up"
                >
                    {word.text}
                </button>
                ))}
            </div>
        </div>
        <div className="min-h-12 flex flex-col items-center justify-center mb-4">
            {isSuccess === true && (
                <>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-lg sm:text-xl animate-bounce mb-2">
                        <CheckCircle2 /> {language === 'tr' ? 'Harika! Doğru Cümle.' : 'Great Job! Correct.'} (+{hintUsed ? 1 : 2})
                    </div>
                    {language === 'en' && targetTranslation && (
                        <div className="text-gray-500 font-medium text-sm sm:text-base bg-gray-100 px-4 py-2 rounded-full animate-fade-in">
                            Anlamı: {targetTranslation}
                        </div>
                    )}
                </>
            )}
            {isSuccess === false && (
                <div className="flex items-center gap-2 text-red-500 font-bold text-lg animate-shake">
                <XCircle /> {language === 'tr' ? 'Yanlış Oldu, Tekrar Dene.' : 'Wrong, try again.'}
                </div>
            )}
        </div>
        <div className="bg-indigo-50 p-4 sm:p-6 rounded-2xl flex flex-wrap gap-2 sm:gap-3 justify-center items-center min-h-[120px]">
            {shuffledWords.length === 0 && !isSuccess && (
                <span className="text-indigo-300 font-bold flex items-center gap-2 text-sm">
                    <ArrowUp size={20} className="animate-bounce"/> 
                    {language === 'tr' ? 'Yukarıdaki kelimeleri kontrol et' : 'Check words above'}
                </span>
            )}
            {shuffledWords.map((word) => (
                <button 
                    key={word.id}
                    onClick={() => handleWordClick(word.id)}
                    className="bg-indigo-600 text-white font-bold px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg border-b-4 border-indigo-800 hover:bg-indigo-700 active:scale-95 transition-all text-base sm:text-xl"
                >
                    {word.text}
                </button>
                ))}
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center gap-4">
            {isSuccess === true ? (
                <button 
                onClick={() => startNewRound()}
                className="bg-green-500 text-white px-8 py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all text-lg w-full max-w-xs"
                >
                {language === 'tr' ? 'Sıradaki Cümle' : 'Next Sentence'}
                </button>
            ) : (
                <button 
                onClick={checkSentence}
                disabled={placedWords.length === 0}
                className="bg-indigo-600 text-white px-8 py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-lg w-full max-w-xs"
                >
                {language === 'tr' ? 'Kontrol Et' : 'Check'}
                </button>
            )}
        </div>
      </>
      )}
    </div>
  );
};

export default SentenceGame;
