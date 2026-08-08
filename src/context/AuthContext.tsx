import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { AdminUser } from '../types';
import { hashSHA256 } from '../utils/cryptoHelper';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

// SHA-256 checksums of authorized credentials (No plain text passwords exposed in client code!)
const CREDENTIAL_HASH_1 = 'c3b7fcf438fc747f6cfbc41eac9dc478bf393ffa1d10b97269af11af28e9552e';
const CREDENTIAL_HASH_2 = '16fb007ce80191dcd84cc8c9dc8bc5ada300b50c98d2d5fb6ab36bbcf9d73d28';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for persistent demo session
    const savedDemoUser = localStorage.getItem('smartlife_admin_session');
    if (savedDemoUser) {
      try {
        setUser(JSON.parse(savedDemoUser));
        setIsDemoMode(true);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem('smartlife_admin_session');
      }
    }

    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Smart Life Admin',
            role: 'admin'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    let firebaseErrorMsg: string | undefined = undefined;

    // 1. Primary Direct Firebase Authentication
    if (isFirebaseConfigured() && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
        const authedUser: AdminUser = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || res.user.email?.split('@')[0] || 'Smart Life Administrator',
          role: 'admin'
        };
        setUser(authedUser);
        setIsDemoMode(false);
        localStorage.removeItem('smartlife_admin_session');
        setLoading(false);
        return { success: true };
      } catch (err: any) {
        console.warn('Firebase auth attempt failed:', err?.code, err?.message);
        
        if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
          firebaseErrorMsg = 'Firebase Auth: Invalid email or password. Please verify the user exists in Firebase Console.';
        } else if (err?.code === 'auth/invalid-email') {
          firebaseErrorMsg = 'Firebase Auth: Invalid email address format.';
        } else if (err?.code === 'auth/too-many-requests') {
          firebaseErrorMsg = 'Firebase Auth: Access temporarily locked due to multiple failed attempts.';
        } else if (err?.message) {
          firebaseErrorMsg = `Firebase Auth: ${err.message}`;
        }
      }
    }

    // 2. Fallback Cryptographic Passcode Verification
    const inputCombo = `${email.trim().toLowerCase()}:${pass.trim()}`;
    const inputHash = await hashSHA256(inputCombo);

    if (inputHash === CREDENTIAL_HASH_1 || inputHash === CREDENTIAL_HASH_2) {
      const authenticatedUser: AdminUser = {
        uid: 'admin-sec-' + Date.now().toString(36),
        email: email.trim().toLowerCase(),
        displayName: 'Smart Life Administrator',
        role: 'admin'
      };
      setUser(authenticatedUser);
      setIsDemoMode(true);
      localStorage.setItem('smartlife_admin_session', JSON.stringify(authenticatedUser));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { 
      success: false, 
      error: firebaseErrorMsg || 'Authentication failed. Please verify your email and password.' 
    };
  };

  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase logout error:', e);
      }
    }
    localStorage.removeItem('smartlife_admin_session');
    setUser(null);
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
