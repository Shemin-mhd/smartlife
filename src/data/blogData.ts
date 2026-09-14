export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: 'Visa Updates' | 'Attestation' | 'Passport & BLS' | 'MoHRE Labour';
  date: string;
  readTime: string;
  content: string[];
  keyTakeaways: string[];
  author: string;
  coverImage?: string;
  relatedServiceId?: string;
  seoKeywords?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Complete Guide to UAE Family Residence Visa Renewal in Sharjah (2026 Rules)",
    slug: "sharjah-family-visa-renewal-guide",
    category: "Visa Updates",
    date: "July 2026",
    readTime: "4 min read",
    summary: "Everything you need to know about sponsoring spouse and children in Sharjah, including salary requirements, EJARI, medical fitness, and Emirates ID steps.",
    coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
    relatedServiceId: "srv-1",
    seoKeywords: ["family visa renewal sharjah", "icp family residency", "ejari tenancy contract", "emirates id typing"],
    keyTakeaways: [
      "Minimum required salary is AED 4,000 or AED 3,000 + accommodation.",
      "Attested marriage certificate and birth certificates are mandatory.",
      "Sharjah EJARI tenancy contract must be under the sponsor's name.",
      "Medical fitness test and Emirates ID typing can be completed in parallel."
    ],
    author: "Smart Life Documentation Team",
    content: [
      "Sponsoring family members in Sharjah requires meeting specific ICP and Sharjah Immigration requirements. Before submitting your family residence visa application, ensure all core documents are verified and prepared.",
      "Step 1: Document Pre-Verification - Verify that your marriage certificate and children's birth certificates carry official MoFA attestation from both your home country and the UAE Ministry of Foreign Affairs.",
      "Step 2: EJARI & Utility Bill - Obtain a valid Sharjah Municipality tenancy contract (EJARI) along with recent SEWA electricity/water bills showing active utility connections.",
      "Step 3: Medical Fitness & Emirates ID - Schedule medical screening at Sharjah Medical Center and apply for Emirates ID biometric appointment simultaneously.",
      "At Smart Life Typing Services, our typists handle entry permit applications, residency stamping, and Emirates ID submissions in a single visit."
    ]
  },
  {
    id: "post-2",
    title: "How to Attest Educational & Personal Certificates for UAE Employment & Visas",
    slug: "uae-certificate-attestation-guide",
    category: "Attestation",
    date: "June 2026",
    readTime: "5 min read",
    summary: "Step-by-step procedure for attesting degree certificates, diplomas, marriage, and birth certificates through MoFA UAE.",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    relatedServiceId: "srv-6",
    seoKeywords: ["mofa attestation sharjah", "degree certificate attestation", "marriage certificate legal stamp"],
    keyTakeaways: [
      "Attestation starts in the issuing home country (HRD/Notary & Embassy).",
      "UAE Ministry of Foreign Affairs (MoFA) performs final legal attestation.",
      "Commercial and company invoices require specialised MoFA legal stamps.",
      "Translating non-English/Arabic documents into certified legal Arabic is compulsory."
    ],
    author: "Smart Life Legal Attestation Wing",
    content: [
      "Certificate attestation proves the authenticity of your educational and personal documents for official government use in the United Arab Emirates.",
      "1. Home Country Verification: The degree or diploma must first be verified by the relevant state education department (HRD) and the Ministry of External Affairs in your origin country.",
      "2. UAE Embassy Stamping: The UAE Embassy located in your country affixes its official legal stamp.",
      "3. MoFA UAE Final Attestation: Once brought to the UAE, the document receives final authentication from the Ministry of Foreign Affairs (MoFA).",
      "Smart Life Typing offers complete end-to-end attestation clearance for Indian, UK, US, Pakistani, and international certificates with door-to-door courier options."
    ]
  },

  {
    id: "post-4",
    title: "MoHRE Labour Contracts & Offer Letter Typing Rules in Sharjah & UAE",
    slug: "mohre-labour-contract-rules-uae",
    category: "MoHRE Labour",
    date: "April 2026",
    readTime: "4 min read",
    summary: "Understanding employment offer letters, electronic work permits, and contract modifications under MoHRE guidelines.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    relatedServiceId: "srv-4",
    seoKeywords: ["mohre labour contract sharjah", "work permit typing", "tasheel offer letter uae"],
    keyTakeaways: [
      "Offer letters must match the electronic employment contract generated in MoHRE.",
      "Fixed-term employment contracts are standard across all private sector companies.",
      "Work permit modifications and job title changes require prior MoHRE approval.",
      "Emirates ID and passport scans must be clearly readable."
    ],
    author: "Smart Life Government Solutions",
    content: [
      "The Ministry of Human Resources and Emiratisation (MoHRE) enforces strict electronic document guidelines for employer-employee relations in the UAE.",
      "Smart Life Typing assists companies, PROs, and employees with electronic offer letter generation, work permit typing, contract renewal submissions, and labor cancellation documentation.",
      "Visit our Abu Shagara or Al Majaz 1 branch for instant Tasheel & MoHRE typing services with real-time application tracking."
    ]
  }
];
