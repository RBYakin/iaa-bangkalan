import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, onSnapshot, collection, query, orderBy, getDoc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId); 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline') || error.code === 'unavailable') {
      console.warn("Firestore connection check: Client might be offline or config pending.");
    }
  }
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Email login failed:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Daftar Email yang otomatis jadi Admin Utama
        const adminEmails = ['yakinslax.129@gmail.com', 'admin@iaabangkalan.or.id', 'iaa_admin@gmail.com'];
        
        if (u.email && adminEmails.includes(u.email)) {
          setIsAdmin(true);
          // Auto-sync admin role ke Firestore
          await setDoc(doc(db, 'users', u.uid), {
            uid: u.uid,
            email: u.email,
            role: 'admin'
          }, { merge: true });
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', u.uid));
            setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
          } catch (e) {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Data Hooks
export const useFirestoreCollection = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sederhanakan query tanpa orderBy untuk menghindari masalah index di awal
    const q = query(collection(db, collectionName));
    const unsub = onSnapshot(q, (snapshot) => {
      console.log(`Snapshot received for ${collectionName}:`, snapshot.size, "documents");
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching ${collectionName}:`, err);
      setLoading(false);
    });
    return unsub;
  }, [collectionName]);

  return { data, loading };
};

// Error helper as per integration instructions
export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

export const handleFirestoreError = (error: any, operation: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  if (error.code === 'permission-denied') {
    const info: FirestoreErrorInfo = {
      error: error.message,
      operationType: operation,
      path: path,
      authInfo: {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || '',
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || true,
        providerInfo: auth.currentUser?.providerData || []
      }
    };
    throw new Error(JSON.stringify(info));
  }
  throw error;
};
