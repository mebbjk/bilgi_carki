
import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, X, Trophy, BookOpen, Grid3X3, Copy, Check, ImageIcon, FileJson, List, Trash2, Loader2, Clock, Brain, Zap, Target, Star, TrendingUp, AlertCircle, PlusCircle, AlertTriangle, Smile, MapPin } from 'lucide-react';
import { GradeLevel, SubjectStats, TopicStats } from '../types';
import html2canvas from 'html2canvas';
import { getActivityLogs, clearActivityLogs, ActivityLog } from '../src/firebase';

interface StatsModalProps {
  onClose: () => void;
  userName: string;
  gradeLevel: GradeLevel;
  score: number;
  streak: number;
  subjectStats: Record<string, SubjectStats>;
  topicStats: Record<string, TopicStats>;
  gamePlayCounts: Record<string, number>;
  scoreBreakdown: { quiz: number; exam: number; games: number };
  gameSubjectStats?: Record<string, number>;
}

const GAME_PEDAGOGY: Record<string, { skill: string; subject: string; color: string; icon: any }> = {
  'Tombala': { skill: 'Görsel Hafıza & Kelime', subject: 'Serbest Etkinlik', color: 'bg-green-100 text-green-700', icon: <Brain size={14}/> },
  'Çarpım Tablosu': { skill: 'Hızlı İşlem & Matematik', subject: 'Matematik', color: 'bg-red-100 text-red-700', icon: <Zap size={14}/> },
  'Kelime Avcısı': { skill: 'Yabancı Dil & Eşleştirme', subject: 'İngilizce', color: 'bg-purple-100 text-purple-700', icon: <Target size={14}/> },
  'Zaman Tüneli': { skill: 'Kronolojik Düşünme', subject: 'Sosyal Bilgiler', color: 'bg-blue-100 text-blue-700', icon: <Clock size={14}/> },
  'Cümle Ustası': { skill: 'Dil Bilgisi & Mantık', subject: 'Türkçe / İngilizce', color: 'bg-indigo-100 text-indigo-700', icon: <BookOpen size={14}/> },
  'Bilgi Kutuları': { skill: 'Kategorize Etme', subject: 'Fen / Sosyal', color: 'bg-orange-100 text-orange-700', icon: <Grid3X3 size={14}/> },
  'Kelime Tahmin': { skill: 'Sözel Zeka', subject: 'Türkçe / İngilizce', color: 'bg-pink-100 text-pink-700', icon: <Star size={14}/> },
  'Yasak Kelime': { skill: 'İfade Yeteneği', subject: 'Serbest Etkinlik', color: 'bg-rose-100 text-rose-700', icon: <Brain size={14}/> },
  'Anlam İlişkisi': { skill: 'Kelime Hazinesi', subject: 'Türkçe', color: 'bg-teal-100 text-teal-700', icon: <BookOpen size={14}/> },
  'Kelime Türetmece': { skill: 'Analitik Düşünme', subject: 'Türkçe', color: 'bg-yellow-100 text-yellow-700', icon: <Brain size={14}/> },
  'Şehir Bulmaca': { skill: 'Coğrafya Bilgisi', subject: 'Coğrafya', color: 'bg-cyan-100 text-cyan-700', icon: <MapPin size={14}/> },
  'Sınav Modu': { skill: 'Akademik Başarı', subject: 'Tüm Dersler', color: 'bg-gray-100 text-gray-700', icon: <Trophy size={14}/> },
  'Bilgi Çarkı': { skill: 'Genel Kültür', subject: 'Tüm Dersler', color: 'bg-indigo-100 text-indigo-700', icon: <Zap size={14}/> }
};

const StatsModal: React.FC<StatsModalProps> = ({ 
    onClose, userName, gradeLevel, score, streak, subjectStats, topicStats, gamePlayCounts, scoreBreakdown, gameSubjectStats = {}
}) => {
  const [statsTab, setStatsTab] = useState<'personal' | 'class'>('personal');
  const [classLogs, setClassLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (statsTab === 'class') {
          setLoadingLogs(true);
          getActivityLogs()
            .then(logs => {
              setClassLogs(logs);
              setLoadingLogs(false);
            })
            .catch(() => setLoadingLogs(false));
      }
  }, [statsTab]);

  const calculatePerformance = () => {
      let bestSubject = { name: '-', percent: -1 };
      let weakestSubject = { name: '-', percent: 101 };

      Object.entries(subjectStats).forEach(([subj, stat]) => {
          if (stat.total < 3) return;
          const percent = (stat.correct / stat.total) * 100;
          
          if (percent > bestSubject.percent) {
              bestSubject = { name: subj, percent };
          }
          if (percent < weakestSubject.percent) {
              weakestSubject = { name: subj, percent };
          }
      });

      return {
          best: bestSubject.percent > -1 ? bestSubject.name : "Henüz Yeterli Veri Yok",
          weakest: weakestSubject.percent < 101 ? weakestSubject.name : "Henüz Yeterli Veri Yok"
      };
  };

  const getWeakTopics = () => {
    const weak: { subject: string, topic: string, wrong: number, total: number }[] = [];
    Object.entries(topicStats).forEach(([key, val]) => {
        if (val.total > 0 && val.correct < val.total) { 
            const parts = key.split(':');
            const subj = parts[0];
            const topic = parts.length > 1 ? parts[1] : 'Genel';
            weak.push({ subject: subj, topic, wrong: val.total - val.correct, total: val.total });
        }
    });
    return weak.sort((a, b) => b.wrong - a.wrong);
  };

  const performance = calculatePerformance();
  const weakTopics = getWeakTopics();

  const allSubjects = Array.from(new Set([
      ...Object.keys(subjectStats),
      ...Object.keys(gameSubjectStats)
  ]));

  const copyReportToClipboard = () => {
    const date = new Date().toLocaleDateString('tr-TR');
    let reportText = `📊 *${userName} - Bilgi Çarkı Karnesi* (${date})\n\n`;
    reportText += `🏆 Toplam Puan: ${score}\n`;
    reportText += `🌟 En Başarılı Ders: ${performance.best}\n`;
    reportText += `📚 Seviye: ${gradeLevel}. Sınıf\n\n`;
    
    reportText += `🎮 *Oyun Aktiviteleri & Gelişim:*\n`;
    if (Object.keys(gamePlayCounts).length > 0) {
        Object.entries(gamePlayCounts).forEach(([game, count]) => {
            const meta = GAME_PEDAGOGY[game];
            const skillInfo = meta ? `(${meta.skill})` : '';
            reportText += `- ${game}: ${count} kez ${skillInfo}\n`;
        });
    } else {
        reportText += "Henüz oyun oynanmadı.\n";
    }

    reportText += `\n📝 *Puan Detayı:*\n`;
    reportText += `- Bilgi Çarkı: ${scoreBreakdown.quiz}\n`;
    reportText += `- Sınav Modu: ${scoreBreakdown.exam}\n`;
    reportText += `- Oyunlar: ${scoreBreakdown.games}\n`;

    navigator.clipboard.writeText(reportText).then(() => {
        setReportCopied(true);
        setTimeout(() => setReportCopied(false), 2000);
    });
  };

  const handleDownloadImage = async () => {
    if (exportRef.current) {
        const originalStyle = exportRef.current.style.cssText;
        exportRef.current.style.display = 'block'; 
        const canvas = await html2canvas(exportRef.current);
        exportRef.current.style.cssText = originalStyle;
        
        const link = document.createElement('a');
        link.download = `karne-${userName}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
  };
  
  const handleClearLogs = () => {
      if(window.confirm("Tüm sınıf günlüğü silinecek. Emin misiniz?")) {
          clearActivityLogs();
          setClassLogs([]);
      }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Matematik': 'bg-red-500', 'Türkçe': 'bg-teal-500', 'Fen Bilimleri': 'bg-sky-500',
      'Sosyal Bilgiler': 'bg-amber-500', 'İngilizce': 'bg-violet-500', 'Din Kültürü': 'bg-emerald-500',
      'Hayat Bilgisi': 'bg-pink-500', 'Coğrafya': 'bg-cyan-500'
    };
    return colors[subject] || 'bg-indigo-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-2"><BarChart3/> Öğrenci Karnesi</h2>
                <div className="flex gap-2">
                    <button onClick={() => setStatsTab('personal')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${statsTab === 'personal' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Kişisel</button>
                    <button onClick={() => setStatsTab('class')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${statsTab === 'class' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Sınıf Günlüğü</button>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
                </div>
            </div>
            
            {statsTab === 'personal' ? (
                <div ref={exportRef} className="bg-white p-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-2xl border border-indigo-200 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2"><Trophy size={80} /></div>
                            <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">Toplam Puan</div>
                            <div className="text-4xl font-black text-indigo-900">{score}</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl border border-orange-200 shadow-sm relative overflow-hidden">
                             <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2"><Zap size={80} /></div>
                            <div className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">Seri (Streak)</div>
                            <div className="text-4xl font-black text-orange-800">{streak}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200 shadow-sm relative overflow-hidden">
                             <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2"><Star size={80} /></div>
                            <div className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">Seviye</div>
                            <div className="text-4xl font-black text-green-800">{gradeLevel === 5 ? 'Yetişkin' : `${gradeLevel}. Sınıf`}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white border-2 border-green-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="bg-green-100 p-3 rounded-full text-green-600"><TrendingUp size={24}/></div>
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase">En Başarılı Ders</div>
                                <div className="text-xl font-bold text-green-700">{performance.best}</div>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Target size={24}/></div>
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase">Geliştirilmesi Gereken</div>
                                <div className="text-xl font-bold text-orange-700">{performance.weakest}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg"><BookOpen size={20} className="text-indigo-600"/> Ders Başarısı & Telafi</h3>
                            <div className="space-y-5 bg-gray-50 p-6 rounded-3xl">
                                {allSubjects.map((subj) => {
                                    const stat = subjectStats[subj] || { correct: 0, total: 0 };
                                    const gamePoints = gameSubjectStats[subj] || 0;
                                    const bonusCorrect = Math.floor(gamePoints / 10);
                                    const denominator = stat.total > 0 ? stat.total : 10;
                                    const quizPercent = (stat.correct / denominator) * 100;
                                    const bonusPercent = (bonusCorrect / denominator) * 100;
                                    
                                    return (
                                    <div key={subj}>
                                        <div className="flex justify-between items-center text-sm mb-1.5 font-medium">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-700 font-bold">{subj}</span>
                                                {bonusCorrect > 0 && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-200">+{bonusCorrect} Telafi</span>}
                                            </div>
                                            <span className="text-gray-500 text-xs">{stat.correct + bonusCorrect} Doğru</span>
                                        </div>
                                        <div className="h-4 bg-white border border-gray-200 rounded-full overflow-hidden shadow-inner flex relative">
                                            <div className={`h-full transition-all duration-1000 ${getSubjectColor(subj)}`} style={{ width: `${quizPercent}%` }}></div>
                                            {bonusPercent > 0 && <div className={`h-full transition-all duration-1000 ${getSubjectColor(subj)} opacity-40`} style={{ width: `${bonusPercent}%`, backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>}
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg"><Brain size={20} className="text-purple-600"/> Gelişim Alanları</h3>
                            <div className="grid grid-cols-1 gap-3 mb-6 max-h-64 overflow-y-auto pr-2">
                                {Object.entries(gamePlayCounts).map(([game, count]) => {
                                    const meta = GAME_PEDAGOGY[game];
                                    return (
                                        <div key={game} className="bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{game}</div>
                                                {meta && <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${meta.color}`}>{meta.icon} {meta.skill}</span>}
                                            </div>
                                            <div className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">{count} kez</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={copyReportToClipboard} className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${reportCopied ? 'bg-green-500 text-white' : 'bg-indigo-50 text-indigo-700'}`}>{reportCopied ? <Check size={18}/> : <Copy size={18}/>} Raporu Kopyala</button>
                                <div className="flex gap-2">
                                    <button onClick={handleDownloadImage} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><ImageIcon size={18}/> İndir</button>
                                    <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Kapat</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><List className="text-blue-600"/> Sınıf Günlüğü</h3>
                            <button onClick={handleClearLogs} className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"><Trash2 size={12}/> Temizle</button>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex-1 overflow-y-auto border border-gray-100 max-h-[60vh]">
                        {loadingLogs ? <div className="flex flex-col items-center justify-center h-40 text-blue-50"><Loader2 size={40} className="animate-spin mb-2"/></div> : (
                            <div className="space-y-3">
                                {classLogs.map((log) => (
                                    <div key={log.id} className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">{log.studentName}</span>
                                                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">{log.grade === 5 ? 'Yetişkin' : `${log.grade}. Sınıf`}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">{log.action}</div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default StatsModal;
