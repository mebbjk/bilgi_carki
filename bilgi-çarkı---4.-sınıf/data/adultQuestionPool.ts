
import { QuestionData } from '../types';
import { ADULT_GENERAL_CULTURE_DATA } from './adultGeneralCulture';
import { ADULT_HISTORY_DATA } from './adultHistory';
import { ADULT_GEOGRAPHY_DATA } from './adultGeography';
import { ADULT_SCIENCE_DATA } from './adultScience';
import { ADULT_LITERATURE_DATA } from './adultLiterature';
import { ADULT_CINEMA_DATA } from './adultCinemaTV';
import { ADULT_SPORTS_DATA } from './adultSports';
import { ADULT_MUSIC_DATA } from './adultMusic';

type CompactQuestion = [string, string[], number, string];

const createQuestions = (category: string, data: CompactQuestion[]): QuestionData[] => {
  return data.map(item => ({
    category,
    questionText: item[0],
    options: item[1],
    correctAnswerIndex: item[2],
    explanation: item[3]
  }));
};

export const ADULT_POOL = {
  'Genel Kültür': createQuestions('Genel Kültür', ADULT_GENERAL_CULTURE_DATA),
  'Tarih': createQuestions('Tarih', ADULT_HISTORY_DATA),
  'Coğrafya': createQuestions('Coğrafya', ADULT_GEOGRAPHY_DATA),
  'Bilim & Teknoloji': createQuestions('Bilim & Teknoloji', ADULT_SCIENCE_DATA),
  'Edebiyat & Sanat': createQuestions('Edebiyat & Sanat', ADULT_LITERATURE_DATA),
  'Sinema & TV': createQuestions('Sinema & TV', ADULT_CINEMA_DATA),
  'Spor': createQuestions('Spor', ADULT_SPORTS_DATA),
  'Müzik': createQuestions('Müzik', ADULT_MUSIC_DATA),
};
