
import { QuestionData } from '../types';
import { GRADE_1_POOL } from './sinif1questionPool';
import { GRADE_2_POOL } from './sinif2questionPool';
import { GRADE_3_POOL } from './sinif3questionPool';
import { GRADE_4_POOL } from './sinif4questionPool';
import { ADULT_POOL } from './adultQuestionPool';

// ==========================================================================================
// ANA HAVUZ YÖNETİCİSİ
// Bu dosya artık sadece diğer dosyalardan gelen soruları birleştirir.
// Yeni soru eklemek için lütfen ilgili sınıfın dosyasına gidiniz:
// - data/sinif1questionPool.ts
// - data/sinif2questionPool.ts
// - data/sinif3questionPool.ts
// - data/sinif4questionPool.ts
// - data/adultQuestionPool.ts
// ==========================================================================================

export const QUESTION_POOL: Record<number, Record<string, QuestionData[]>> = {
  1: GRADE_1_POOL,
  2: GRADE_2_POOL,
  3: GRADE_3_POOL,
  4: GRADE_4_POOL,
  5: ADULT_POOL // Yetişkin
};
