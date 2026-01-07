
import React, { useState, useEffect } from 'react';
import { UserProfile, AppMode, SiteStats, SubjectStats, TopicStats } from './types';
import Home from './components/Home';
import GameMenu from './components/GameMenu';
import QuizGame from './components/QuizGame';
import LiteracyGame from './components/LiteracyGame';
import MultiplicationGame from './components/MultiplicationGame';
import TestMode from './components/TestMode';
import BingoGame from './components/BingoGame';
import MatchingGame from './components/MatchingGame';
import HistoryGame from './components/HistoryGame';
import SentenceGame from './components/SentenceGame';
import SortingGame from './components/SortingGame';
import HangmanGame from './components/HangmanGame';
import TabooGame from './components/TabooGame';
import StoryGame from './components/StoryGame';
import WordPairsGame from './components/WordPairsGame';
import ScrabbleGame from './components/ScrabbleGame';
import TurkeyMapGame from './components/TurkeyMapGame';
import CustomWheelGame from './components/CustomWheelGame';
import LessonSelection from './components/LessonSelection';
import StatsModal from './components/StatsModal';
import AboutModal from './components/AboutModal';
import Login from './components/Login';
import { SoundEffects } from './utils/sound';
import { updateGlobalStats, logActivity, subscribeToStats, saveUserProfile } from './src/firebase';
import { Layout, BarChart2, Info, LogOut, Loader2, Star, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('home');
  const [siteStats, setSiteStats] = useState<SiteStats>({ totalVisits: 0, totalGamesPlayed: 0, gameCounts: {} });
  const [showStats, setShowStats] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const initApp = async () => {
        const minWait = new Promise(resolve => setTimeout(resolve, 1500));
        
        const voiceWait = new Promise(resolve => {
            SoundEffects.waitForVoices().then(resolve).catch(resolve);
            setTimeout(resolve, 2000); 
        });

        await Promise.all([minWait, voiceWait]);
        setIsInitializing(false);
    };

    initApp();
    const unsub = subscribeToStats(setSiteStats);
    return () => unsub();
  }, []);

  // Kullanıcı verisi her değiştiğinde (puan vb.), eğer Firebase kullanıcısı ise veritabanına kaydet
  useEffect(() => {
      if (currentUser && isLoggedIn && currentUser.id.length > 20) { // Firebase ID'leri genellikle uzundur
          const save = async () => {
             await saveUserProfile(currentUser);
          };
          // Çok sık yazmayı önlemek için debounce
          const timeout = setTimeout(save, 2000);
          return () => clearTimeout(timeout);
      }
  }, [currentUser, isLoggedIn]);

  const handleLogin = async (user: UserProfile) => {
      try {
        await SoundEffects.resumeContext();
      } catch(e) { console.warn("Audio context resume failed", e); }

      setCurrentUser(user);
      setIsLoggedIn(true);
      setAppMode('home');
      updateGlobalStats('visit');
      logActivity(user.name, user.gradeLevel, 'Giriş Yaptı');
      
      if (user.gradeLevel !== 5) {
          SoundEffects.speak(`Hoş geldin şampiyon!`);
      }
      
      // İlk girişte kaydet (Özellikle yeni Google kullanıcıları için)
      if (user.id.length > 20) {
          saveUserProfile(user);
      }
  };

  const handleNavigate = (mode: AppMode) => {
      SoundEffects.resumeContext();
      setAppMode(mode);
  };

  const handleCorrect = (points: number, subject: string = 'Genel', isCorrect: boolean = true) => {
    if (!currentUser) return;
    
    setCurrentUser(prev => {
        if (!prev) return null;
        const newStats = { ...prev.stats };
        if (!newStats[subject]) newStats[subject] = { correct: 0, total: 0 };
        newStats[subject].total += 1;
        if (isCorrect) newStats[subject].correct += 1;

        const newBreakdown = { ...(prev.scoreBreakdown || { quiz: 0, exam: 0, games: 0 }) };
        if (appMode === 'lessons') newBreakdown.quiz += points;
        else if (appMode === 'test') newBreakdown.exam += points;
        else newBreakdown.games += points;

        const newGameStats = { ...(prev.gameSubjectStats || {}) };
        if (points > 0) {
            newGameStats[subject] = (newGameStats[subject] || 0) + points;
        }

        return { 
            ...prev, 
            score: prev.score + points, 
            streak: isCorrect ? prev.streak + 1 : 0,
            stats: newStats,
            scoreBreakdown: newBreakdown,
            gameSubjectStats: newGameStats
        };
    });
  };

  const trackGamePlay = (gameName: string) => {
      if (!currentUser) return;
      setCurrentUser(prev => {
          if (!prev) return null;
          const newCounts = { ...(prev.gamePlayCounts || {}) };
          newCounts[gameName] = (newCounts[gameName] || 0) + 1;
          return { ...prev, gamePlayCounts: newCounts };
      });
      updateGlobalStats('game', gameName);
  };

  const handleTestComplete = (subjectResults: Record<string, SubjectStats>, topicResults: Record<string, TopicStats>) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
        if (!prev) return null;
        const updatedStats = { ...prev.stats };
        Object.entries(subjectResults).forEach(([subj, res]) => {
            if (!updatedStats[subj]) updatedStats[subj] = { correct: 0, total: 0 };
            updatedStats[subj].correct += res.correct;
            updatedStats[subj].total += res.total;
        });
        return { ...prev, stats: updatedStats, topicStats: { ...(prev.topicStats || {}), ...topicResults } };
    });
    trackGamePlay('Sınav Modu');
  };

  const updateGameHistory = (mode: string, newItems: string[]) => {
      if (!currentUser) return;
      setCurrentUser(prev => {
          if (!prev) return null;
          const updated = { ...prev };
          switch(mode) {
              case 'quiz': updated.questionHistory = [...new Set([...(prev.questionHistory || []), ...newItems])].slice(-200); break;
              case 'bingo': updated.bingoHistory = [...new Set([...(prev.bingoHistory || []), ...newItems])].slice(-200); break;
              case 'match': updated.matchingGameHistory = [...new Set([...(prev.matchingGameHistory || []), ...newItems])].slice(-200); break;
              case 'history': updated.historyGameHistory = [...new Set([...(prev.historyGameHistory || []), ...newItems])].slice(-200); break;
              case 'sentence': updated.sentenceGameHistory = [...new Set([...(prev.sentenceGameHistory || []), ...newItems])].slice(-200); break;
              case 'sorting': updated.sortingGameHistory = [...new Set([...(prev.sortingGameHistory || []), ...newItems])].slice(-200); break;
              case 'hangman': updated.hangmanGameHistory = [...new Set([...(prev.hangmanGameHistory || []), ...newItems])].slice(-200); break;
              case 'literacy': updated.literacyHistory = [...new Set([...(prev.literacyHistory || []), ...newItems])].slice(-200); break;
          }
          return updated;
      });
  };

  if (isInitializing) {
      return (
          <div className="fixed inset-0 z-[100] bg-gradient-to-br from-indigo-600 to-purple-800 flex flex-col items-center justify-center text-white">
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="bg-white/10 p-10 rounded-[3rem] backdrop-blur-xl border-4 border-white/20 relative shadow-2xl">
                      <Star size={80} className="text-yellow-400 animate-spin-slow" fill="currentColor" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-pink-500 p-3 rounded-2xl animate-bounce shadow-lg">
                      <Sparkles size={24} />
                  </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 drop-shadow-lg">Bilgi Çarkı</h2>
              <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-2xl border border-white/10">
                  <Loader2 size={24} className="animate-spin text-indigo-200" />
                  <span className="font-bold text-indigo-100 tracking-wide">Maceraya Hazırlanıyoruz...</span>
              </div>
              <p className="mt-10 text-white/40 text-xs font-bold uppercase tracking-widest">© 2025 Eğlenceli Öğrenme</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} onShowAbout={() => setShowAbout(false)} />
      ) : (
        <>
          <header className="bg-white shadow-sm sticky top-0 z-40 px-4 py-3 flex justify-between items-center border-b-2 border-indigo-50">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
                  <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm"><Layout size={20}/></div>
                  <h1 className="text-lg font-black text-slate-800 uppercase">BİLGİ ÇARKI</h1>
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={() => setShowStats(true)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600" aria-label="İstatistikler" title="Karnem"><BarChart2 size={20}/></button>
                  <button onClick={() => setShowAbout(true)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600" aria-label="Hakkında" title="Uygulama Hakkında"><Info size={20}/></button>
                  <button onClick={() => setIsLoggedIn(false)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl ml-1" aria-label="Çıkış" title="Çıkış Yap"><LogOut size={20}/></button>
              </div>
          </header>
          <main className="flex-1 p-4 flex flex-col items-center">
              {appMode === 'home' && <Home siteStats={siteStats} userName={currentUser!.name} gradeLevel={currentUser!.gradeLevel} score={currentUser!.score} totalGamesPlayed={siteStats.totalGamesPlayed} onNavigate={handleNavigate} />}
              
              {appMode === 'lessons' && (
                <QuizGame 
                    gradeLevel={currentUser!.gradeLevel} 
                    history={currentUser!.questionHistory} 
                    onCorrect={(p, s) => handleCorrect(p, s)} 
                    onRegisterHistory={(q) => updateGameHistory('quiz', q)} 
                    onExit={() => handleNavigate(currentUser?.gradeLevel === 5 ? 'home' : 'lesson_selection')} 
                />
              )}

              {appMode === 'lesson_selection' && <LessonSelection gradeLevel={currentUser!.gradeLevel} onSelect={(m) => handleNavigate(m as any)} onExit={() => handleNavigate('home')} />}
              
              {(appMode === 'game_menu' || appMode === 'games') && <GameMenu siteStats={siteStats} onChangeMode={(m) => { handleNavigate(m); trackGamePlay(m); }} />}
              
              {appMode === 'literacy' && <LiteracyGame history={currentUser!.literacyHistory || []} onRegisterHistory={(w) => updateGameHistory('literacy', w)} onExit={() => handleNavigate('home')} onCorrect={(p, s) => handleCorrect(p, s)} />}
              {appMode === 'multiplication' && <MultiplicationGame gradeLevel={currentUser!.gradeLevel} onExit={() => handleNavigate('game_menu')} onCorrect={(p) => handleCorrect(p, 'Matematik')} onWrong={() => handleCorrect(0, 'Matematik', false)} />}
              {appMode === 'test' && <TestMode gradeLevel={currentUser!.gradeLevel} history={currentUser!.questionHistory} onExit={() => handleNavigate('lesson_selection')} onFinish={(s) => handleCorrect(s, 'Genel')} onComplete={handleTestComplete} onRegisterHistory={(q) => updateGameHistory('quiz', q)} />}
              {appMode === 'bingo' && <BingoGame gradeLevel={currentUser!.gradeLevel} history={currentUser!.bingoHistory} onRegisterHistory={(w) => { updateGameHistory('bingo', w); trackGamePlay('Tombala'); }} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'match' && <MatchingGame gradeLevel={currentUser!.gradeLevel} history={currentUser!.matchingGameHistory} onCorrect={(p, s) => handleCorrect(p, s)} onWrong={() => handleCorrect(0, 'İngilizce', false)} onRegisterHistory={(ids) => updateGameHistory('match', ids)} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'history' && <HistoryGame gradeLevel={currentUser!.gradeLevel} history={currentUser!.historyGameHistory} onCorrect={(p) => handleCorrect(p, 'Sosyal Bilgiler')} onWrong={() => handleCorrect(0, 'Sosyal Bilgiler', false)} onRegisterHistory={(ids) => updateGameHistory('history', ids)} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'sentence' && <SentenceGame gradeLevel={currentUser!.gradeLevel} history={currentUser!.sentenceGameHistory} onCorrect={(p, s) => handleCorrect(p, s)} onWrong={(s) => handleCorrect(0, s, false)} onRegisterHistory={(s) => updateGameHistory('sentence', [s])} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'sorting' && <SortingGame gradeLevel={currentUser!.gradeLevel} history={currentUser!.sortingGameHistory} onCorrect={(p, s) => handleCorrect(p, s)} onWrong={(s) => handleCorrect(0, s, false)} onRegisterHistory={(s) => updateGameHistory('sorting', [s])} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'hangman' && <HangmanGame gradeLevel={currentUser!.gradeLevel} history={currentUser!.hangmanGameHistory} onCorrect={(p, s) => handleCorrect(p, s)} onWrong={(s) => handleCorrect(0, s, false)} onRegisterHistory={(w) => updateGameHistory('hangman', [w])} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'taboo' && <TabooGame gradeLevel={currentUser!.gradeLevel} onExit={() => handleNavigate('game_menu')} onCorrect={(p) => handleCorrect(p, 'Genel')} onWrong={() => handleCorrect(0, 'Genel', false)} />}
              {appMode === 'story' && <StoryGame gradeLevel={currentUser!.gradeLevel} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'word_pairs' && <WordPairsGame gradeLevel={currentUser!.gradeLevel} onCorrect={(p) => handleCorrect(p, 'Türkçe')} onWrong={() => handleCorrect(0, 'Türkçe', false)} onExit={() => handleNavigate('game_menu')} />}
              {appMode === 'scrabble' && <ScrabbleGame gradeLevel={currentUser!.gradeLevel} onCorrect={(p, s) => handleCorrect(p, s)} onWrong={() => handleCorrect(0, 'Türkçe', false)} onExit={() => handleNavigate('game_menu')} />}
              
              {appMode === 'turkey_map' && <TurkeyMapGame onCorrect={(p, s) => handleCorrect(p, s)} onWrong={(s) => handleCorrect(0, s, false)} onExit={() => handleNavigate('game_menu')} />}

              {appMode === 'custom' && <CustomWheelGame onExit={() => handleNavigate('home')} />}
          </main>
          {showStats && <StatsModal onClose={() => setShowStats(false)} userName={currentUser!.name} gradeLevel={currentUser!.gradeLevel} score={currentUser!.score} streak={currentUser!.streak} subjectStats={currentUser!.stats} topicStats={currentUser!.topicStats || {}} gamePlayCounts={currentUser!.gamePlayCounts || {}} scoreBreakdown={currentUser!.scoreBreakdown || {quiz:0,exam:0,games:0}} gameSubjectStats={currentUser!.gameSubjectStats} />}
        </>
      )}
    </div>
  );
};

export default App;
