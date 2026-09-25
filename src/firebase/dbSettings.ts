import {
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  googleMaps?: string;
}

export interface GeneralSettings {
  whatsappNumber: string; // Target WhatsApp number e.g. "971551585570" or "+971 55 158 5570"
  whatsappDisplayNumber: string; // Public display e.g. "+971 55 158 5570"
  whatsappDefaultMessage: string;
  notificationEmail?: string; // Connected email for direct inquiry notifications
  businessName: string;
  supportEmail: string;
  workingHours: string;
  mainBranchAddress: string;
  socialLinks?: SocialLinks;
  updatedAt?: string;
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  whatsappNumber: '971551585570',
  whatsappDisplayNumber: '+971 55 158 5570',
  whatsappDefaultMessage: 'Hello Smart Life Typing Services, I need assistance with UAE visa & government documentation.',
  notificationEmail: 'smartlifetypingservices@gmail.com',
  businessName: 'Smart Life Typing Services',
  supportEmail: 'admin@smartlifetyping.ae',
  workingHours: 'Sat - Thu: 8:00 AM - 10:00 PM',
  mainBranchAddress: 'Abu Shagara & Al Majaz 1, Sharjah, UAE',
  socialLinks: {
    facebook: 'https://facebook.com/smartlifetyping',
    instagram: 'https://instagram.com/smartlifetyping',
    linkedin: 'https://linkedin.com/company/smartlifetyping',
    twitter: 'https://twitter.com/smartlifetyping',
    youtube: 'https://youtube.com/@smartlifetyping',
    googleMaps: 'https://maps.google.com'
  }
};

const LOCAL_SETTINGS_KEY = 'smartlife_general_settings';
const SETTINGS_DOC_ID = 'general_settings';

export const getStoredLocalSettings = (): GeneralSettings => {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!raw) return DEFAULT_GENERAL_SETTINGS;
    return { ...DEFAULT_GENERAL_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed reading local general settings:', e);
    return DEFAULT_GENERAL_SETTINGS;
  }
};

const saveStoredLocalSettings = (settings: GeneralSettings): void => {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('smartlife_settings_updated'));
  } catch (e) {
    console.error('Failed saving local general settings:', e);
  }
};

export const fetchGeneralSettings = async (): Promise<GeneralSettings> => {
  let settings: GeneralSettings = getStoredLocalSettings();

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        settings = { ...DEFAULT_GENERAL_SETTINGS, ...(docSnap.data() as GeneralSettings) };
        saveStoredLocalSettings(settings);
      }
    } catch (e) {
      console.warn('Firestore fetchGeneralSettings fallback to local:', e);
    }
  }

  return settings;
};

export const saveGeneralSettings = async (settings: GeneralSettings): Promise<void> => {
  const updatedSettings: GeneralSettings = {
    ...settings,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), updatedSettings, { merge: true });
    } catch (e) {
      console.error('Firestore saveGeneralSettings error:', e);
    }
  }

  saveStoredLocalSettings(updatedSettings);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'settings', data: updatedSettings })
    }).catch(() => { });
  } catch { }
};

export const subscribeGeneralSettings = (onData: (settings: GeneralSettings) => void): (() => void) => {
  // Always emit initial local value immediately
  onData(getStoredLocalSettings());

  fetch('/api/get-cms-data').then(res => res.json()).then(json => {
    if (json.success && json.data && json.data.settings) {
      const cloudSettings = { ...DEFAULT_GENERAL_SETTINGS, ...json.data.settings };
      saveStoredLocalSettings(cloudSettings);
      onData(cloudSettings);
    }
  }).catch(() => { });

  let unsubFirestore: (() => void) | null = null;

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
      unsubFirestore = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const remoteSettings = { ...DEFAULT_GENERAL_SETTINGS, ...(docSnap.data() as GeneralSettings) };
          saveStoredLocalSettings(remoteSettings);
          onData(remoteSettings);
        }
      }, (e) => {
        console.warn('Firestore subscribeGeneralSettings error:', e);
      });
    } catch (e) {
      console.warn('Failed setting up Firestore listener for settings:', e);
    }
  }

  const handleLocalUpdate = () => {
    onData(getStoredLocalSettings());
  };

  window.addEventListener('smartlife_settings_updated', handleLocalUpdate);

  return () => {
    if (unsubFirestore) unsubFirestore();
    window.removeEventListener('smartlife_settings_updated', handleLocalUpdate);
  };
};
