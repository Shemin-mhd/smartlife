export type ServiceCategory = string;

export interface CategoryItem {
  id: string;
  label: string;
  sortOrder?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  requiredDocuments: string[];
  processingTime: string;
  isPopular?: boolean;
  badgeTag?: string; // e.g. 'POPULAR' | 'BEST SELLER' | 'FAST TRACK' | 'HIGH DEMAND' | 'NEW' | 'FEATURED'
  sortOrder?: number; // Sequence index for ordering
  isCustomized?: boolean; // Flag indicating explicit admin panel customization
  keywords: string[];
  officialPortalUrl?: string;
  officialPortalName?: string;
}

export interface Branch {
  id: string;
  name: string;
  isMain: boolean;
  address: string;
  area: string;
  city: string;
  emirate: string;
  landmark: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsapp: string;
  googleMapUrl: string;
  googleShareUrl?: string;
  rating?: number;
  reviewCount?: number;
  poBox?: string;
  workingHours: string;
  workingDays: string;
  fridayHours?: string;
}

export interface GoogleReview {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  branchName: string;
  serviceCategory: string;
  comment: string;
  isVerifiedGoogle: boolean;
  likesCount?: number;
  googleUrl?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface DocumentChecklist {
  serviceId: string;
  title: string;
  documents: {
    name: string;
    description?: string;
    isMandatory: boolean;
  }[];
  notes?: string[];
}

export type InquiryStatus = 'new' | 'in_progress' | 'contacted' | 'resolved';

export interface InquiryItem {
  id: string;
  clientName: string;
  phone: string;
  email?: string;
  serviceCategory: string;
  serviceTitle?: string;
  message: string;
  source: 'contact_form' | 'visa_helper' | 'document_checklist' | 'whatsapp';
  status: InquiryStatus;
  createdAt: string;
  notes?: string;
  assignedBranch?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'staff';
}

export interface WhatsAppClickEvent {
  id: string;
  timestamp: string;
  pagePath: string;
  buttonLocation: string;
  contextDetails?: string;
  deviceType: 'Mobile' | 'Desktop';
  targetUrl?: string;
  customerName?: string;
  customerPhone?: string;
}


