import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { ServiceItem, Branch, GoogleReview, FaqItem, InquiryItem } from '../types';
import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { SERVICES_DATA } from '../data/servicesData';
import { BRANCHES_DATA } from '../data/branchesData';
import { FAQS_DATA } from '../data/faqsData';
import { GOOGLE_REVIEWS_DATA } from '../data/googleReviewsData';

// Initial Mock Inquiries for Admin Inbox fallback
const INITIAL_MOCK_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-101',
    clientName: 'Rashid Al-Nuaimi',
    phone: '+971 50 123 4567',
    email: 'rashid.n@example.ae',
    serviceCategory: 'Visas & Immigration',
    serviceTitle: 'Sharjah Family Visa Renewal',
    message: 'Need urgent assistance renewing my wife and 2 children residency visas in Sharjah. EJARI is ready.',
    source: 'contact_form',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    assignedBranch: 'Abu Shagara Main Branch'
  },
  {
    id: 'inq-102',
    clientName: 'Sanjay Varma',
    phone: '+971 55 987 6543',
    email: 'sanjay.varma@example.com',
    serviceCategory: 'Indian Consular Services',
    serviceTitle: 'Indian Passport Renewal',
    message: 'Passport expiring in 2 months. Need Tatkaal appointment guidance and document pre-verification.',
    source: 'visa_helper',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Called client on WhatsApp. Requested copy of current Emirates ID.',
    assignedBranch: 'Abu Shagara Main Branch'
  },
  {
    id: 'inq-103',
    clientName: 'Fatima Al-Mansoori',
    phone: '+971 52 444 8899',
    serviceCategory: 'Certificate Attestation',
    serviceTitle: 'Degree Certificate MoFA Attestation',
    message: 'Have UK Bachelor degree certificate. Need home country and MoFA UAE final attestation.',
    source: 'document_checklist',
    status: 'contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    notes: 'Documents collected via courier. In progress at MoFA.',
    assignedBranch: 'Al Majaz 1 Branch'
  }
];

// Helper to broadcast live events across browser tabs via BroadcastChannel
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

// Helper to get local stored inquiries if offline/demo
const getStoredLocalInquiries = (): InquiryItem[] => {
  try {
    const saved = localStorage.getItem('smartlife_inquiries');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_MOCK_INQUIRIES;
};

const saveStoredLocalInquiries = (items: InquiryItem[]) => {
  try {
    localStorage.setItem('smartlife_inquiries', JSON.stringify(items));
  } catch {
    // ignore
  }
};

// Local storage helpers for static data edits in demo/offline mode
const getStoredLocal = <T>(key: string, defaultData: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return defaultData;
};

const saveStoredLocal = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

const DELETED_SERVICES_KEY = 'smartlife_deleted_services';

const getDeletedServiceIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_SERVICES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

const saveDeletedServiceIds = (ids: Set<string>): void => {
  try {
    const arr = Array.from(ids);
    localStorage.setItem(DELETED_SERVICES_KEY, JSON.stringify(arr));
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'deletedServices', data: arr })
    }).catch(() => { });
  } catch { }
};

// Helper to merge stored/live Firestore data with code-defined SERVICES_DATA defaults
const mergeWithCodeDefaults = (storedList: ServiceItem[], deletedIds?: Set<string>): ServiceItem[] => {
  const deletedSet = deletedIds || getDeletedServiceIds();
  const activeStored = (storedList || []).filter(s => !deletedSet.has(s.id));
  if (!activeStored.length && !deletedSet.size) {
    return SERVICES_DATA.map(s => s.category === 'indian_consulate' || s.categoryLabel === 'BLS Indian Consulate' ? { ...s, categoryLabel: 'Indian Consular Services' } : s);
  }

  const codeMap = new Map(SERVICES_DATA.map(s => [s.id, s]));
  const storedIds = new Set(activeStored.map(s => s.id));

  const mergedStored = activeStored.map(stored => {
    const codeService = codeMap.get(stored.id);
    const updatedCategoryLabel = (stored.category === 'indian_consulate' || stored.categoryLabel?.includes('BLS') || !stored.categoryLabel)
      ? 'Indian Consular Services'
      : stored.categoryLabel;

    if (!codeService) return { ...stored, categoryLabel: updatedCategoryLabel };

    const isIndianPassport = stored.id === 'indian-passport-renewal';
    const requiredDocs = (isIndianPassport || !stored.requiredDocuments || stored.requiredDocuments.length < 7)
      ? codeService.requiredDocuments
      : stored.requiredDocuments;

    return {
      ...codeService,
      ...stored,
      title: isIndianPassport ? codeService.title : (stored.title || codeService.title),
      categoryLabel: updatedCategoryLabel,
      requiredDocuments: requiredDocs
    };
  });

  const missingCodeServices = SERVICES_DATA.filter(s => !storedIds.has(s.id) && !deletedSet.has(s.id));
  const combined = [...mergedStored, ...missingCodeServices];

  return combined.map(s => {
    if (s.category === 'indian_consulate' || s.categoryLabel?.includes('BLS')) {
      return { ...s, categoryLabel: 'Indian Consular Services' };
    }
    return s;
  });
};

export const fetchServices = async (): Promise<ServiceItem[]> => {
  let list: ServiceItem[] = [];
  if (isFirebaseConfigured() && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      if (!querySnapshot.empty) {
        list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
      } else {
        // Auto-seed empty Firestore database with initial services
        await saveAllServices(SERVICES_DATA);
        list = SERVICES_DATA;
      }
    } catch (e) {
      console.warn('Firestore fetchServices fallback to local/cloud:', e);
    }
  }

  if (!list.length) {
    try {
      const res = await fetch('/api/get-cms-data');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.services && Array.isArray(json.data.services) && json.data.services.length > 0) {
          list = json.data.services;
          saveStoredLocal('smartlife_services', list);
        }
      }
    } catch { }
  }

  if (!list.length) {
    const rawLocal = localStorage.getItem('smartlife_services');
    if (!rawLocal) {
      list = SERVICES_DATA;
      saveStoredLocal('smartlife_services', SERVICES_DATA);
    } else {
      list = getStoredLocal('smartlife_services', SERVICES_DATA);
    }
  }

  const merged = mergeWithCodeDefaults(list);
  return merged.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
};

export const subscribeServices = (onData: (services: ServiceItem[]) => void): (() => void) => {
  const handleUpdate = (liveList?: ServiceItem[]) => {
    let listToMerge = liveList;
    if (!listToMerge) {
      const rawLocal = localStorage.getItem('smartlife_services');
      listToMerge = rawLocal ? getStoredLocal('smartlife_services', SERVICES_DATA) : SERVICES_DATA;
    }
    const merged = mergeWithCodeDefaults(listToMerge);
    const sorted = merged.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    onData(sorted);
  };

  let unsubscribeFirestore: (() => void) | null = null;

  if (isFirebaseConfigured() && db) {
    try {
      const q = collection(db, 'services');
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          saveAllServices(SERVICES_DATA);
          onData(SERVICES_DATA);
          return;
        }
        const liveList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
        handleUpdate(liveList);
      }, (err) => {
        console.warn('Firestore services onSnapshot error, using local fallback:', err);
        handleUpdate();
      });
    } catch (e) {
      console.warn('Error setting up services listener:', e);
    }
  }

  // Also fetch global cloud CMS data if Firestore is offline
  fetch('/api/get-cms-data').then(res => res.json()).then(json => {
    if (json.success && json.data && json.data.services && Array.isArray(json.data.services)) {
      handleUpdate(json.data.services);
    }
  }).catch(() => { });

  const handleLocalEvent = () => handleUpdate();
  handleUpdate();
  window.addEventListener('smartlife_services_updated', handleLocalEvent);
  window.addEventListener('storage', handleLocalEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'SERVICES_UPDATED') {
          if (e.data.payload && Array.isArray(e.data.payload)) {
            handleUpdate(e.data.payload);
          } else {
            handleUpdate();
          }
        }
      };
    }
  } catch { }

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('smartlife_services_updated', handleLocalEvent);
    window.removeEventListener('storage', handleLocalEvent);
    channel?.close();
  };
};

export const saveService = async (service: ServiceItem): Promise<boolean> => {
  const sanitizedService: ServiceItem = {
    ...service,
    isCustomized: true,
    isPopular: !!service.isPopular,
    badgeTag: service.isPopular ? (service.badgeTag || 'POPULAR') : ''
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'services', sanitizedService.id), sanitizedService);
    } catch (e) {
      console.error('Error saving service to Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_services', SERVICES_DATA);
  const index = current.findIndex(s => s.id === sanitizedService.id);
  let updated: ServiceItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = sanitizedService;
  } else {
    updated = [sanitizedService, ...current];
  }
  saveStoredLocal('smartlife_services', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'services', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_services_updated'));
  broadcastLiveEvent('SERVICES_UPDATED', updated);
  return true;
};

export const saveAllServices = async (servicesList: ServiceItem[]): Promise<boolean> => {
  const indexedList = servicesList.map((s, idx) => ({
    ...s,
    sortOrder: idx + 1,
    isPopular: !!s.isPopular,
    badgeTag: s.isPopular ? (s.badgeTag || 'POPULAR') : ''
  }));

  if (isFirebaseConfigured() && db) {
    try {
      const batchPromises = indexedList.map(item => setDoc(doc(db, 'services', item.id), item));
      await Promise.all(batchPromises);
    } catch (e) {
      console.error('Error saving all services to Firestore:', e);
    }
  }

  saveStoredLocal('smartlife_services', indexedList);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'services', data: indexedList })
    }).catch(() => { });
  } catch { }

  saveStoredLocal('smartlife_services', indexedList);
  window.dispatchEvent(new Event('smartlife_services_updated'));
  broadcastLiveEvent('SERVICES_UPDATED', indexedList);
  return true;
};

export const deleteService = async (serviceId: string): Promise<boolean> => {
  const deletedIds = getDeletedServiceIds();
  deletedIds.add(serviceId);
  saveDeletedServiceIds(deletedIds);

  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (e) {
      console.error('Error deleting service from Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_services', SERVICES_DATA);
  const updated = current.filter(s => s.id !== serviceId);
  saveStoredLocal('smartlife_services', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'services', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_services_updated'));
  broadcastLiveEvent('SERVICES_UPDATED', updated);
  return true;
};

// ==========================================
// 2. BLOGS API
// ==========================================
const DELETED_BLOGS_KEY = 'smartlife_deleted_blogs';

const getDeletedBlogIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_BLOGS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

const saveDeletedBlogIds = (ids: Set<string>): void => {
  try {
    const arr = Array.from(ids);
    localStorage.setItem(DELETED_BLOGS_KEY, JSON.stringify(arr));
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'deletedBlogs', data: arr })
    }).catch(() => { });
  } catch { }
};

const mergeBlogWithCodeDefaults = (storedList: BlogPost[], deletedIds?: Set<string>): BlogPost[] => {
  const deletedSet = deletedIds || getDeletedBlogIds();
  const activeStored = (storedList || []).filter(b => !deletedSet.has(b.id));

  const codeMap = new Map(BLOG_POSTS.map(b => [b.id, b]));
  const storedIds = new Set(activeStored.map(b => b.id));

  const mergedStored = activeStored.map(stored => {
    const codePost = codeMap.get(stored.id);
    let category = stored.category;
    if (category === ('BLS Indian Consulate' as any) || category === ('Indian Consulate (BLS)' as any) || (category as string)?.includes('BLS')) {
      category = 'Indian Consular Services';
    }
    if (!codePost) return { ...stored, category };

    const coverImage = (stored.id === 'post-3' || stored.coverImage?.includes('photo-1544620347-c4fd4a3d5957'))
      ? codePost.coverImage
      : (stored.coverImage || codePost.coverImage);

    return {
      ...codePost,
      ...stored,
      category,
      coverImage
    };
  });

  const missingCodePosts = BLOG_POSTS.filter(b => !storedIds.has(b.id) && !deletedSet.has(b.id));
  const combined = [...mergedStored, ...missingCodePosts];

  return combined.map(b => {
    let category = b.category;
    if (category === ('BLS Indian Consulate' as any) || category === ('Indian Consulate (BLS)' as any) || (category as string)?.includes('BLS')) {
      category = 'Indian Consular Services';
    }
    const codePost = codeMap.get(b.id);
    const coverImage = (b.id === 'post-3' || b.coverImage?.includes('photo-1544620347-c4fd4a3d5957'))
      ? (codePost?.coverImage || b.coverImage)
      : b.coverImage;

    return { ...b, category, coverImage };
  });
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  let list: BlogPost[] = [];
  if (isFirebaseConfigured() && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      if (!querySnapshot.empty) {
        list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      } else {
        // Auto-seed empty Firestore blogs
        for (const post of BLOG_POSTS) {
          await setDoc(doc(db, 'blogs', post.id), post);
        }
        list = BLOG_POSTS;
      }
    } catch (e) {
      console.warn('Firestore fetchBlogPosts fallback to local:', e);
    }
  }

  if (!list.length) {
    try {
      const res = await fetch('/api/get-cms-data');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.blogs && Array.isArray(json.data.blogs)) {
          list = json.data.blogs;
          saveStoredLocal('smartlife_blogs', list);
        }
      }
    } catch { }
  }

  if (!list.length) {
    list = getStoredLocal('smartlife_blogs', BLOG_POSTS);
  }

  return mergeBlogWithCodeDefaults(list);
};

export const subscribeBlogPosts = (onData: (posts: BlogPost[]) => void): (() => void) => {
  const handleUpdate = (liveList?: BlogPost[]) => {
    const posts = liveList || getStoredLocal('smartlife_blogs', BLOG_POSTS);
    onData(mergeBlogWithCodeDefaults(posts));
  };

  let unsubscribeFirestore: (() => void) | null = null;

  if (isFirebaseConfigured() && db) {
    try {
      const q = collection(db, 'blogs');
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          BLOG_POSTS.forEach(p => setDoc(doc(db, 'blogs', p.id), p));
          onData(mergeBlogWithCodeDefaults(BLOG_POSTS));
          return;
        }
        const cloudPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        handleUpdate(cloudPosts);
      }, () => {
        handleUpdate();
      });
    } catch (e) {
      console.warn('Error subscribing to blogs:', e);
    }
  }

  fetch('/api/get-cms-data').then(res => res.json()).then(json => {
    if (json.success && json.data && json.data.blogs && Array.isArray(json.data.blogs)) {
      handleUpdate(json.data.blogs);
    }
  }).catch(() => { });

  const handleLocalEvent = () => handleUpdate();
  handleUpdate();
  window.addEventListener('smartlife_blogs_updated', handleLocalEvent);
  window.addEventListener('storage', handleLocalEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'BLOGS_UPDATED') {
          handleUpdate(e.data.payload);
        }
      };
    }
  } catch { }

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('smartlife_blogs_updated', handleLocalEvent);
    window.removeEventListener('storage', handleLocalEvent);
    channel?.close();
  };
};

export const saveBlogPost = async (post: BlogPost): Promise<boolean> => {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'blogs', post.id), post);
    } catch (e) {
      console.error('Error saving blog post to Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_blogs', BLOG_POSTS);
  const index = current.findIndex(b => b.id === post.id);
  let updated: BlogPost[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = post;
  } else {
    updated = [post, ...current];
  }
  saveStoredLocal('smartlife_blogs', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'blogs', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_blogs_updated'));
  broadcastLiveEvent('BLOGS_UPDATED', updated);
  return true;
};

export const deleteBlogPost = async (postId: string): Promise<boolean> => {
  const deletedSet = getDeletedBlogIds();
  deletedSet.add(postId);
  saveDeletedBlogIds(deletedSet);

  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'blogs', postId));
    } catch (e) {
      console.error('Error deleting blog post from Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_blogs', BLOG_POSTS);
  const updated = current.filter(b => b.id !== postId);
  saveStoredLocal('smartlife_blogs', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'blogs', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_blogs_updated'));
  broadcastLiveEvent('BLOGS_UPDATED', updated);
  return true;
};

// ==========================================
// 3. BRANCHES API
// ==========================================
export const fetchBranches = async (): Promise<Branch[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'branches'));
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
      } else {
        for (const branch of BRANCHES_DATA) {
          await setDoc(doc(db, 'branches', branch.id), branch);
        }
        return BRANCHES_DATA;
      }
    } catch (e) {
      console.warn('Firestore fetchBranches fallback to local:', e);
    }
  }
  return getStoredLocal('smartlife_branches', BRANCHES_DATA);
};

export const saveBranch = async (branch: Branch): Promise<boolean> => {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'branches', branch.id), branch);
    } catch (e) {
      console.error('Error saving branch to Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_branches', BRANCHES_DATA);
  const index = current.findIndex(b => b.id === branch.id);
  let updated: Branch[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = branch;
  } else {
    updated = [...current, branch];
  }
  saveStoredLocal('smartlife_branches', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'branches', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_branches_updated'));
  broadcastLiveEvent('BRANCHES_UPDATED', updated);
  return true;
};

export const deleteBranch = async (id: string): Promise<boolean> => {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'branches', id));
    } catch (e) {
      console.error('Error deleting branch from Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_branches', BRANCHES_DATA);
  const updated = current.filter(b => b.id !== id);
  saveStoredLocal('smartlife_branches', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'branches', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_branches_updated'));
  broadcastLiveEvent('BRANCHES_UPDATED', updated);
  return true;
};

export const subscribeBranches = (onData: (branches: Branch[]) => void): (() => void) => {
  const handleUpdate = (liveList?: Branch[]) => {
    const branches = liveList || getStoredLocal('smartlife_branches', BRANCHES_DATA);
    onData(branches);
  };

  let unsubscribeFirestore: (() => void) | null = null;

  if (isFirebaseConfigured() && db) {
    try {
      const q = collection(db, 'branches');
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          BRANCHES_DATA.forEach(b => setDoc(doc(db, 'branches', b.id), b));
          onData(BRANCHES_DATA);
          return;
        }
        handleUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch)));
      }, () => {
        handleUpdate();
      });
    } catch (e) {
      console.warn('Error subscribing to branches:', e);
    }
  }

  fetch('/api/get-cms-data').then(res => res.json()).then(json => {
    if (json.success && json.data && json.data.branches && Array.isArray(json.data.branches)) {
      handleUpdate(json.data.branches);
    }
  }).catch(() => { });

  const handleLocalEvent = () => handleUpdate();
  handleUpdate();
  window.addEventListener('smartlife_branches_updated', handleLocalEvent);
  window.addEventListener('storage', handleLocalEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'BRANCHES_UPDATED') {
          handleUpdate(e.data.payload);
        }
      };
    }
  } catch { }

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('smartlife_branches_updated', handleLocalEvent);
    window.removeEventListener('storage', handleLocalEvent);
    channel?.close();
  };
};

// ==========================================
// 4. FAQS API
// ==========================================
export const fetchFaqs = async (): Promise<FaqItem[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'faqs'));
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FaqItem));
      } else {
        for (const faq of FAQS_DATA) {
          await setDoc(doc(db, 'faqs', String(faq.id)), faq);
        }
        return FAQS_DATA;
      }
    } catch (e) {
      console.warn('Firestore fetchFaqs fallback to local:', e);
    }
  }
  return getStoredLocal('smartlife_faqs', FAQS_DATA);
};

export const subscribeFaqs = (onData: (faqs: FaqItem[]) => void): (() => void) => {
  const handleUpdate = (liveList?: FaqItem[]) => {
    const faqs = liveList || getStoredLocal('smartlife_faqs', FAQS_DATA);
    onData(faqs);
  };

  let unsubscribeFirestore: (() => void) | null = null;

  if (isFirebaseConfigured() && db) {
    try {
      const q = collection(db, 'faqs');
      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          FAQS_DATA.forEach(f => setDoc(doc(db, 'faqs', String(f.id)), f));
          onData(FAQS_DATA);
          return;
        }
        handleUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as FaqItem)));
      }, () => {
        handleUpdate();
      });
    } catch (e) {
      console.warn('Error subscribing to FAQs:', e);
    }
  }

  fetch('/api/get-cms-data').then(res => res.json()).then(json => {
    if (json.success && json.data && json.data.faqs && Array.isArray(json.data.faqs)) {
      handleUpdate(json.data.faqs);
    }
  }).catch(() => { });

  const handleLocalEvent = () => handleUpdate();
  handleUpdate();
  window.addEventListener('smartlife_faqs_updated', handleLocalEvent);
  window.addEventListener('storage', handleLocalEvent);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'FAQS_UPDATED') {
          handleUpdate(e.data.payload);
        }
      };
    }
  } catch { }

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    window.removeEventListener('smartlife_faqs_updated', handleLocalEvent);
    window.removeEventListener('storage', handleLocalEvent);
    channel?.close();
  };
};

export const saveFaq = async (faq: FaqItem): Promise<boolean> => {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'faqs', String(faq.id)), faq);
    } catch (e) {
      console.error('Error saving FAQ to Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_faqs', FAQS_DATA);
  const index = current.findIndex(f => f.id === faq.id);
  let updated: FaqItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = faq;
  } else {
    updated = [...current, faq];
  }
  saveStoredLocal('smartlife_faqs', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'faqs', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_faqs_updated'));
  broadcastLiveEvent('FAQS_UPDATED', updated);
  return true;
};

export const deleteFaq = async (faqId: number): Promise<boolean> => {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'faqs', String(faqId)));
    } catch (e) {
      console.error('Error deleting FAQ from Firestore:', e);
    }
  }
  const current = getStoredLocal('smartlife_faqs', FAQS_DATA);
  const updated = current.filter(f => f.id !== faqId);
  saveStoredLocal('smartlife_faqs', updated);

  try {
    fetch('/api/save-cms-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'faqs', data: updated })
    }).catch(() => { });
  } catch { }

  window.dispatchEvent(new Event('smartlife_faqs_updated'));
  broadcastLiveEvent('FAQS_UPDATED', updated);
  return true;
};

// ==========================================
// 5. INQUIRIES CENTRALIZED BANK API
// ==========================================
export const fetchInquiries = async (): Promise<InquiryItem[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InquiryItem));
      }
    } catch (e) {
      console.warn('Firestore fetchInquiries fallback to local:', e);
    }
  }
  return getStoredLocalInquiries();
};

/**
 * Real-Time Live Subscription for Inquiries.
 * Auto-updates the Admin Panel instantly whenever ANY customer submits a form or inquiry.
 */
/**
 * Real-Time Live Subscription for Inquiries.
 * Auto-updates the Admin Panel instantly whenever ANY customer submits a form or inquiry.
 */
export const subscribeInquiries = (onData: (inquiries: InquiryItem[]) => void): (() => void) => {
  const handleUpdate = () => {
    onData(getStoredLocalInquiries());
  };

  // Initial load
  handleUpdate();

  // 1. Local & Cross-Tab Listeners
  window.addEventListener('smartlife_inquiry_added', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'NEW_INQUIRY' || e.data?.type === 'INQUIRY_UPDATED') {
          handleUpdate();
        }
      };
    }
  } catch { }

  // 2. Dev Server SSE EventSource Stream (Instant Push)
  let eventSource: EventSource | null = null;
  try {
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      eventSource = new EventSource('/api/live-events');
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data || '{}');
          if (data.type === 'INQUIRY_ADDED' && data.payload) {
            const currentLocal = getStoredLocalInquiries();
            const mergedMap = new Map<string, InquiryItem>();
            currentLocal.forEach(i => mergedMap.set(i.id, i));
            mergedMap.set(data.payload.id, data.payload);
            const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            saveStoredLocalInquiries(merged);
            onData(merged);
          } else if (data.type === 'INQUIRY_DELETED' && data.payload?.id) {
            const currentLocal = getStoredLocalInquiries();
            const filtered = currentLocal.filter(i => i.id !== data.payload.id);
            saveStoredLocalInquiries(filtered);
            onData(filtered);
          }
        } catch { }
      };
    }
  } catch { }

  // 3. Dev Server API Polling for Cross-Port Sync
  let lastInqFingerprint = '';
  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/get-inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.inquiries)) {
          const currentLocal = getStoredLocalInquiries();
          const mergedMap = new Map<string, InquiryItem>();
          currentLocal.forEach(i => mergedMap.set(i.id, i));
          data.inquiries.forEach((i: InquiryItem) => mergedMap.set(i.id, i));
          const mergedList = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const newFingerprint = mergedList.map(i => `${i.id}_${i.status || ''}_${i.createdAt || ''}`).join('|');
          if (newFingerprint !== lastInqFingerprint) {
            lastInqFingerprint = newFingerprint;
            saveStoredLocalInquiries(mergedList);
            onData(mergedList);
          }
        }
      }
    } catch { }
  }, 400);

  // 4. Firestore Stream
  let fsUnsubscribe: (() => void) | null = null;
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      fsUnsubscribe = onSnapshot(q, (snapshot) => {
        const liveList = snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InquiryItem));
        const currentLocal = getStoredLocalInquiries();
        const mergedMap = new Map<string, InquiryItem>();
        currentLocal.forEach(i => mergedMap.set(i.id, i));
        liveList.forEach(i => mergedMap.set(i.id, i));
        const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        saveStoredLocalInquiries(merged);
        onData(merged);
      }, (err) => {
        console.warn('Firestore inquiries onSnapshot error:', err);
        onData(getStoredLocalInquiries());
      });
    } catch (e) {
      console.warn('Error setting up inquiries listener:', e);
    }
  }

  return () => {
    window.removeEventListener('smartlife_inquiry_added', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
    channel?.close();
    eventSource?.close();
    clearInterval(pollInterval);
    if (fsUnsubscribe) fsUnsubscribe();
  };
};

export const submitNewInquiry = async (inquiry: Omit<InquiryItem, 'id' | 'createdAt' | 'status'>): Promise<InquiryItem> => {
  const newItem: InquiryItem = {
    ...inquiry,
    id: 'inq-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  const current = getStoredLocalInquiries();
  const updated = [newItem, ...current];
  saveStoredLocalInquiries(updated);

  window.dispatchEvent(new CustomEvent('smartlife_inquiry_added', { detail: newItem }));
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('smartlife_live_events');
      bc.postMessage({ type: 'NEW_INQUIRY', payload: newItem });
      bc.close();
    }
  } catch { }

  const inquiryJson = JSON.stringify(newItem);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([inquiryJson], { type: 'application/json' });
      navigator.sendBeacon('/api/track-inquiry', blob);
    } else {
      fetch('/api/track-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: inquiryJson,
        keepalive: true
      }).catch(() => { });
    }
  } catch {
    fetch('/api/track-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: inquiryJson,
      keepalive: true
    }).catch(() => { });
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    ['3000', '3001', '3002', '3003'].forEach(port => {
      if (window.location.port !== port) {
        try {
          fetch(`http://localhost:${port}/api/track-inquiry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: inquiryJson,
            keepalive: true
          }).catch(() => { });
        } catch { }
      }
    });
  }

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...inquiry,
        createdAt: newItem.createdAt,
        status: 'new'
      });
      newItem.id = docRef.id;
    } catch (e) {
      console.error('Error submitting inquiry to Firestore:', e);
    }
  }

  return newItem;
};

export const updateInquiryStatus = async (id: string, status: InquiryItem['status'], notes?: string): Promise<boolean> => {
  const current = getStoredLocalInquiries();
  const index = current.findIndex(item => item.id === id);
  if (index >= 0) {
    current[index].status = status;
    if (notes !== undefined) current[index].notes = notes;
    saveStoredLocalInquiries([...current]);
  }

  window.dispatchEvent(new CustomEvent('smartlife_inquiry_added'));
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('smartlife_live_events');
      bc.postMessage({ type: 'INQUIRY_UPDATED' });
      bc.close();
    }
  } catch { }

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, { status, ...(notes !== undefined && { notes }) });
      return true;
    } catch (e) {
      console.error('Error updating inquiry status in Firestore:', e);
    }
  }

  return true;
};

export const deleteInquiry = async (id: string): Promise<boolean> => {
  const current = getStoredLocalInquiries();
  const updated = current.filter(item => item.id !== id);
  saveStoredLocalInquiries(updated);

  window.dispatchEvent(new CustomEvent('smartlife_inquiry_added'));

  try {
    fetch('/api/delete-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => { });
  } catch { }

  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      return true;
    } catch (e) {
      console.error('Error deleting inquiry in Firestore:', e);
    }
  }

  return true;
};

// ==========================================
// 6. WHATSAPP CLICK ANALYTICS API (Real-Time Live Engine)
// ==========================================
import { WhatsAppClickEvent } from '../types';

const INITIAL_MOCK_WA_CLICKS: WhatsAppClickEvent[] = [
  {
    id: 'wa-clk-101',
    customerName: 'Mohammed Rashid',
    customerPhone: '+971 50 882 1199',
    buttonLocation: 'Header Instant WhatsApp',
    pagePath: '/',
    contextDetails: 'Service: Sharjah Family Visa Renewal Assistance',
    deviceType: 'Mobile',
    targetUrl: 'https://wa.me/971551585570?text=Hi%20Smart%20Life...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'wa-clk-102',
    customerName: 'Sujith Kumar',
    customerPhone: '+971 55 441 3322',
    buttonLocation: 'Services Catalog Card',
    pagePath: '/#services',
    contextDetails: 'Service: Indian Passport Renewal Tatkaal',
    deviceType: 'Desktop',
    targetUrl: 'https://wa.me/971551585570?text=Hi...',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

export const fetchWhatsAppClicks = async (): Promise<WhatsAppClickEvent[]> => {
  const localClicks = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'whatsapp_clicks'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const cloudClicks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WhatsAppClickEvent));
        const mergedMap = new Map<string, WhatsAppClickEvent>();
        localClicks.forEach(c => mergedMap.set(c.id, c));
        cloudClicks.forEach(c => mergedMap.set(c.id, c));
        const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        saveStoredLocal('smartlife_wa_clicks', merged);
        return merged;
      }
    } catch (e) {
      console.warn('Firestore fetchWhatsAppClicks fallback to local:', e);
    }
  }
  return localClicks;
};

/**
 * Real-Time Live Subscription for WhatsApp Clicks.
 * Auto-updates the Admin Panel instantly whenever ANY WhatsApp button is clicked on the website.
 */
export const subscribeWhatsAppClicks = (onData: (clicks: WhatsAppClickEvent[]) => void): (() => void) => {
  const handleUpdate = () => {
    onData(getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS));
  };

  handleUpdate();
  window.addEventListener('smartlife_wa_click_added', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('smartlife_live_events');
      channel.onmessage = (e) => {
        if (e.data?.type === 'WA_CLICK') {
          handleUpdate();
        }
      };
    }
  } catch { }

  // Dev Server SSE EventSource Stream (Instant Sub-Second Push)
  let eventSource: EventSource | null = null;
  try {
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      eventSource = new EventSource('/api/live-events');
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data || '{}');
          if (data.type === 'WA_CLICK' && data.payload) {
            const currentLocal = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
            const mergedMap = new Map<string, WhatsAppClickEvent>();
            currentLocal.forEach(c => mergedMap.set(c.id, c));
            mergedMap.set(data.payload.id, data.payload);
            const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            saveStoredLocal('smartlife_wa_clicks', merged);
            onData(merged);
          } else if (data.type === 'WA_DELETE' && data.payload?.id) {
            const currentLocal = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
            const filtered = currentLocal.filter(c => c.id !== data.payload.id);
            saveStoredLocal('smartlife_wa_clicks', filtered);
            onData(filtered);
          } else if (data.type === 'WA_CLEAR') {
            saveStoredLocal('smartlife_wa_clicks', []);
            onData([]);
          }
        } catch { }
      };
    }
  } catch { }

  // Dev Server API Polling for Cross-Port Live Sync (e.g. 3001 vs 3000)
  let lastFingerprint = '';
  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/get-wa-clicks');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.clicks)) {
          const currentLocal = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
          const mergedMap = new Map<string, WhatsAppClickEvent>();
          currentLocal.forEach(c => mergedMap.set(c.id, c));
          data.clicks.forEach((c: WhatsAppClickEvent) => mergedMap.set(c.id, c));
          const mergedList = Array.from(mergedMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          const newFingerprint = mergedList.map(c => `${c.id}_${c.timestamp || ''}`).join('|');
          if (newFingerprint !== lastFingerprint) {
            lastFingerprint = newFingerprint;
            saveStoredLocal('smartlife_wa_clicks', mergedList);
            onData(mergedList);
          }
        }
      }
    } catch { }
  }, 400);

  // Firestore Cloud Database Listener
  let fsUnsubscribe: (() => void) | null = null;
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'whatsapp_clicks'), orderBy('timestamp', 'desc'));
      fsUnsubscribe = onSnapshot(q, (snapshot) => {
        const cloudClicks = snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WhatsAppClickEvent));
        const currentLocal = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
        const mergedMap = new Map<string, WhatsAppClickEvent>();
        currentLocal.forEach(c => mergedMap.set(c.id, c));
        cloudClicks.forEach(c => mergedMap.set(c.id, c));
        const mergedList = Array.from(mergedMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        saveStoredLocal('smartlife_wa_clicks', mergedList);
        onData(mergedList);
      }, (err) => {
        console.warn('Firestore onSnapshot error:', err);
        onData(getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS));
      });
    } catch (e) {
      console.warn('Error setting up Firestore listener:', e);
    }
  }

  return () => {
    window.removeEventListener('smartlife_wa_click_added', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
    channel?.close();
    eventSource?.close();
    clearInterval(pollInterval);
    if (fsUnsubscribe) fsUnsubscribe();
  };
};

let lastClickFingerprint = '';
let lastClickTime = 0;

export const saveWhatsAppClick = async (event: Omit<WhatsAppClickEvent, 'id' | 'timestamp'>): Promise<WhatsAppClickEvent | null> => {
  const now = Date.now();
  const fingerprint = `${event.targetUrl}||${event.buttonLocation}||${event.contextDetails}`;

  // 500ms debouncing window for identical click events to prevent rapid accidental double-clicks
  if (fingerprint === lastClickFingerprint && now - lastClickTime < 500) {
    console.warn('⚠️ Blocked duplicate WhatsApp click trigger within 500ms window');
    return null;
  }

  lastClickFingerprint = fingerprint;
  lastClickTime = now;

  const newClick: WhatsAppClickEvent = {
    ...event,
    id: 'wa-clk-' + Date.now(),
    timestamp: new Date().toISOString()
  };

  const currentLocal = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
  const updatedLocal = [newClick, ...currentLocal];
  saveStoredLocal('smartlife_wa_clicks', updatedLocal);

  window.dispatchEvent(new CustomEvent('smartlife_wa_click_added', { detail: newClick }));
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('smartlife_live_events');
      bc.postMessage({ type: 'WA_CLICK', payload: newClick });
      bc.close();
    }
  } catch { }

  const waJson = JSON.stringify(newClick);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([waJson], { type: 'application/json' });
      navigator.sendBeacon('/api/track-wa-click', blob);
    } else {
      fetch('/api/track-wa-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: waJson,
        keepalive: true
      }).catch(() => { });
    }
  } catch {
    fetch('/api/track-wa-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: waJson,
      keepalive: true
    }).catch(() => { });
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    ['3000', '3001', '3002', '3003'].forEach(port => {
      if (window.location.port !== port) {
        try {
          fetch(`http://localhost:${port}/api/track-wa-click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: waJson,
            keepalive: true
          }).catch(() => { });
        } catch { }
      }
    });
  }

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, 'whatsapp_clicks'), newClick);
      newClick.id = docRef.id;
    } catch (e) {
      console.error('Error saving WhatsApp click to Firestore:', e);
    }
  }

  return newClick;
};

export const deleteWhatsAppClickEvent = async (id: string): Promise<boolean> => {
  const current = getStoredLocal('smartlife_wa_clicks', INITIAL_MOCK_WA_CLICKS);
  const updated = current.filter(c => c.id !== id);
  saveStoredLocal('smartlife_wa_clicks', updated);
  window.dispatchEvent(new Event('smartlife_wa_click_added'));

  try {
    fetch('/api/delete-wa-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => { });
  } catch { }

  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'whatsapp_clicks', id));
    } catch (e) {
      console.error('Error deleting WhatsApp click event from Firestore:', e);
    }
  }
  return true;
};

export const clearAllWhatsAppClicks = async (): Promise<boolean> => {
  saveStoredLocal('smartlife_wa_clicks', []);
  window.dispatchEvent(new Event('smartlife_wa_click_added'));

  try {
    fetch('/api/clear-wa-clicks', {
      method: 'POST'
    }).catch(() => { });
  } catch { }

  if (isFirebaseConfigured() && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'whatsapp_clicks'));
      const batchDeletes = querySnapshot.docs.map(d => deleteDoc(doc(db, 'whatsapp_clicks', d.id)));
      await Promise.all(batchDeletes);
    } catch (e) {
      console.error('Error clearing Firestore WhatsApp clicks:', e);
    }
  }
  return true;
};


