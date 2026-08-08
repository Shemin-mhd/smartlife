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
  if (isFirebaseConfigured() && db) {
    try {
      const q = collection(db, 'categories');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
          list.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          onData(list);
        } else {
          // Auto-seed empty Firestore categories collection
          DEFAULT_CATEGORIES.forEach(cat => saveCategory(cat));
          onData(DEFAULT_CATEGORIES);
        }
      }, (err) => {
        console.warn('Firestore categories listener error, using local fallback:', err);
        onData(getStoredLocalCategories());
      });
      return unsubscribe;
    } catch (e) {
      console.warn('Failed setting Firestore categories listener:', e);
    }
  }

  // Local Storage Event Listener Fallback
  onData(getStoredLocalCategories());
  const handleLocalUpdate = () => {
    onData(getStoredLocalCategories());
  };
  window.addEventListener('smartlife_categories_updated', handleLocalUpdate);
  return () => {
    window.removeEventListener('smartlife_categories_updated', handleLocalUpdate);
  };
};
