
import { ScrabbleData } from '../types';
import { G1_SCRABBLE } from './scrabble/grade1';
import { G2_SCRABBLE } from './scrabble/grade2';
import { G3_SCRABBLE } from './scrabble/grade3';
import { G4_SCRABBLE } from './scrabble/grade4';

export const SCRABBLE_POOL: Record<number, ScrabbleData[]> = {
  1: G1_SCRABBLE,
  2: G2_SCRABBLE,
  3: G3_SCRABBLE,
  4: G4_SCRABBLE
};
