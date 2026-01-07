
import { G1_SENTENCES } from './sinif1sentences';
import { G2_SENTENCES } from './sinif2sentences';
import { G3_SENTENCES } from './sinif3sentences';
import { G4_SENTENCES } from './sinif4sentences';

export interface SentenceItem {
  text: string;
  translation: string;
}

export interface SentencePoolData {
  tr: SentenceItem[];
  en: SentenceItem[];
}

export const SENTENCE_POOLS: Record<number, SentencePoolData> = {
  1: G1_SENTENCES,
  2: G2_SENTENCES,
  3: G3_SENTENCES,
  4: G4_SENTENCES
};
