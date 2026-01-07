
export interface VocabularyItem {
  id: string;
  term: string; // English
  translation: string; // Turkish
  emoji: string; // Emoji representing the word
}

// ============================================================================
// 1. SINIF HAVUZU (Renkler, Sayılar, Okul, Vücut, Hayvanlar, Meyveler)
// ============================================================================
export const G1_VOCAB: VocabularyItem[] = [
  // Numbers
  { id: 'g1-1', term: 'One', translation: 'Bir', emoji: '1️⃣' },
  { id: 'g1-2', term: 'Two', translation: 'İki', emoji: '2️⃣' },
  { id: 'g1-3', term: 'Three', translation: 'Üç', emoji: '3️⃣' },
  { id: 'g1-4', term: 'Four', translation: 'Dört', emoji: '4️⃣' },
  { id: 'g1-5', term: 'Five', translation: 'Beş', emoji: '5️⃣' },
  { id: 'g1-6', term: 'Six', translation: 'Altı', emoji: '6️⃣' },
  { id: 'g1-7', term: 'Seven', translation: 'Yedi', emoji: '7️⃣' },
  { id: 'g1-8', term: 'Eight', translation: 'Sekiz', emoji: '8️⃣' },
  { id: 'g1-9', term: 'Nine', translation: 'Dokuz', emoji: '9️⃣' },
  { id: 'g1-10', term: 'Ten', translation: 'On', emoji: '🔟' },

  // Colors
  { id: 'g1-11', term: 'Red', translation: 'Kırmızı', emoji: '🔴' },
  { id: 'g1-12', term: 'Blue', translation: 'Mavi', emoji: '🔵' },
  { id: 'g1-13', term: 'Yellow', translation: 'Sarı', emoji: '🟡' },
  { id: 'g1-14', term: 'Green', translation: 'Yeşil', emoji: '🟢' },
  { id: 'g1-15', term: 'Orange', translation: 'Turuncu', emoji: '🟠' },
  { id: 'g1-16', term: 'Purple', translation: 'Mor', emoji: '🟣' },
  { id: 'g1-17', term: 'Black', translation: 'Siyah', emoji: '⚫' },
  { id: 'g1-18', term: 'White', translation: 'Beyaz', emoji: '⚪' },
  { id: 'g1-19', term: 'Pink', translation: 'Pembe', emoji: '🩷' },
  { id: 'g1-20', term: 'Brown', translation: 'Kahverengi', emoji: '🟤' },

  // School
  { id: 'g1-21', term: 'Book', translation: 'Kitap', emoji: '📕' },
  { id: 'g1-22', term: 'Pencil', translation: 'Kurşun Kalem', emoji: '✏️' },
  { id: 'g1-23', term: 'Pen', translation: 'Tükenmez Kalem', emoji: '🖊️' },
  { id: 'g1-24', term: 'Eraser', translation: 'Silgi', emoji: '🧽' },
  { id: 'g1-25', term: 'Bag', translation: 'Çanta', emoji: '🎒' },
  { id: 'g1-26', term: 'School', translation: 'Okul', emoji: '🏫' },
  { id: 'g1-27', term: 'Teacher', translation: 'Öğretmen', emoji: '👩‍🏫' },
  { id: 'g1-28', term: 'Student', translation: 'Öğrenci', emoji: '👨‍🎓' },
  { id: 'g1-29', term: 'Ruler', translation: 'Cetvel', emoji: '📏' },
  { id: 'g1-30', term: 'Desk', translation: 'Sıra/Masa', emoji: '🪑' },
  { id: 'g1-31', term: 'Scissors', translation: 'Makas', emoji: '✂️' },
  { id: 'g1-32', term: 'Notebook', translation: 'Defter', emoji: '📓' },
  { id: 'g1-33', term: 'Crayon', translation: 'Boya Kalemi', emoji: '🖍️' },
  { id: 'g1-34', term: 'Board', translation: 'Tahta', emoji: '🟩' },

  // Animals
  { id: 'g1-40', term: 'Cat', translation: 'Kedi', emoji: '🐱' },
  { id: 'g1-41', term: 'Dog', translation: 'Köpek', emoji: '🐶' },
  { id: 'g1-42', term: 'Bird', translation: 'Kuş', emoji: '🐦' },
  { id: 'g1-43', term: 'Fish', translation: 'Balık', emoji: '🐟' },
  { id: 'g1-44', term: 'Lion', translation: 'Aslan', emoji: '🦁' },
  { id: 'g1-45', term: 'Monkey', translation: 'Maymun', emoji: '🐵' },
  { id: 'g1-46', term: 'Duck', translation: 'Ördek', emoji: '🦆' },
  { id: 'g1-47', term: 'Bee', translation: 'Arı', emoji: '🐝' },
  { id: 'g1-48', term: 'Butterfly', translation: 'Kelebek', emoji: '🦋' },
  { id: 'g1-49', term: 'Rabbit', translation: 'Tavşan', emoji: '🐰' },
  { id: 'g1-50', term: 'Chicken', translation: 'Tavuk', emoji: '🐔' },
  { id: 'g1-51', term: 'Cow', translation: 'İnek', emoji: '🐮' },
  { id: 'g1-52', term: 'Sheep', translation: 'Koyun', emoji: '🐑' },
  { id: 'g1-53', term: 'Horse', translation: 'At', emoji: '🐴' },
  { id: 'g1-54', term: 'Elephant', translation: 'Fil', emoji: '🐘' },
  { id: 'g1-55', term: 'Snake', translation: 'Yılan', emoji: '🐍' },
  { id: 'g1-56', term: 'Turtle', translation: 'Kaplumbağa', emoji: '🐢' },
  { id: 'g1-57', term: 'Mouse', translation: 'Fare', emoji: '🐭' },
  { id: 'g1-58', term: 'Bear', translation: 'Ayı', emoji: '🐻' },
  { id: 'g1-59', term: 'Frog', translation: 'Kurbağa', emoji: '🐸' },

  // Fruits
  { id: 'g1-60', term: 'Apple', translation: 'Elma', emoji: '🍎' },
  { id: 'g1-61', term: 'Banana', translation: 'Muz', emoji: '🍌' },
  { id: 'g1-62', term: 'Orange', translation: 'Portakal', emoji: '🍊' },
  { id: 'g1-63', term: 'Lemon', translation: 'Limon', emoji: '🍋' },
  { id: 'g1-64', term: 'Strawberry', translation: 'Çilek', emoji: '🍓' },
  { id: 'g1-65', term: 'Grapes', translation: 'Üzüm', emoji: '🍇' },
  { id: 'g1-66', term: 'Watermelon', translation: 'Karpuz', emoji: '🍉' },
  { id: 'g1-67', term: 'Cherry', translation: 'Kiraz', emoji: '🍒' },
  { id: 'g1-68', term: 'Pear', translation: 'Armut', emoji: '🍐' },
  { id: 'g1-69', term: 'Peach', translation: 'Şeftali', emoji: '🍑' },

  // Body Parts
  { id: 'g1-70', term: 'Eye', translation: 'Göz', emoji: '👁️' },
  { id: 'g1-71', term: 'Ear', translation: 'Kulak', emoji: '👂' },
  { id: 'g1-72', term: 'Nose', translation: 'Burun', emoji: '👃' },
  { id: 'g1-73', term: 'Mouth', translation: 'Ağız', emoji: '👄' },
  { id: 'g1-74', term: 'Hand', translation: 'El', emoji: '✋' },
  { id: 'g1-75', term: 'Foot', translation: 'Ayak', emoji: '🦶' },
  { id: 'g1-76', term: 'Leg', translation: 'Bacak', emoji: '🦵' },
  { id: 'g1-77', term: 'Arm', translation: 'Kol', emoji: '💪' },
  { id: 'g1-78', term: 'Finger', translation: 'Parmak', emoji: '👆' },
  { id: 'g1-79', term: 'Head', translation: 'Kafa/Baş', emoji: '🙂' },
];

// ============================================================================
// 2. SINIF HAVUZU (Sayilar 11-20, Hayvanlar, Meyveler, Vücut, Eşyalar, Fiiller)
// ============================================================================
export const G2_VOCAB: VocabularyItem[] = [
  ...G1_VOCAB.slice(0, 20), // Reuse numbers & colors
  
  // New Numbers
  { id: 'g2-11', term: 'Eleven', translation: 'On bir', emoji: '1️⃣1️⃣' },
  { id: 'g2-12', term: 'Twelve', translation: 'On iki', emoji: '1️⃣2️⃣' },
  { id: 'g2-13', term: 'Twenty', translation: 'Yirmi', emoji: '2️⃣0️⃣' },
  
  // Transport
  { id: 'g2-20', term: 'Car', translation: 'Araba', emoji: '🚗' },
  { id: 'g2-21', term: 'Bus', translation: 'Otobüs', emoji: '🚌' },
  { id: 'g2-22', term: 'Bike', translation: 'Bisiklet', emoji: '🚲' },
  { id: 'g2-23', term: 'Train', translation: 'Tren', emoji: '🚂' },
  { id: 'g2-24', term: 'Plane', translation: 'Uçak', emoji: '✈️' },
  { id: 'g2-25', term: 'Ship', translation: 'Gemi', emoji: '🚢' },
  { id: 'g2-26', term: 'Taxi', translation: 'Taksi', emoji: '🚕' },
  { id: 'g2-27', term: 'Truck', translation: 'Kamyon', emoji: '🚚' },
  { id: 'g2-28', term: 'Motorbike', translation: 'Motosiklet', emoji: '🏍️' },
  { id: 'g2-29', term: 'Helicopter', translation: 'Helikopter', emoji: '🚁' },

  // Rooms & House
  { id: 'g2-30', term: 'House', translation: 'Ev', emoji: '🏠' },
  { id: 'g2-31', term: 'Room', translation: 'Oda', emoji: '🚪' },
  { id: 'g2-32', term: 'Kitchen', translation: 'Mutfak', emoji: '🍳' },
  { id: 'g2-33', term: 'Bedroom', translation: 'Yatak Odası', emoji: '🛏️' },
  { id: 'g2-34', term: 'Bathroom', translation: 'Banyo', emoji: '🛁' },
  { id: 'g2-35', term: 'Living Room', translation: 'Oturma Odası', emoji: '🛋️' },
  { id: 'g2-36', term: 'Garden', translation: 'Bahçe', emoji: '🏡' },
  { id: 'g2-37', term: 'Window', translation: 'Pencere', emoji: '🪟' },
  { id: 'g2-38', term: 'Door', translation: 'Kapı', emoji: '🚪' },
  { id: 'g2-39', term: 'Lamp', translation: 'Lamba', emoji: '💡' },

  // Verbs (Actions)
  { id: 'g2-40', term: 'Run', translation: 'Koşmak', emoji: '🏃' },
  { id: 'g2-41', term: 'Jump', translation: 'Zıplamak', emoji: '🦘' },
  { id: 'g2-42', term: 'Walk', translation: 'Yürümek', emoji: '🚶' },
  { id: 'g2-43', term: 'Swim', translation: 'Yüzmek', emoji: '🏊' },
  { id: 'g2-44', term: 'Sleep', translation: 'Uyumak', emoji: '😴' },
  { id: 'g2-45', term: 'Eat', translation: 'Yemek', emoji: '🍽️' },
  { id: 'g2-46', term: 'Drink', translation: 'İçmek', emoji: '🥤' },
  { id: 'g2-47', term: 'Read', translation: 'Okumak', emoji: '📖' },
  { id: 'g2-48', term: 'Write', translation: 'Yazmak', emoji: '✍️' },
  { id: 'g2-49', term: 'Play', translation: 'Oynamak', emoji: '🎮' },
  { id: 'g2-50', term: 'Sing', translation: 'Şarkı Söylemek', emoji: '🎤' },
  { id: 'g2-51', term: 'Dance', translation: 'Dans Etmek', emoji: '💃' },
  { id: 'g2-52', term: 'Fly', translation: 'Uçmak', emoji: '🦅' },
  { id: 'g2-53', term: 'Cook', translation: 'Pişirmek', emoji: '👩‍🍳' },
  { id: 'g2-54', term: 'Wash', translation: 'Yıkamak', emoji: '🧼' },

  // More Animals
  { id: 'g2-60', term: 'Tiger', translation: 'Kaplan', emoji: '🐅' },
  { id: 'g2-61', term: 'Zebra', translation: 'Zebra', emoji: '🦓' },
  { id: 'g2-62', term: 'Giraffe', translation: 'Zürafa', emoji: '🦒' },
  { id: 'g2-63', term: 'Crocodile', translation: 'Timsah', emoji: '🐊' },
  { id: 'g2-64', term: 'Dolphin', translation: 'Yunus', emoji: '🐬' },
  { id: 'g2-65', term: 'Shark', translation: 'Köpekbalığı', emoji: '🦈' },
  { id: 'g2-66', term: 'Whale', translation: 'Balina', emoji: '🐳' },
  { id: 'g2-67', term: 'Spider', translation: 'Örümcek', emoji: '🕷️' },
  { id: 'g2-68', term: 'Ant', translation: 'Karınca', emoji: '🐜' },
  { id: 'g2-69', term: 'Snail', translation: 'Salyangoz', emoji: '🐌' },
  
  // Food & Drinks
  { id: 'g2-70', term: 'Milk', translation: 'Süt', emoji: '🥛' },
  { id: 'g2-71', term: 'Water', translation: 'Su', emoji: '💧' },
  { id: 'g2-72', term: 'Tea', translation: 'Çay', emoji: '☕' },
  { id: 'g2-73', term: 'Cake', translation: 'Kek/Pasta', emoji: '🍰' },
  { id: 'g2-74', term: 'Egg', translation: 'Yumurta', emoji: '🥚' },
  { id: 'g2-75', term: 'Bread', translation: 'Ekmek', emoji: '🍞' },
  { id: 'g2-76', term: 'Cheese', translation: 'Peynir', emoji: '🧀' },
  { id: 'g2-77', term: 'Ice Cream', translation: 'Dondurma', emoji: '🍦' },
  { id: 'g2-78', term: 'Pizza', translation: 'Pizza', emoji: '🍕' },
  { id: 'g2-79', term: 'Hamburger', translation: 'Hamburger', emoji: '🍔' },
];

// ============================================================================
// 3. SINIF HAVUZU (Aile, Şehir, Duygular, Hava, Kıyafet, Oyuncak)
// ============================================================================
export const G3_VOCAB: VocabularyItem[] = [
  // Family
  { id: 'g3-1', term: 'Family', translation: 'Aile', emoji: '👨‍👩‍👧‍👦' },
  { id: 'g3-2', term: 'Mother', translation: 'Anne', emoji: '👩' },
  { id: 'g3-3', term: 'Father', translation: 'Baba', emoji: '👨' },
  { id: 'g3-4', term: 'Sister', translation: 'Kız Kardeş', emoji: '👧' },
  { id: 'g3-5', term: 'Brother', translation: 'Erkek Kardeş', emoji: '👦' },
  { id: 'g3-6', term: 'Baby', translation: 'Bebek', emoji: '👶' },
  { id: 'g3-7', term: 'Grandmother', translation: 'Büyükanne', emoji: '👵' },
  { id: 'g3-8', term: 'Grandfather', translation: 'Büyükbaba', emoji: '👴' },
  { id: 'g3-9', term: 'Uncle', translation: 'Amca/Dayı', emoji: '🧔' },
  { id: 'g3-10', term: 'Aunt', translation: 'Hala/Teyze', emoji: '👩' },

  // Feelings
  { id: 'g3-11', term: 'Happy', translation: 'Mutlu', emoji: '😊' },
  { id: 'g3-12', term: 'Sad', translation: 'Üzgün', emoji: '😢' },
  { id: 'g3-13', term: 'Angry', translation: 'Kızgın', emoji: '😡' },
  { id: 'g3-14', term: 'Tired', translation: 'Yorgun', emoji: '😫' },
  { id: 'g3-15', term: 'Hungry', translation: 'Aç', emoji: '😋' },
  { id: 'g3-16', term: 'Thirsty', translation: 'Susamış', emoji: '🥵' },
  { id: 'g3-17', term: 'Surprised', translation: 'Şaşkın', emoji: '😲' },
  { id: 'g3-18', term: 'Scared', translation: 'Korkmuş', emoji: '😱' },
  { id: 'g3-19', term: 'Sleepy', translation: 'Uykulu', emoji: '😪' },
  { id: 'g3-20', term: 'Bored', translation: 'Sıkılmış', emoji: '😐' },

  // Weather
  { id: 'g3-21', term: 'Sunny', translation: 'Güneşli', emoji: '☀️' },
  { id: 'g3-22', term: 'Rainy', translation: 'Yağmurlu', emoji: '🌧️' },
  { id: 'g3-23', term: 'Cloudy', translation: 'Bulutlu', emoji: '☁️' },
  { id: 'g3-24', term: 'Snowy', translation: 'Karlı', emoji: '❄️' },
  { id: 'g3-25', term: 'Windy', translation: 'Rüzgarlı', emoji: '💨' },
  { id: 'g3-26', term: 'Hot', translation: 'Sıcak', emoji: '🥵' },
  { id: 'g3-27', term: 'Cold', translation: 'Soğuk', emoji: '🥶' },
  { id: 'g3-28', term: 'Storm', translation: 'Fırtına', emoji: '⛈️' },
  { id: 'g3-29', term: 'Rainbow', translation: 'Gökkuşağı', emoji: '🌈' },
  { id: 'g3-30', term: 'Lightning', translation: 'Şimşek', emoji: '⚡' },

  // Clothes
  { id: 'g3-31', term: 'T-shirt', translation: 'Tişört', emoji: '👕' },
  { id: 'g3-32', term: 'Dress', translation: 'Elbise', emoji: '👗' },
  { id: 'g3-33', term: 'Pants', translation: 'Pantolon', emoji: '👖' },
  { id: 'g3-34', term: 'Shoes', translation: 'Ayakkabı', emoji: '👟' },
  { id: 'g3-35', term: 'Hat', translation: 'Şapka', emoji: '🧢' },
  { id: 'g3-36', term: 'Socks', translation: 'Çorap', emoji: '🧦' },
  { id: 'g3-37', term: 'Jacket', translation: 'Ceket/Mont', emoji: '🧥' },
  { id: 'g3-38', term: 'Glasses', translation: 'Gözlük', emoji: '👓' },
  { id: 'g3-39', term: 'Skirt', translation: 'Etek', emoji: '👗' },
  { id: 'g3-40', term: 'Boots', translation: 'Bot', emoji: '👢' },

  // City & Places
  { id: 'g3-41', term: 'City', translation: 'Şehir', emoji: '🏙️' },
  { id: 'g3-42', term: 'Hospital', translation: 'Hastane', emoji: '🏥' },
  { id: 'g3-43', term: 'Police Station', translation: 'Karakol', emoji: '🚓' },
  { id: 'g3-44', term: 'Park', translation: 'Park', emoji: '🌳' },
  { id: 'g3-45', term: 'Zoo', translation: 'Hayvanat Bahçesi', emoji: '🦓' },
  { id: 'g3-46', term: 'Cinema', translation: 'Sinema', emoji: '🎬' },
  { id: 'g3-47', term: 'Market', translation: 'Market', emoji: '🛒' },
  { id: 'g3-48', term: 'Bank', translation: 'Banka', emoji: '🏦' },
  { id: 'g3-49', term: 'Mosque', translation: 'Cami', emoji: '🕌' },
  { id: 'g3-50', term: 'Restaurant', translation: 'Restoran', emoji: '🍽️' },

  // Toys
  { id: 'g3-51', term: 'Toy', translation: 'Oyuncak', emoji: '🧸' },
  { id: 'g3-52', term: 'Ball', translation: 'Top', emoji: '⚽' },
  { id: 'g3-53', term: 'Doll', translation: 'Bebek', emoji: '🎎' },
  { id: 'g3-54', term: 'Car', translation: 'Araba', emoji: '🏎️' },
  { id: 'g3-55', term: 'Kite', translation: 'Uçurtma', emoji: '🪁' },
  { id: 'g3-56', term: 'Balloon', translation: 'Balon', emoji: '🎈' },
  { id: 'g3-57', term: 'Bike', translation: 'Bisiklet', emoji: '🚲' },
  { id: 'g3-58', term: 'Teddy Bear', translation: 'Oyuncak Ayı', emoji: '🧸' },
  { id: 'g3-59', term: 'Robot', translation: 'Robot', emoji: '🤖' },
  { id: 'g3-60', term: 'Block', translation: 'Blok/Lego', emoji: '🧱' },
  
  // Nature
  { id: 'g3-70', term: 'Tree', translation: 'Ağaç', emoji: '🌳' },
  { id: 'g3-71', term: 'Flower', translation: 'Çiçek', emoji: '🌸' },
  { id: 'g3-72', term: 'Mountain', translation: 'Dağ', emoji: '🏔️' },
  { id: 'g3-73', term: 'River', translation: 'Nehir', emoji: '🌊' },
  { id: 'g3-74', term: 'Forest', translation: 'Orman', emoji: '🌲' },
  { id: 'g3-75', term: 'Sea', translation: 'Deniz', emoji: '🌊' },
  { id: 'g3-76', term: 'Star', translation: 'Yıldız', emoji: '⭐' },
  { id: 'g3-77', term: 'Moon', translation: 'Ay', emoji: '🌙' },
  { id: 'g3-78', term: 'Sun', translation: 'Güneş', emoji: '☀️' },
  { id: 'g3-79', term: 'Earth', translation: 'Dünya', emoji: '🌍' },
];

// ============================================================================
// 4. SINIF HAVUZU (Ülkeler, Meslekler, Zaman, Eylemler, Teknoloji)
// ============================================================================
export const G4_VOCAB: VocabularyItem[] = [
  // Jobs
  { id: 'g4-1', term: 'Doctor', translation: 'Doktor', emoji: '👨‍⚕️' },
  { id: 'g4-2', term: 'Nurse', translation: 'Hemşire', emoji: '👩‍⚕️' },
  { id: 'g4-3', term: 'Teacher', translation: 'Öğretmen', emoji: '👨‍🏫' },
  { id: 'g4-4', term: 'Police', translation: 'Polis', emoji: '👮' },
  { id: 'g4-5', term: 'Pilot', translation: 'Pilot', emoji: '👨‍✈️' },
  { id: 'g4-6', term: 'Chef', translation: 'Aşçı', emoji: '👨‍🍳' },
  { id: 'g4-7', term: 'Farmer', translation: 'Çiftçi', emoji: '👨‍🌾' },
  { id: 'g4-8', term: 'Vet', translation: 'Veteriner', emoji: '🐶' },
  { id: 'g4-9', term: 'Singer', translation: 'Şarkıcı', emoji: '🎤' },
  { id: 'g4-10', term: 'Driver', translation: 'Şoför', emoji: '🚌' },
  { id: 'g4-11', term: 'Fireman', translation: 'İtfaiyeci', emoji: '👨‍🚒' },
  { id: 'g4-12', term: 'Scientist', translation: 'Bilim İnsanı', emoji: '👩‍🔬' },
  { id: 'g4-13', term: 'Artist', translation: 'Ressam/Sanatçı', emoji: '🎨' },
  { id: 'g4-14', term: 'Astronaut', translation: 'Astronot', emoji: '👨‍🚀' },
  { id: 'g4-15', term: 'Judge', translation: 'Hakim', emoji: '⚖️' },

  // Countries
  { id: 'g4-16', term: 'Turkey', translation: 'Türkiye', emoji: '🇹🇷' },
  { id: 'g4-17', term: 'Germany', translation: 'Almanya', emoji: '🇩🇪' },
  { id: 'g4-18', term: 'France', translation: 'Fransa', emoji: '🇫🇷' },
  { id: 'g4-19', term: 'Italy', translation: 'İtalya', emoji: '🇮🇹' },
  { id: 'g4-20', term: 'England', translation: 'İngiltere', emoji: '🇬🇧' },
  { id: 'g4-21', term: 'USA', translation: 'Amerika', emoji: '🇺🇸' },
  { id: 'g4-22', term: 'Japan', translation: 'Japonya', emoji: '🇯🇵' },
  { id: 'g4-23', term: 'China', translation: 'Çin', emoji: '🇨🇳' },
  { id: 'g4-24', term: 'Russia', translation: 'Rusya', emoji: '🇷🇺' },
  { id: 'g4-25', term: 'Spain', translation: 'İspanya', emoji: '🇪🇸' },

  // Time
  { id: 'g4-30', term: 'Time', translation: 'Zaman', emoji: '⏰' },
  { id: 'g4-31', term: 'Morning', translation: 'Sabah', emoji: '🌅' },
  { id: 'g4-32', term: 'Afternoon', translation: 'Öğleden Sonra', emoji: '☀️' },
  { id: 'g4-33', term: 'Evening', translation: 'Akşam', emoji: '🌆' },
  { id: 'g4-34', term: 'Night', translation: 'Gece', emoji: '🌃' },
  { id: 'g4-35', term: 'Week', translation: 'Hafta', emoji: '📅' },
  { id: 'g4-36', term: 'Month', translation: 'Ay', emoji: '🗓️' },
  { id: 'g4-37', term: 'Year', translation: 'Yıl', emoji: '🎆' },
  { id: 'g4-38', term: 'Winter', translation: 'Kış', emoji: '⛄' },
  { id: 'g4-39', term: 'Summer', translation: 'Yaz', emoji: '🏖️' },

  // Technology & Objects
  { id: 'g4-40', term: 'Computer', translation: 'Bilgisayar', emoji: '💻' },
  { id: 'g4-41', term: 'Phone', translation: 'Telefon', emoji: '📱' },
  { id: 'g4-42', term: 'Television', translation: 'Televizyon', emoji: '📺' },
  { id: 'g4-43', term: 'Camera', translation: 'Kamera', emoji: '📷' },
  { id: 'g4-44', term: 'Watch', translation: 'Kol Saati', emoji: '⌚' },
  { id: 'g4-45', term: 'Radio', translation: 'Radyo', emoji: '📻' },
  { id: 'g4-46', term: 'Battery', translation: 'Pil', emoji: '🔋' },
  { id: 'g4-47', term: 'Light', translation: 'Işık', emoji: '💡' },
  { id: 'g4-48', term: 'Microscope', translation: 'Mikroskop', emoji: '🔬' },
  { id: 'g4-49', term: 'Rocket', translation: 'Roket', emoji: '🚀' },

  // Verbs & Actions
  { id: 'g4-50', term: 'Read', translation: 'Okumak', emoji: '📖' },
  { id: 'g4-51', term: 'Write', translation: 'Yazmak', emoji: '✍️' },
  { id: 'g4-52', term: 'Listen', translation: 'Dinlemek', emoji: '👂' },
  { id: 'g4-53', term: 'Speak', translation: 'Konuşmak', emoji: '🗣️' },
  { id: 'g4-54', term: 'Open', translation: 'Açmak', emoji: '👐' },
  { id: 'g4-55', term: 'Close', translation: 'Kapatmak', emoji: '🔒' },
  { id: 'g4-56', term: 'Cut', translation: 'Kesmek', emoji: '✂️' },
  { id: 'g4-57', term: 'Draw', translation: 'Çizmek', emoji: '🎨' },
  { id: 'g4-58', term: 'Love', translation: 'Sevmek', emoji: '❤️' },
  { id: 'g4-59', term: 'Think', translation: 'Düşünmek', emoji: '🤔' },
  { id: 'g4-60', term: 'Work', translation: 'Çalışmak', emoji: '💼' },
  { id: 'g4-61', term: 'Help', translation: 'Yardım Etmek', emoji: '🤝' },
  { id: 'g4-62', term: 'Stop', translation: 'Durmak', emoji: '🛑' },
  { id: 'g4-63', term: 'Go', translation: 'Gitmek', emoji: '🟢' },
  { id: 'g4-64', term: 'Win', translation: 'Kazanmak', emoji: '🏆' },
];

export const VOCAB_POOLS: Record<number, VocabularyItem[]> = {
  1: G1_VOCAB,
  2: G2_VOCAB,
  3: G3_VOCAB,
  4: G4_VOCAB
};
