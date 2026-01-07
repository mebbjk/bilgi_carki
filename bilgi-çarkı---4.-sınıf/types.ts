
export enum Subject {
  MATH = 'Matematik',
  TURKISH = 'Türkçe',
  SCIENCE = 'Fen Bilimleri',
  SOCIAL = 'Sosyal Bilgiler',
  ENGLISH = 'İngilizce',
  RELIGION = 'Din Kültürü',
  LIFE = 'Hayat Bilgisi',
  GENERAL = 'Genel Kültür'
}

export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export const CURRICULUM_TOPICS: Record<number, Record<string, string[]>> = {
  1: {
    'Matematik': ['Rakamlar', 'Toplama', 'Çıkarma'],
    'Türkçe': ['Harf Bilgisi', 'Okuma Anlama'],
    'Hayat Bilgisi': ['Okulumuz', 'Sağlığımız'],
    'İngilizce': ['Colors', 'Numbers']
  },
  2: {
    'Matematik': ['Çarpma', 'Bölme', 'Kesirler'],
    'Türkçe': ['Yazım Kuralları', 'Eş Anlam'],
    'Hayat Bilgisi': ['Ulaşım', 'Milli Bayramlar'],
    'İngilizce': ['Animals', 'Rooms']
  },
  3: {
    'Matematik': ['3 Basamaklı Sayılar', 'Geometri'],
    'Türkçe': ['Atasözleri', 'Paragraf'],
    'Fen Bilimleri': ['Gezegenimiz', 'Madde'],
    'İngilizce': ['Family', 'Weather']
  },
  4: {
    'Matematik': ['Ondalık Gösterim', 'Alan'],
    'Türkçe': ['Gerçek-Mecaz', 'Noktalama'],
    'Fen Bilimleri': ['Fosiller', 'Mıknatıs'],
    'Sosyal Bilgiler': ['Milli Mücadele', 'Teknoloji'],
    'İngilizce': ['Jobs', 'Countries']
  },
  5: {
    'Genel Kültür': ['Tarih', 'Coğrafya', 'Bilim', 'Sanat', 'Spor', 'Sinema']
  }
};

export interface QuestionData {
  category: string;
  topic?: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StoryData {
  genre: string;
  starterText: string;
}

export interface BingoData {
  word: string;
  exampleSentence: string;
  type: string;
  minGrade: number; 
}

export interface TabooCard {
  word: string;
  forbidden: string[];
}

export interface WordPairData {
  word: string;
  pair: string;
  type: 'synonym' | 'antonym';
}

export interface ScrabbleData {
  word: string;
  hint: string;
  subWords?: string[];
}

export interface SubjectStats {
  correct: number;
  total: number;
}

export interface TopicStats {
  correct: number;
  total: number;
}

export interface UserProfile {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  score: number;
  streak: number;
  stats: Record<string, SubjectStats>; 
  topicStats: Record<string, TopicStats>;
  scoreBreakdown: {
    quiz: number;
    exam: number;
    games: number;
  };
  gameSubjectStats: Record<string, number>;
  gamePlayCounts: Record<string, number>;
  questionHistory: string[];
  bingoHistory: string[];
  matchingGameHistory: string[]; 
  historyGameHistory: string[];
  sentenceGameHistory: string[];
  sortingGameHistory: string[];
  hangmanGameHistory: string[];
  literacyHistory: string[];
  customItems: string[];
  lastActive: number;
}

export interface SiteStats {
  totalVisits: number;
  totalGamesPlayed: number;
  gameCounts: Record<string, number>;
}

export interface GameState {
  score: number;
  streak: number;
  userName: string | null;
  gradeLevel: GradeLevel; 
  stats: Record<string, SubjectStats>;
}

export interface WheelSegment {
  label: string;
  color: string;
  textColor: string;
}

export type AppMode = 'home' | 'lesson_menu' | 'quiz' | 'custom' | 'story' | 'test' | 'bingo' | 'multiplication' | 'history' | 'match' | 'game_menu' | 'sentence' | 'sorting' | 'hangman' | 'taboo' | 'word_pairs' | 'scrabble' | 'literacy' | 'turkey_map' | 'lessons' | 'games' | 'lesson_selection';

export interface TestConfig {
  selectedTopics: { subject: string, topic: string }[];
  questionCount: number;
  durationMinutes: number;
  timerDirection: 'up' | 'down';
  gradeLevel: number;
}
