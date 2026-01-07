
import React, { useState, useEffect } from 'react';
import { UserProfile, GradeLevel } from '../types';
import { User, Trash2, GraduationCap, Info, Star, LogIn } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, getUserProfile } from '../src/firebase';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onShowAbout: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onShowAbout }) => {
  const [savedUsers, setSavedUsers] = useState<UserProfile[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(4);
  
  // Google girişinde yeni kullanıcı ise sınıf seçimi için state
  const [googleUserPending, setGoogleUserPending] = useState<any>(null);

  useEffect(() => {
    const users = localStorage.getItem('bilgicarki_users');
    if (users) {
      setSavedUsers(JSON.parse(users));
    }
  }, []);

  const saveUserAndLogin = (user: UserProfile) => {
    // Google kullanıcılarını yerel storage'a kaydetmeyebiliriz, ama burada hibrit bir yapı kuruyoruz.
    // Eğer ID uzunsa (Firebase UID), local listeye eklemeyelim ki karışıklık olmasın veya ekleyelim tercih meselesi.
    // Şimdilik sadece yerel kullanıcıları kaydedelim.
    if (user.id.length < 20) {
        const updatedUsers = [...savedUsers.filter(u => u.id !== user.id), user];
        localStorage.setItem('bilgicarki_users', JSON.stringify(updatedUsers));
    }
    onLogin(user);
  };

  const handleNewLogin = () => {
    if (googleUserPending) {
        // Google kullanıcısı sınıfını seçti ve tamamlıyor
        const newUser: UserProfile = {
            id: googleUserPending.uid,
            name: googleUserPending.displayName || "Öğrenci",
            gradeLevel: selectedGrade,
            score: 0,
            streak: 0,
            stats: {},
            topicStats: {},
            scoreBreakdown: { quiz: 0, exam: 0, games: 0 },
            gameSubjectStats: {},
            gamePlayCounts: {},
            questionHistory: [],
            bingoHistory: [],
            matchingGameHistory: [],
            historyGameHistory: [],
            sentenceGameHistory: [],
            sortingGameHistory: [],
            hangmanGameHistory: [],
            literacyHistory: [],
            customItems: [],
            lastActive: Date.now()
        };
        // Firebase'e kaydetme işlemi App.tsx içinde handleLogin sonrası yapılacak
        onLogin(newUser);
    } else {
        // Yerel kullanıcı girişi
        if (!newName.trim()) {
            alert("Lütfen ismini yaz!");
            return;
        }

        const newUser: UserProfile = {
            id: Date.now().toString(),
            name: newName.trim(),
            gradeLevel: selectedGrade,
            score: 0,
            streak: 0,
            stats: {},
            topicStats: {},
            scoreBreakdown: { quiz: 0, exam: 0, games: 0 },
            gameSubjectStats: {},
            gamePlayCounts: {},
            questionHistory: [],
            bingoHistory: [],
            matchingGameHistory: [],
            historyGameHistory: [],
            sentenceGameHistory: [],
            sortingGameHistory: [],
            hangmanGameHistory: [],
            literacyHistory: [],
            customItems: [],
            lastActive: Date.now()
        };
        saveUserAndLogin(newUser);
    }
  };

  const handleGoogleSignIn = async () => {
      if (!auth) {
          alert("Google girişi şu an kullanılamıyor (API Key eksik olabilir).");
          return;
      }
      try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          
          // Veritabanında var mı kontrol et
          const existingProfile = await getUserProfile(user.uid);
          
          if (existingProfile) {
              onLogin(existingProfile as UserProfile);
          } else {
              // Yeni kullanıcı, sınıf seçmesi lazım
              setGoogleUserPending(user);
              setNewName(user.displayName || "");
          }
      } catch (error) {
          console.error("Login failed", error);
      }
  };

  const deleteUser = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Bu kaydı silmek istediğine emin misin?")) {
      const filtered = savedUsers.filter(u => u.id !== id);
      setSavedUsers(filtered);
      localStorage.setItem('bilgicarki_users', JSON.stringify(filtered));
    }
  };
  
  const isNameValid = googleUserPending ? true : newName.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EBF5FF] p-4 font-sans">
      <div className="w-full max-w-md flex justify-center mb-6">
        <button 
          onClick={onShowAbout}
          className="flex items-center gap-2 bg-[#DDEBFF] text-[#4F95FF] px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-white transition-all border border-white"
        >
          <Info size={16} /> Hakkında
        </button>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center relative border border-white ring-1 ring-slate-100">
        
        {googleUserPending ? (
             // Google ile giriş yaptıktan sonra sınıf seçme ekranı
             <>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-inner animate-bounce">
                    <User size={48} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Merhaba, {googleUserPending.displayName}!</h1>
                <p className="text-slate-500 text-sm font-bold mb-8">Devam etmek için sınıfını seçmelisin.</p>
             </>
        ) : (
             // Normal Giriş Ekranı
             <>
                <div className="w-24 h-24 bg-[#E8EEFF] rounded-full flex items-center justify-center text-[#4F6DFF] mb-4 shadow-inner">
                    <User size={48} />
                </div>
                <h1 className="text-3xl font-black text-[#2D366D] mb-6">Hoş Geldin!</h1>

                {/* Google Sign In Button */}
                <button 
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white border-2 border-slate-200 text-slate-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all mb-8 shadow-sm group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google ile Giriş Yap
                </button>

                {savedUsers.length > 0 && (
                <div className="w-full mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Kayıtlı Profiller</h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                    {savedUsers.sort((a,b) => b.lastActive - a.lastActive).map(user => (
                        <div 
                        key={user.id}
                        onClick={() => saveUserAndLogin({...user, lastActive: Date.now()})}
                        className="bg-[#F3F8FF] p-3 rounded-2xl flex items-center justify-between border border-transparent hover:border-[#4F6DFF] hover:bg-white transition-all cursor-pointer group shadow-sm"
                        >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-[#4F6DFF] text-[#4F6DFF] text-[10px] font-black">
                            {user.gradeLevel === 5 ? 'Y' : `${user.gradeLevel}`}
                            </div>
                            <div>
                            <div className="font-black text-[#2D366D] text-sm leading-none mb-1">{user.name}</div>
                            <div className="flex items-center gap-1 text-[#4F6DFF] text-[10px] font-bold">
                                <Star size={8} fill="currentColor" /> {user.score} P
                            </div>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => deleteUser(e, user.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                <div className="w-full flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-100"></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter whitespace-nowrap">Veya Misafir Girişi</span>
                    <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <div className="relative w-full mb-6">
                    <input 
                    type="text" 
                    placeholder="İsmin..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#F8FAFF] border-2 border-slate-50 rounded-2xl py-4 px-6 font-bold text-slate-700 text-center text-lg focus:border-[#4F6DFF] focus:outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
             </>
        )}

        <div className="w-full space-y-6">
          <div className="space-y-3">
             <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                <GraduationCap size={14} /> Seviyen Nedir?
             </div>
             <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3, 4].map(g => (
                  <button 
                    key={g}
                    onClick={() => setSelectedGrade(g as GradeLevel)}
                    className={`w-12 h-12 rounded-2xl font-black text-lg transition-all shadow-sm ${selectedGrade === g ? 'bg-[#4F6DFF] text-white scale-110 shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                  >
                    {g}
                  </button>
                ))}
                <button 
                    onClick={() => setSelectedGrade(5)}
                    className={`px-4 h-12 rounded-2xl font-black text-sm transition-all shadow-sm ${selectedGrade === 5 ? 'bg-slate-800 text-white scale-105 shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                >
                    Yetişkin
                </button>
             </div>
          </div>

          <button 
            onClick={handleNewLogin}
            disabled={!isNameValid}
            className={`w-full py-5 rounded-3xl font-black text-xl shadow-lg transition-all transform active:scale-[0.98] uppercase tracking-wider ${isNameValid ? 'bg-[#4F6DFF] hover:bg-[#3b5bdb] text-white shadow-[#4F6DFF]/30' : 'bg-slate-300 text-slate-100 cursor-not-allowed'}`}
          >
            {googleUserPending ? "TAMAMLA VE BAŞLA" : "BAŞLA"}
          </button>
          
          {googleUserPending && (
             <button onClick={() => setGoogleUserPending(null)} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 py-2">
                 İptal Et
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
