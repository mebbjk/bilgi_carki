
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuestionData, BingoData, GradeLevel, StoryData } from "../types";
import { QUESTION_POOL } from "../data/questionPool";
import { STATIC_STORIES } from "../data/storyPool";
import { BINGO_POOLS } from "../data/bingoPool";
import { VOCAB_POOLS } from "../data/vocabPool";
import { HISTORY_SETS, HistorySet } from "../data/historyPool";
import { SENTENCE_POOLS } from "../data/sentencePool";
import { LITERACY_POOL, LiteracyItem } from "../data/literacyPool";

const cleanJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    return jsonMatch ? jsonMatch[0] : text;
  } catch (e) {
    return text;
  }
};

/**
 * Gemini TTS kullanarak yüksek kaliteli öğretmen sesi üretir
 */
export const generateHighQualitySpeech = async (text: string, taskType: 'phonetic' | 'feedback' | 'story' = 'feedback'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let instruction = "Sen sevgi dolu, neşeli ve enerjik bir ilkokul KADIN öğretmenisin. ";
  
  if (taskType === 'phonetic') {
    instruction += `Kullanıcının yazdığı "${text}" harfinin sesini fonetik olarak, bir çocuk öğretmeni gibi "Lllll" veya "Aaaaaa" şeklinde uzatarak ve neşeyle çıkar. Sadece sesi çıkar, harfin ismini söyleme.`;
  } else if (taskType === 'feedback') {
    instruction += "Çocuğun başarısını kutlayan, onu motive eden, çok nazik ve tatlı bir ses tonu kullan.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Kore: Nazik ve tınısı yüksek kadın sesi
        },
        systemInstruction: instruction
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  } catch (e) { 
    return ""; 
  }
};

export const analyzeHandwriting = async (imageB64: string, targetChar: string): Promise<{feedback: string, audio: string}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Multimodal istek yapısı düzeltildi: contents dizisi yerine tekil Content objesi veya doğru dizi formatı
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageB64, mimeType: 'image/png' } },
          { text: `Görseldeki el yazısını analiz et. Hedeflenen harf veya kelime: "${targetChar}". Bir ilkokul öğretmeni gibi davran. Çizgilerin doğruluğunu ve formu değerlendir. Çocuğa çok tatlı, kısa (maks 2 cümle) ve motive edici bir geri bildirim yaz. Sadece pozitif ve teşvik edici ol.` }
        ]
      },
      config: {
        maxOutputTokens: 150,
        temperature: 0.7
      }
    });
    
    const feedbackText = response.text || "Harika bir çalışma! Ellerine sağlık.";
    // TTS servisi hata verirse feedback metni yine de dönsün
    let audioData = "";
    try {
        audioData = await generateHighQualitySpeech(feedbackText, 'feedback');
    } catch (ttsErr) {
        console.warn("TTS Error:", ttsErr);
    }
    
    return { feedback: feedbackText, audio: audioData };
  } catch (e) {
    console.error("Gemini Analysis Error:", e);
    return { feedback: "Muhteşem bir çizim! Devam et şampiyon!", audio: "" };
  }
};

export const generateQuestion = async (category: string, history: string[] = [], gradeLevel: number = 4): Promise<QuestionData> => {
  const pool = QUESTION_POOL[gradeLevel]?.[category] || [];
  const available = pool.filter(q => !history.includes(q.questionText));
  if (available.length > 0) return available[Math.floor(Math.random() * available.length)];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${gradeLevel}. sınıf "${category}" konusu için daha önce sorulmamış, eğlenceli ve düşündürücü bir soru üret. Soru 4 seçenekli olsun.`,
    config: { 
      systemInstruction: "Sen çocukların dilinden anlayan, onlara dersi sevdiren bir öğretmen karakterisin. Soruların hem eğitici hem de eğlenceli (hikayeleştirilmiş) olmalı. Açıklama kısmında çocuğa bir ipucu veya minik bir bilgi ver.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          questionText: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ["category", "questionText", "options", "correctAnswerIndex", "explanation"]
      }
    }
  });
  return JSON.parse(cleanJSON(response.text || "{}"));
};

export const generateExamQuestions = async (selectedTopics: {subject: string, topic: string}[], count: number, history: string[], gradeLevel: number): Promise<QuestionData[]> => {
  let resultQuestions: QuestionData[] = [];
  const poolQuestions: QuestionData[] = [];
  const selectedSubjects = Array.from(new Set(selectedTopics.map(t => t.subject)));
  selectedSubjects.forEach(subjectName => {
      const subjectPool = QUESTION_POOL[gradeLevel]?.[subjectName] || [];
      const unused = subjectPool.filter(q => !history.includes(q.questionText));
      poolQuestions.push(...unused);
  });
  const shuffledPool = poolQuestions.sort(() => Math.random() - 0.5);
  resultQuestions = shuffledPool.slice(0, count);

  const remainingCount = count - resultQuestions.length;
  if (remainingCount > 0) {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `${gradeLevel}. sınıf şu konulardan: ${JSON.stringify(selectedTopics)} karma ${remainingCount} soru üret. JSON formatında olsun.`,
            config: { 
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["category", "topic", "questionText", "options", "correctAnswerIndex", "explanation"]
                }
              }
            }
          });
          const aiQuestions = JSON.parse(cleanJSON(response.text || "[]"));
          resultQuestions = [...resultQuestions, ...aiQuestions];
      } catch (err: any) {
          if (resultQuestions.length < count && poolQuestions.length > 0) {
              const fillers = poolQuestions.sort(() => Math.random() - 0.5).slice(0, count - resultQuestions.length);
              resultQuestions = [...resultQuestions, ...fillers];
          }
      }
  }
  return resultQuestions.slice(0, count);
};

export const generateLiteracyWord = async (history: string[]): Promise<LiteracyItem> => {
    const available = LITERACY_POOL.filter(item => !history.includes(item.text));
    if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
    return LITERACY_POOL[Math.floor(Math.random() * LITERACY_POOL.length)];
};

export const generateHistoryEvents = async (gradeLevel: number): Promise<HistorySet[]> => {
    const pool = HISTORY_SETS[gradeLevel] || HISTORY_SETS[4];
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 4);
};

export const generateStoryStarter = async (genre: string, subCategory: string, gradeLevel: number): Promise<StoryData> => {
  const gradeStories = STATIC_STORIES[gradeLevel] || STATIC_STORIES[4];
  const pool = gradeStories[genre]?.[subCategory];
  if (pool && pool.length > 0) return { genre: `${genre} - ${subCategory}`, starterText: pool[Math.floor(Math.random() * pool.length)] };
  return { genre: `${genre} - ${subCategory}`, starterText: "Bir zamanlar uzaklarda çok meraklı bir kahraman yaşarmış..." };
};

export const generateBingoItem = async (history: string[], gradeLevel: number): Promise<BingoData> => {
  const pool = BINGO_POOLS[gradeLevel] || BINGO_POOLS[4];
  const unused = pool.filter(item => !history.includes(item[1]));
  if (unused.length > 0) {
      const selected = unused[Math.floor(Math.random() * unused.length)];
      return { type: selected[0], word: selected[1], exampleSentence: selected[2], minGrade: gradeLevel };
  }
  return { type: "Genel", word: "Kitap", exampleSentence: "Kitap okumak hayal gücünü artırır.", minGrade: gradeLevel };
};

export const generateMatchingPairs = async (gradeLevel: number, count: number): Promise<any[]> => {
    const pool = VOCAB_POOLS[gradeLevel] || VOCAB_POOLS[4];
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
};

export const generateSentenceChallenge = async (gradeLevel: number, lang: string): Promise<{text: string, translation: string}> => {
    const gradePool = SENTENCE_POOLS[gradeLevel] || SENTENCE_POOLS[4];
    const pool = (gradePool as any)[lang] || [];
    return pool[Math.floor(Math.random() * pool.length)];
};

export const getTotalBingoCount = (gradeLevel: number) => (BINGO_POOLS[gradeLevel] || BINGO_POOLS[4]).length;
