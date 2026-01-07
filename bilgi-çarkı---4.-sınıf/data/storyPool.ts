
import { GRADE_1_STORIES } from './stories/grade1';
import { GRADE_2_STORIES } from './stories/grade2';
import { GRADE_3_STORIES } from './stories/grade3';
import { GRADE_4_STORIES } from './stories/grade4';

// 6 Ana Tür x 12 Alt Kategori Yapısı
export const STORY_CATEGORIES = {
  'Macera': [
    'Kayıp Hazine', 'Issız Ada', 'Orman Gezisi', 'Gizli Geçit', 
    'Dağ Tırmanışı', 'Fırtına', 'Çöl Yolculuğu', 'Yanardağ', 
    'Kutup Macerası', 'Korsan Gemisi', 'Yeraltı Şehri', 'Eski Tapınak'
  ],
  'Bilim Kurgu': [
    'Uzaylı Dostum', 'Zaman Makinesi', 'Akıllı Robot', 'Uçan Şehir', 
    'Mars Gezisi', 'Işınlanma', 'Görünmezlik', 'Akıllı Ev', 
    'Uzay İstasyonu', 'Gelecekten Mesaj', 'Sanal Oyun', 'Roket Yapımı'
  ],
  'Fantastik / Masal': [
    'Ejderha', 'Uçan Halı', 'Sihirli Değnek', 'Periler', 
    'Konuşan Ağaç', 'Devler Ülkesi', 'Sihirli Ayna', 'İksir', 
    'Tek Boynuzlu At', 'Prenses ve Prens', 'Sihirli Fasulye', 'Anka Kuşu'
  ],
  'Gizem / Dedektif': [
    'Kaybolan Elmas', 'Müze Sırrı', 'Ayak İzleri', 'Kilitli Oda', 
    'Eski Mektup', 'Gece Tıkırtısı', 'Şifreli Mesaj', 'Terk Edilmiş Ev', 
    'Okul Hayaleti', 'Maskeli Kişi', 'Kayıp Anahtar', 'Tablo Sırrı'
  ],
  'Komedi / Eğlence': [
    'Sakar Dedektif', 'Konuşan Kedi', 'Uçan Pasta', 'Ters Giyinen Adam', 
    'Pijama Partisi', 'Dans Eden İnek', 'Sihirbaz Tavşanı', 'Süper Kahraman', 
    'Çılgın Profesör', 'Horlayan Ejderha', 'Makarna Canavarı', 'Bıyıklı Bebek'
  ],
  'Doğa / Hayvanlar': [
    'Kutup Ayısı', 'Yaralı Kartal', 'Karınca Yuvası', 'Büyük Göç', 
    'Okyanus', 'Vahşi Atlar', 'Amazon Ormanı', 'Kelebek Etkisi', 
    'Yunuslar', 'Aslan Kral', 'Sevimli Panda', 'Çöl Devesi'
  ]
};

// Types
export interface StoryStructure {
    [genre: string]: {
        [topic: string]: string[];
    };
}

// [Sınıf Seviyesi] -> StoryStructure
export const STATIC_STORIES: Record<number, StoryStructure> = {
  1: GRADE_1_STORIES,
  2: GRADE_2_STORIES, 
  3: GRADE_3_STORIES,
  4: GRADE_4_STORIES
};
