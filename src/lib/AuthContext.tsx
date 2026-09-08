import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'lecturer';
  overallScore: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          const userDoc = doc(db, 'users', authUser.uid);
          const snap = await getDoc(userDoc);
          
          let data: UserData;
          if (!snap.exists()) {
            // Identify lecturer by email (example email from metadata)
            const isLecturer = authUser.email === 'creativemen72@gmail.com';
            data = {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
              role: isLecturer ? 'lecturer' : 'student',
              overallScore: 0,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDoc, data);
          } else {
            data = snap.data() as UserData;
            // Force fix for role if missing or if lecturer role needs correction
            const isLecturer = authUser.email === 'creativemen72@gmail.com';
            if (!data.role || (isLecturer && data.role !== 'lecturer')) {
              const assignedRole = isLecturer ? 'lecturer' : 'student';
              data.role = assignedRole;
              await setDoc(userDoc, { role: assignedRole }, { merge: true });
            }
          }
          setUserData(data);
        } else {
          setUserData(null);
        }
        setUser(authUser);
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
        // Even if Firestore fails, we at least set the auth user so the app doesn't crash completely
        setUser(authUser);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log('Sign in popup closed or cancelled');
      } else {
        console.error('Sign in error:', error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, isSigningIn, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
