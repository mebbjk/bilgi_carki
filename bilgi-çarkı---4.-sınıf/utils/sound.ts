
let audioCtx: AudioContext | null = null;
let isLooping = false;
let currentLoopText = "";

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAlphaContext)({ sampleRate: 24000 });
  }
  return audioCtx;
};

const LETTER_EXAMPLES: Record<string, string> = {
    'A': 'Arı', 'B': 'Bebek', 'C': 'Civciv', 'Ç': 'Çiçek', 'D': 'Dede',
    'E': 'Elma', 'F': 'Fil', 'G': 'Göz', 'Ğ': 'Dağ', 'H': 'Havuç',
    'I': 'Irmak', 'İ': 'İncir', 'J': 'Jilet', 'K': 'Kalem', 'L': 'Limon',
    'M': 'Masa', 'N': 'Nane', 'O': 'Oyuncak', 'Ö': 'Ördek', 'P': 'Para',
    'R': 'Radyo', 'S': 'Saat', 'Ş': 'Şapka', 'T': 'Top', 'U': 'Uçak',
    'Ü': 'Üzüm', 'V': 'Valiz', 'Y': 'Yıldız', 'Z': 'Zil'
};

// Videodaki "seee seeee" efektini simüle etmek için daha kısa ve ritmik tekrarlar
const getExtendedPhonetic = (char: string): string => {
  const c = char.toLowerCase();
  // Sessiz harfler için ritmik bir uzatma: "s - s - sssssss"
  if ("bcçdfgğhjklmnprsştvyz".includes(c)) {
      return `${c} ${c} ${c.repeat(10)}`;
  }
  // Sesli harfler için düz uzatma: "aaaaaaa"
  return c.repeat(15);
};

export const SoundEffects = {
  resumeContext: async () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  },

  waitForVoices: (): Promise<void> => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }
      window.speechSynthesis.onvoiceschanged = () => resolve();
      setTimeout(resolve, 3000);
    });
  },

  getFemaleVoice: () => {
    const voices = window.speechSynthesis.getVoices();
    const femaleKeywords = ['female', 'seda', 'zeynep', 'dilara', 'nursel', 'yelda', 'emine', 'gül', 'soft', 'google türkçe', 'microsoft emel'];
    let voice = voices.find(v => v.lang.includes('tr') && femaleKeywords.some(key => v.name.toLowerCase().includes(key)));
    if (!voice) voice = voices.find(v => v.lang.includes('tr') && v.name.includes('Google'));
    if (!voice) voice = voices.find(v => v.lang.includes('tr'));
    return voice;
  },

  speakLetterWithExample: (letter: string) => {
      const upper = letter.toUpperCase();
      const example = LETTER_EXAMPLES[upper];
      const text = example ? `${upper}, ${example}` : upper;
      SoundEffects.speak(text, 0.9);
  },

  speak: (text: string, rate: number = 1.1, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = SoundEffects.getFemaleVoice();
    if (voice) utterance.voice = voice;

    utterance.lang = 'tr-TR';
    utterance.rate = rate;
    utterance.pitch = 1.6; 
    
    if (onEndCallback) utterance.onend = onEndCallback;
    window.speechSynthesis.speak(utterance);
  },

  startSpeechLoop: (text: string) => {
    if (isLooping && currentLoopText === text) return;
    isLooping = true;
    currentLoopText = text;

    const speakNext = () => {
      if (!isLooping) return;

      let longText = text;
      if (text.length === 1) {
          longText = getExtendedPhonetic(text);
      } else {
          longText = `${text} ${text} ${text}`;
      }

      const utterance = new SpeechSynthesisUtterance(longText);
      const voice = SoundEffects.getFemaleVoice();
      if (voice) utterance.voice = voice;
      
      utterance.lang = 'tr-TR';
      utterance.rate = text.length === 1 ? 0.6 : 1.1; 
      utterance.pitch = 1.8;
      
      utterance.onend = () => {
        if (isLooping) {
            setTimeout(speakNext, 50);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    window.speechSynthesis.cancel();
    speakNext();
  },

  stopSpeechLoop: () => {
    isLooping = false;
    currentLoopText = "";
    window.speechSynthesis.cancel();
  },

  playSpinTick: () => {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.04);
  },

  playQuestionAppear: () => {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  },

  playCorrect: () => {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  },

  playWrong: () => {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  }
};
