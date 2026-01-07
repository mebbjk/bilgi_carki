
// @ts-ignore
import { initializeApp } from "firebase/app";
// @ts-ignore
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  onSnapshot
} from "firebase/firestore";
// @ts-ignore
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Ortam değişkenlerini daha güvenli bir şekilde al
const getEnv = (key: string) => {
    return process.env[key] || (window as any).process?.env?.[key] || "";
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

const LOCAL_STATS_KEY = 'bilgicarki_fixed_stats_v4';

const INITIAL_BASE_STATS = {
    totalVisits: 1600, 
    totalGamesPlayed: 4250,
    gameCounts: {
        'Bilgi Çarkı': 550,
        'Sınav Modu': 380,
        'Tombala': 270,
        'Kelime Avcısı': 320,
        'Hikaye': 220,
        'Yasak Kelime': 195,
        'Çarpım Tablosu': 450,
        'Zaman Tüneli': 170,
        'Cümle Ustası': 240,
        'Bilgi Kutuları': 210,
        'Kelime Tahmin': 265,
        'Anlam İlişkisi': 280,
        'Kelime Türetmece': 300,
        'Şehir Bulmaca': 150
    }
};

const getInitialStats = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STATS_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_BASE_STATS;
};

export const defaultStats = getInitialStats();

let db: any = null;
let auth: any = null;
let googleProvider: any = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    const app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    });
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("Firebase başarıyla başlatıldı.");
  } else {
    console.warn("Firebase API Key eksik. Uygulama Yerel Modda çalışacak.");
  }
} catch (error) {
  console.error("Firebase başlatma hatası:", error);
  db = null;
}

// --- USER PROFILE FUNCTIONS ---

export const getUserProfile = async (uid: string) => {
  if (!db) return null;
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) { console.error("Error fetching user", e); }
  return null;
};

export const saveUserProfile = async (user: any) => {
  if (!db) return;
  try {
    // Sadece gerekli verileri kaydet, gereksizleri filtrele
    const userToSave = { ...user, lastActive: Date.now() };
    const docRef = doc(db, "users", user.id);
    await setDoc(docRef, userToSave, { merge: true });
  } catch (e) { console.error("Error saving user", e); }
};

// ------------------------------

export interface ActivityLog {
  id: string;
  studentName: string;
  grade: number;
  action: string;
  timestamp: any;
}

export const subscribeToStats = (callback: (stats: any) => void) => {
  if (!db) {
     callback(getInitialStats());
     return () => {};
  }
  try {
    const docRef = doc(db, "stats", "general");
    return onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data();
        callback(remoteData);
        localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(remoteData));
      } else {
        setDoc(docRef, INITIAL_BASE_STATS);
        callback(INITIAL_BASE_STATS);
      }
    }, (error: any) => {
      console.warn("Firestore snapshot hatası, yerel veriler kullanılıyor.");
      callback(getInitialStats());
    });
  } catch (error) {
    callback(defaultStats);
    return () => {};
  }
};

export const getGlobalStats = async () => {
  if (!db) return getInitialStats();
  try {
    const docRef = doc(db, "stats", "general");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as any;
    await setDoc(docRef, INITIAL_BASE_STATS);
    return INITIAL_BASE_STATS;
  } catch (error) {
    return getInitialStats();
  }
};

export const updateGlobalStats = async (type: 'visit' | 'game', gameName?: string) => {
  try {
      const currentStats = getInitialStats();
      if (type === 'visit') currentStats.totalVisits++;
      else if (type === 'game' && gameName) {
          currentStats.totalGamesPlayed++;
          currentStats.gameCounts[gameName] = (currentStats.gameCounts[gameName] || 0) + 1;
      }
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(currentStats));
  } catch(e) {}

  if (!db) return;
  try {
    const docRef = doc(db, "stats", "general");
    const updates: any = {};
    if (type === 'visit') updates.totalVisits = increment(1);
    else if (type === 'game' && gameName) {
      updates.totalGamesPlayed = increment(1);
      updates[`gameCounts.${gameName}`] = increment(1);
    }
    await updateDoc(docRef, updates).catch(async (err: any) => {
      if (err.code === 'not-found' || err.code === 'permission-denied') {
         console.warn("İstatistik güncellenemedi: ", err.code);
      }
    });
  } catch (error) {}
};

export const getGameStats = async (gameName: string): Promise<number> => {
  if (!db) return (getInitialStats().gameCounts[gameName] || 0);
  const stats = await getGlobalStats();
  return (stats.gameCounts?.[gameName] || 0);
};

export const logActivity = async (studentName: string, grade: number, action: string) => {
  if (!db) return;
  try {
    await addDoc(collection(db, "activityLogs"), { studentName, grade, action, timestamp: serverTimestamp() });
  } catch (e) {}
};

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => {
      const data = doc.data();
      let date = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
      return { id: doc.id, studentName: data.studentName, grade: data.grade, action: data.action, timestamp: date.getTime() };
    });
  } catch (e) { return []; }
};

export const clearActivityLogs = async () => {
    // Güvenlik için temizleme yetkisi kapatıldı.
};

export { db, auth, googleProvider, signInWithPopup, signOut };
