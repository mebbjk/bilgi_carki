
import React, { useState } from 'react';
import { X, User, Heart, Mail, Instagram, Globe, Copy, Check, Coffee, Brain, Sparkles, Target, Smile } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const [showSupport, setShowSupport] = useState(false);
  const [copied, setCopied] = useState(false);

  // BURAYA KENDİ IBAN NUMARANI YAZABİLİRSİN
  const MY_IBAN = "TR91 0015 7000 0000 0160 0093 89"; 
  const ACCOUNT_NAME = "Mehmet Emre Bulun";

  const handleCopy = () => {
    navigator.clipboard.writeText(MY_IBAN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 flex items-center justify-center relative shrink-0">
          <div className="absolute top-4 right-4">
            <button 
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-md"
            >
                <X size={20} />
            </button>
          </div>
          
          <div className="bg-white p-1 rounded-full shadow-xl -mb-16 z-10">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
               <img src="https://github.com/mebbjk.png" alt="Profil" className="w-full h-full object-cover" /> 
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 pb-8 px-6 sm:px-8 text-center overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-1">Mehmet Emre Bulun</h2>
            <p className="text-indigo-600 font-bold text-sm uppercase tracking-wide mb-4">Uygulama Geliştiricisi</p>
            
            {/* Support Button */}
            <div className="mb-6 flex justify-center">
                {!showSupport ? (
                    <button 
                        onClick={() => setShowSupport(true)}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 text-sm animate-pulse"
                    >
                        <Coffee size={18} /> Destekte Bulun
                    </button>
                ) : (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 w-full animate-fade-in">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Banka Hesabı</span>
                            <button onClick={() => setShowSupport(false)} className="text-rose-300 hover:text-rose-500"><X size={16}/></button>
                        </div>
                        <p className="text-gray-800 font-bold text-sm mb-2">{ACCOUNT_NAME}</p>
                        <div 
                            onClick={handleCopy}
                            className="bg-white border border-rose-200 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-rose-400 transition-colors group"
                        >
                            <span className="font-mono text-gray-600 text-xs sm:text-sm truncate mr-2 select-all">{MY_IBAN}</span>
                            <div className="text-rose-500">
                                {copied ? <Check size={18} /> : <Copy size={18} className="group-hover:scale-110 transition-transform"/>}
                            </div>
                        </div>
                        <p className="text-rose-400 text-[10px] mt-2">
                            {copied ? "IBAN Kopyalandı!" : "Kopyalamak için tıklayın"}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6 text-left">
                <p className="text-gray-600 text-sm leading-relaxed">
                    Merhaba! Bu uygulama, 1-4. sınıf öğrencilerinin derslerini oyunlaştırarak daha eğlenceli hale getirmek amacıyla geliştirilmiştir. Yapay zeka desteği ile her seviyeye uygun içerikler sunar. Bir sorunla karşılaşırsanız bana bildirmekten çekinmeyin. Yorumlarınızı, desteklerinizi, eleştirileriniz ve taleplerinizi bekliyorum.
                </p>
            </div>

            {/* --- EĞİTSEL FAYDA BİLGİLENDİRMESİ --- */}
            <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 mb-6 text-left shadow-sm">
                <div className="flex items-center gap-2 mb-3 border-b border-orange-200 pb-2">
                    <Brain className="text-orange-500 w-5 h-5" />
                    <h3 className="font-bold text-orange-800 text-sm uppercase tracking-wide">Neden Oyunla Öğrenme?</h3>
                </div>
                
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="bg-white p-1.5 rounded-lg h-fit shadow-sm"><Sparkles className="w-4 h-4 text-yellow-500" /></div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Kalıcı Öğrenme</h4>
                            <p className="text-xs text-gray-600 leading-snug">Çocuklar eğlenirken öğrendikleri bilgileri daha kolay hafızaya alır ve zor unuturlar.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white p-1.5 rounded-lg h-fit shadow-sm"><Target className="w-4 h-4 text-green-500" /></div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Motivasyon ve Özgüven</h4>
                            <p className="text-xs text-gray-600 leading-snug">Başarma duygusu, çocuğun derslere karşı ilgisini ve kendine olan güvenini artırır.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white p-1.5 rounded-lg h-fit shadow-sm"><Smile className="w-4 h-4 text-blue-500" /></div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Stresiz Tekrar</h4>
                            <p className="text-xs text-gray-600 leading-snug">Sınav kaygısı olmadan, oyun rahatlığıyla yapılan tekrarlar başarıyı getirir.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-orange-200 text-[10px] sm:text-xs text-orange-700 italic font-medium">
                    "Değerli Veliler; bu uygulama çocuğunuzun ekran süresini verimli bir ders tekrarına dönüştürmeyi amaçlar."
                </div>
            </div>

            <div className="space-y-3">
                <a href="https://instagram.com/meb.bjk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 group">
                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <Instagram size={18} />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-gray-400 font-bold uppercase">Instagram</div>
                        <div className="text-sm font-bold text-gray-800">@meb.bjk</div>
                    </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 group">
                    <div className="bg-blue-500 text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <Mail size={18} />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-gray-400 font-bold uppercase">İletişim</div>
                        <div className="text-sm font-bold text-gray-800">bilgicarki2025@gmail.com</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>Sevgiyle tasarlandı</span>
                <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                <span>v1.0.0</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
    