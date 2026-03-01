import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminView from './pages/AdminView';
import CustomerView from './pages/CustomerView';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(auth ? auth.currentUser : null);
  const [loading, setLoading] = useState(!!auth);
  const [isApproved, setIsApproved] = useState(false);
  const [checkLoading, setCheckLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setCheckLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setLoading(false);
      if (u && db) {
        try {
          if (u.email === 'mebbjk1903.2025@gmail.com') {
            setIsApproved(true);
          } else {
            const userDoc = await getDoc(doc(db, 'users', u.uid));
            if (userDoc.exists() && userDoc.data()?.approved) {
              setIsApproved(true);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setCheckLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || checkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-inter text-slate-500 font-medium">
        Yetki Kontrol Ediliyor...
      </div>
    );
  }

  if (!auth) {
    // If no firebase config, bypass auth check
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-inter text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Onay Bekleniyor</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            Distribütör hesabınız bekleme aşamasındadır. Sisteme tam ve indirimli sipariş yetkisiyle erişim sağlamak için lütfen <b>Yöneticinizden (Admin)</b> onay isteyiniz.
          </p>
          <button onClick={() => auth!.signOut()} className="w-full px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl transition">
            Güvenli Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerView />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminView />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;