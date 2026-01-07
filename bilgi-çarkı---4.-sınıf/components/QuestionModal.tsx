
import React, { useState, useEffect } from 'react';
import { QuestionData } from '../types';
import { CheckCircle, XCircle, Award, ArrowRight, Timer, HelpCircle, Sparkles } from 'lucide-react';

interface QuestionModalProps {
  data: QuestionData;
  onClose: (correct: boolean) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ data, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
      if (isSubmitted) return;
      if (timeLeft === 0) {
          handleSubmit();
          return;
      }
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    onClose(selectedOption === data.correctAnswerIndex);
  };

  const getOptionStyle = (index: number) => {
    const baseStyle = "w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 mb-3 flex items-center justify-between text-lg relative overflow-hidden";
    
    if (!isSubmitted) {
      if (selectedOption === index) {
        return `${baseStyle} border-indigo-500 bg-indigo-50 text-indigo-900 shadow-lg ring-4 ring-indigo-100 scale-[1.02]`;
      }
      return `${baseStyle} border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-gray-700 shadow-sm`;
    }

    if (index === data.correctAnswerIndex) {
      return `${baseStyle} border-green-500 bg-green-100 text-green-900 font-black shadow-md`;
    }
    
    if (selectedOption === index && index !== data.correctAnswerIndex) {
      return `${baseStyle} border-red-500 bg-red-100 text-red-900 animate-shake shadow-md`;
    }

    return `${baseStyle} border-gray-50 bg-gray-50 text-gray-300 opacity-60 grayscale`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-scale-up flex flex-col max-h-[95vh] border-8 border-white ring-1 ring-gray-100">
        
        {/* Header - Sabit */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 sm:p-8 text-white text-center relative shrink-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="flex justify-between items-center relative z-10 mb-4">
                <div className="bg-white/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 backdrop-blur-sm">
                    {data.category}
                </div>
                {!isSubmitted && (
                    <div className={`flex items-center gap-2 font-mono text-xl font-black px-4 py-1 rounded-2xl border-2 transition-colors ${timeLeft < 5 ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-white/10 border-white/20'}`}>
                        <Timer size={20} /> {timeLeft}s
                    </div>
                )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md relative z-10">
                Soru Zamanı!
            </h2>
        </div>

        {/* Content - Kaydırılabilir Alan (FLEX-1 ve PB-24 eklendi) */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-slate-50/30 scroll-smooth">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 relative">
              <HelpCircle className="absolute -top-3 -left-3 text-indigo-500 bg-white rounded-full w-10 h-10 p-1 shadow-md border-4 border-slate-50" />
              <p className="text-xl sm:text-2xl text-gray-800 font-bold leading-relaxed">
                {data.questionText}
              </p>
          </div>

          {/* Şıklar Listesi - pb-24 ile çok geniş bir alt pay eklendi */}
          <div className="space-y-1 pb-24">
            {data.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={getOptionStyle(idx)}
                disabled={isSubmitted}
              >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-xl transition-all ${
                        isSubmitted && idx === data.correctAnswerIndex ? 'bg-green-500 border-green-600 text-white rotate-12' : 
                        isSubmitted && selectedOption === idx ? 'bg-red-500 border-red-600 text-white' :
                        selectedOption === idx ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}>
                        {['A', 'B', 'C', 'D'][idx]}
                    </div>
                    <span className="font-bold leading-snug">{option}</span>
                </div>
                {isSubmitted && idx === data.correctAnswerIndex && (
                  <CheckCircle className="w-8 h-8 text-green-600 shrink-0 drop-shadow-sm" />
                )}
                {isSubmitted && selectedOption === idx && idx !== data.correctAnswerIndex && (
                  <XCircle className="w-8 h-8 text-red-600 shrink-0 drop-shadow-sm" />
                )}
              </button>
            ))}

            {isSubmitted && (
              <div className={`mt-4 p-6 rounded-3xl animate-slide-up border-2 ${selectedOption === data.correctAnswerIndex ? 'bg-green-50 border-green-100 shadow-green-100' : 'bg-orange-50 border-orange-100 shadow-orange-100'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded-2xl shadow-sm">
                      {selectedOption === data.correctAnswerIndex ? <Sparkles className="text-green-600 w-8 h-8" /> : <Award className="text-orange-600 w-8 h-8"/>}
                  </div>
                  <div>
                      <h4 className={`font-black text-lg mb-1 ${selectedOption === data.correctAnswerIndex ? 'text-green-800' : 'text-orange-800'}`}>
                          {selectedOption === data.correctAnswerIndex ? 'HARİKASIN!' : 'DOĞRU CEVAP ŞUYDU:'}
                      </h4>
                      <p className="text-gray-700 font-medium leading-relaxed">
                          {data.explanation}
                      </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Sabit Durur */}
        <div className="p-6 bg-white border-t border-gray-100 flex justify-end shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-20">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-12 py-5 rounded-2xl font-black text-2xl transition-all w-full shadow-lg transform active:scale-95 border-b-8 ${
                selectedOption !== null 
                  ? 'bg-indigo-600 border-indigo-800 text-white hover:brightness-110 shadow-indigo-100' 
                  : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed border-b-0'
              }`}
            >
              CEVAPLA!
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-5 rounded-2xl font-black text-2xl bg-green-500 border-green-700 border-b-8 text-white shadow-xl shadow-green-100 hover:brightness-110 flex items-center justify-center gap-3 w-full transform transition-all active:scale-95 active:border-b-0"
            >
              DEVAM ET <ArrowRight size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
