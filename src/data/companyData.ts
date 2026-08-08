export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

export const COMPANY_STORY = {
  heading: "Smart Life Typing & Government Services",
  subheading: "Connecting Residents, Families, and Businesses with Fast & Compliant UAE Government Solutions",
  aboutText: [
    "Established in Sharjah, UAE, Smart Life Typing Services has grown to become one of the most trusted typing centers providing comprehensive government, visa, legal attestation, and consular documentation solutions across all seven Emirates.",
    "With branches strategically located in Abu Shagara and Al Majaz 1, our expert typists and document consultants handle every application with 100% accuracy, strict confidentiality, and full alignment with federal guidelines issued by ICP, MoHRE, Tasheel, Amer, and the Consulate General of India.",
    "Whether you are bringing your family to the UAE, setting up a new business, renewing your Emirates ID, or attesting educational certificates, Smart Life ensures a smooth, stress-free experience from start to final approval."
  ],
  stats: [
    { label: "Applications Processed", value: "50,000+" },
    { label: "Client Satisfaction", value: "99.4%" },
    { label: "Emirates Served", value: "All 7 Emirates" },
    { label: "Years of Trust", value: "10+ Years" }
  ]
};

export const COMPANY_TIMELINE: TimelineMilestone[] = [
  {
    year: "2015",
    title: "Inception in Abu Shagara",
    description: "Founded our primary typing center in Abu Shagara, Sharjah, focusing on residence visa typing, Emirates ID applications, and Ministry of Labour documentation."
  },
  {
    year: "2018",
    title: "Indian Consulate & Attestation Wing",
    description: "Expanded service scope to include comprehensive Indian Passport renewal, BLS application typing, certificate attestation, and legal document translations."
  },
  {
    year: "2021",
    title: "Launch of Branch 2 in Al Majaz 1",
    description: "Opened our second physical branch in Safeer Building, Al Majaz 1, increasing customer handling capacity and dedicated corporate document counters."
  },
  {
    year: "2024",
    title: "Digital WhatsApp Verification System",
    description: "Introduced instant WhatsApp pre-check services allowing clients across the UAE to submit document scans for review before visiting our branches."
  }
];

export const COMPANY_VALUES: CompanyValue[] = [
  {
    icon: "ShieldCheck",
    title: "100% Federal Compliance",
    description: "Every document typed and submitted strictly complies with the latest regulations of ICP, MoHRE, and UAE Ministry of Foreign Affairs."
  },
  {
    icon: "Clock",
    title: "Fast Turnaround & Accuracy",
    description: "We eliminate application rejections and delays through rigorous multi-point document verification before typing."
  },
  {
    icon: "Lock",
    title: "Privacy & Data Security",
    description: "Your personal identity records, passports, and family documents are treated with the highest standard of security and confidentiality."
  },
  {
    icon: "HeartHandshake",
    title: "Dedicated Customer Care",
    description: "Transparent pricing with no hidden fees, clear guidance at every step, and friendly support in English, Arabic, Hindi, Malayalam, and Urdu."
  }
];

export const COMPANY_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Abu Shagara Reception Counter",
    category: "Main Branch",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "Our welcoming reception counter at Abu Shagara branch equipped for rapid customer service."
  },
  {
    id: "g2",
    title: "Document Verification Desk",
    category: "Operations",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    description: "Expert typists conducting thorough verification of client visa and attestation files."
  },
  {
    id: "g3",
    title: "Al Majaz 1 Customer Lounge",
    category: "Branch 2",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable air-conditioned waiting area for clients at Safeer Building, Al Majaz 1."
  },
  {
    id: "g4",
    title: "Express Typing Counters",
    category: "Services",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    description: "Dedicated counters for instant Emirates ID, Medical, and MoFA attestation submissions."
  },
  {
    id: "g5",
    title: "Corporate Client Desk",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80",
    description: "Specialized service desk catering to corporate PRO document clearances and employee visa packages."
  },
  {
    id: "g6",
    title: "Consular Application Assistance",
    category: "Consular Services",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    description: "Professional guidance for Indian passport renewal, BLS forms, and power of attorney drafting."
  }
];
