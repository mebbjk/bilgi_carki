
import { GRADE_1_BINGO } from './sinif1bingo';
import { GRADE_2_BINGO } from './sinif2bingo';
import { GRADE_3_BINGO } from './sinif3bingo';
import { GRADE_4_BINGO } from './sinif4bingo';

// Tombala Verisi Formatı: [Kategori, Kelime, Örnek Cümle]
export const BINGO_POOLS: Record<number, [string, string, string][]> = {
  1: GRADE_1_BINGO,
  2: GRADE_2_BINGO,
  3: GRADE_3_BINGO,
  4: GRADE_4_BINGO
};
