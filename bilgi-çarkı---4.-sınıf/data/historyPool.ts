
import { G1_HISTORY_SETS } from './history/grade1';
import { G2_HISTORY_SETS } from './history/grade2';
import { G3_HISTORY_SETS } from './history/grade3';
import { G4_HISTORY_SETS } from './history/grade4';

export interface HistoryEventItem {
  text: string;
  emoji: string;
  order: number;
}

export interface HistorySet {
  id: string;
  title: string;
  events: HistoryEventItem[];
}

export const HISTORY_SETS: Record<number, HistorySet[]> = {
  1: G1_HISTORY_SETS,
  2: G2_HISTORY_SETS,
  3: G3_HISTORY_SETS,
  4: G4_HISTORY_SETS
};
