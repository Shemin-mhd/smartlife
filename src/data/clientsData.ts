export interface ClientItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  location: string;
  fillBox?: boolean;
}

export const CORPORATE_CLIENTS: ClientItem[] = [
  {
    id: 'client-1',
    name: 'Corporate Partner 1',
    category: 'Commercial & Trading',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.07.jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  },
  {
    id: 'client-2',
    name: 'Corporate Partner 2',
    category: 'Logistics & Contracting',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.07 (1).jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  },
  {
    id: 'client-3',
    name: 'Corporate Partner 3',
    category: 'Technical & Engineering',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.08.jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  },
  {
    id: 'client-4',
    name: 'Corporate Partner 4',
    category: 'Automotive & Import/Export',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.08 (1).jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  },
  {
    id: 'client-5',
    name: 'Corporate Partner 5',
    category: 'Retail & Hospitality',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.08 (2).jpeg',
    location: 'Sharjah, UAE',
    fillBox: false
  },
  {
    id: 'client-6',
    name: 'Corporate Partner 6',
    category: 'Consultancy & Management',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.09.jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  },
  {
    id: 'client-7',
    name: 'Corporate Partner 7',
    category: 'Enterprise Solutions',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.09 (1).jpeg',
    location: 'Sharjah, UAE',
    fillBox: false
  },
  {
    id: 'client-8',
    name: 'Corporate Partner 8',
    category: 'Facilities & Contracting',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.48.09 (2).jpeg',
    location: 'Sharjah, UAE',
    fillBox: false
  },
  {
    id: 'client-9',
    name: 'Corporate Partner 9',
    category: 'Industrial & Commercial',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.52.12.jpeg',
    location: 'Sharjah, UAE',
    fillBox: false
  },
  {
    id: 'client-10',
    name: 'Corporate Partner 10',
    category: 'Business Services',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.52.12 (1).jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  },
  {
    id: 'client-11',
    name: 'Corporate Partner 11',
    category: 'Trade & Logistics',
    logoUrl: '/images/clients/WhatsApp Image 2026-08-03 at 20.54.20.jpeg',
    location: 'Sharjah, UAE',
    fillBox: true
  }
];
