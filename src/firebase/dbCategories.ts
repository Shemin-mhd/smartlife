import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { CategoryItem } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categoriesData';

const LOCAL_KEY = 'smartlife_categories';

const broadcastLiveEvent = (type: string, payload?: any) => {
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('smartlife_live_events');
      bc.postMessage({ type, payload });
      bc.close();
    }
  } catch (e) {
    console.warn('BroadcastChannel error:', e);
  }
};

const getStoredLocalCategories = (): CategoryItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading local categories:', e);
    return DEFAULT_CATEGORIES;
  }
};

const saveStoredLocalCategories = (items: CategoryItem[]): void => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('smartlife_categories_updated'));
    broadcastLiveEvent('CATEGORIES_UPDATED', items);
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'categories', data: items })
    }).catch(() => {});
  } catch (e) {
    console.error('Failed saving local categories:', e);
  }
};

export const fetchCategories = async (): Promise<CategoryItem[]> => {
  let list: CategoryItem[] = [];
  if (isFirebaseConfigured() && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      if (!querySnapshot.empty) {
        list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
      }
    } catch (e) {
      console.warn('Firestore fetchCategories fallback to local:', e);
    }
  }

  if (!list.length) {
    list = getStoredLocalCategories();
  }

  list = list.map(c => {
    if (c.id === 'indian_consulate' || c.label === 'BLS Indian Consulate' || (c.label && c.label.includes('BLS'))) {
      return { ...c, label: 'Indian Consular Services' };
    }
    return c;
  });

  return list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
};

export const saveCategory = async (category: CategoryItem): Promise<void> => {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'categories', category.id), category, { merge: true });
    } catch (e) {
      console.error('Firestore saveCategory error:', e);
    }
  }

  const current = getStoredLocalCategories();
  const existingIdx = current.findIndex(c => c.id === category.id);
  let updated: CategoryItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...category };
  } else {
    updated = [...current, category];
  }
  saveStoredLocalCategories(updated);
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.error('Firestore deleteCategory error:', e);
    }
  }

  const current = getStoredLocalCategories();
  const updated = current.filter(c => c.id !== id);
  saveStoredLocalCategories(updated);
};

export const subscribeCategories = (onData: (categories: CategoryItem[]) => void): (() => void) => {
  const handleLocalUpdate = (list?: CategoryItem[]) => {
    const categories = list || getStoredLocalCategories();
    onData(categories.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)));
  };

  let unsubscribeFirestore: (() => void) | null = null;
  if (isFirebaseConfigured() && db) {
    try {
      const q = collection(db, 'categories');
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          onData(list);
        } else {
          DEFAULT_CATEGORIES.forEach(cat => saveCategory(cat));
          onData(DEFAULT_CATEGORIES);
        }
      }, (err) => {
        console.warn('Firestore categories listener error, using local fallback:', err);
        handleLocalUpdate();
      });
    } catch (e) {
      console.warn('Failed setting Firestore categories listener:', e);
    }
  }

  handleLocalUpdate();
  fetch('/api/get-cms-data').then(res => res.json()).then(json => {
    if (json.success && json.data && json.data.categories && Array.isArray(json.data.categories)) {
      handleLocalUpdate(json.data.categories);
    }
  }).catch(() => {});

  const handleEvent = () => handleLocalUpdate();
  window.addEventListener('smartlife_categories_updated', handleEvent);
  window.addEventListener('storage', handleEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'CATEGORIES_UPDATED') {
          handleLocalUpdate(e.data.payload);
        }
      };
    }
  } catch {}

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('smartlife_categories_updated', handleEvent);
    window.removeEventListener('storage', handleEvent);
    channel?.close();
  };
};
