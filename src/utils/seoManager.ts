import { SITE_DOMAIN, LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA, generateArticleSchema, generateBreadcrumbSchema } from '../data/seoData';
import { BLOG_POSTS } from '../data/blogData';
import { SERVICES_DATA } from '../data/servicesData';

export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd?: object[];
}

// Crisp, professional share preview images curated specifically for each section
export const PAGE_SHARE_IMAGES = {
  home: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  services: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
  documents: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
  branches: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  reviews: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200&auto=format&fit=crop',
  company: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
  blog: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
  faq: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'
};

export function getSeoConfigForPage(pageKey: string, articleSlug?: string): PageSeoConfig {
  const baseUrl = SITE_DOMAIN;

  switch (pageKey) {
    case 'home':
      return {
        title: 'Smart Life Typing Services Sharjah | Family Visa, Emirates ID & MoHRE',
        description: 'Approved UAE government typing center in Abu Shagara & Al Majaz 1, Sharjah. Specialized in Family Residence Visas, Emirates ID, MoHRE Contracts, Golden Visa, Certificate Attestation & Passport Renewal.',
        canonicalUrl: baseUrl,
        ogTitle: 'Smart Life Typing Services Sharjah | Family Visa & Government Documentation',
        ogDescription: 'Trusted government typing and visa center in Sharjah. 240+ 5-star Google reviews. Abu Shagara & Al Majaz 1 offices.',
        ogImage: PAGE_SHARE_IMAGES.home,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Smart Life Typing Services Sharjah | Visa & Govt Solutions',
        twitterDescription: 'Official government typing center in Sharjah. Family Visa, Emirates ID, MoHRE, & Attestation.',
        twitterImage: PAGE_SHARE_IMAGES.home,
        jsonLd: [
          LOCAL_BUSINESS_SCHEMA,
          generateBreadcrumbSchema([{ name: 'Home', url: baseUrl }])
        ]
      };

    case 'services':
      return {
        title: 'Government Typing Services & Visa Fee Checklist | Smart Life Sharjah',
        description: 'Complete list of official government typing services in Sharjah: Family Visa Stamping, Tourist Visa, MoHRE Labour Contracts, Golden Visa Applications, MoFA Attestation, & BLS Indian Passport Renewal.',
        canonicalUrl: `${baseUrl}/#services`,
        ogTitle: 'Government Typing Services & Visa Clearances | Smart Life Sharjah',
        ogDescription: '20+ government documentation services with transparent typing fees, required document lists, and online WhatsApp support.',
        ogImage: PAGE_SHARE_IMAGES.services,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'UAE Government Typing Services | Smart Life Sharjah',
        twitterDescription: 'Family Visas, Emirates ID, Labour Contracts, Golden Visa, and Attestation in Sharjah.',
        twitterImage: PAGE_SHARE_IMAGES.services,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            "name": "Smart Life Government Typing Services Sharjah",
            "serviceType": "Visa & Documentation Processing",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Smart Life Typing Services Sharjah"
            },
            "areaServed": "Sharjah & All Emirates, UAE"
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'Services', url: `${baseUrl}/#services` }
          ])
        ]
      };

    case 'service-detail': {
      const targetService = SERVICES_DATA.find(s => s.id === articleSlug) || SERVICES_DATA[0];
      const serviceTitle = `${targetService.title} Sharjah | Smart Life Typing`;
      const serviceDesc = `${targetService.shortDesc} Fast typing & document processing in Sharjah. ${targetService.requiredDocuments.length} key required documents. Official processing time: ${targetService.processingTime}.`;
      const serviceUrl = `${baseUrl}/#service/${targetService.id}`;

      return {
        title: serviceTitle,
        description: serviceDesc,
        canonicalUrl: serviceUrl,
        ogTitle: `${targetService.title} - Government Typing Sharjah`,
        ogDescription: targetService.shortDesc,
        ogImage: PAGE_SHARE_IMAGES.services,
        ogType: 'service',
        twitterCard: 'summary_large_image',
        twitterTitle: serviceTitle,
        twitterDescription: targetService.shortDesc,
        twitterImage: PAGE_SHARE_IMAGES.services,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            "name": `${targetService.title} Sharjah`,
            "serviceType": targetService.categoryLabel || "Government Typing Service",
            "description": targetService.shortDesc,
            "provider": {
              "@type": "LocalBusiness",
              "name": "Smart Life Typing Services Sharjah"
            },
            "areaServed": "Sharjah & All UAE Emirates"
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'Services', url: `${baseUrl}/#services` },
            { name: targetService.title, url: serviceUrl }
          ])
        ]
      };
    }



    case 'branches':
      return {
        title: 'Sharjah Branch Locations & Contact Details | Smart Life Typing',
        description: 'Visit our customer service counters in Abu Shagara (Mirza Building) and Al Majaz 1 (Safeer Building), Sharjah. Phone: +971 55 158 5570. Hours: Sat - Thu 8am - 10pm.',
        canonicalUrl: `${baseUrl}/#branches`,
        ogTitle: 'Sharjah Branch Locations & Contact | Smart Life Typing',
        ogDescription: 'Abu Shagara Main Branch & Al Majaz 1 Branch 1. Direct phone, Google Maps directions, and working hours.',
        ogImage: PAGE_SHARE_IMAGES.branches,
        ogType: 'place',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Sharjah Office Locations | Smart Life Typing Services',
        twitterDescription: 'Abu Shagara & Al Majaz 1 customer service counters in Sharjah, UAE.',
        twitterImage: PAGE_SHARE_IMAGES.branches,
        jsonLd: [
          LOCAL_BUSINESS_SCHEMA,
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'Branches', url: `${baseUrl}/#branches` }
          ])
        ]
      };

    case 'reviews':
      return {
        title: '240+ Verified 5-Star Google Reviews | Smart Life Typing Sharjah',
        description: 'Read real verified customer reviews and 4.9-star ratings for Smart Life Typing Services in Sharjah. See why 10,000+ residents trust us for fast visa and document clearances.',
        canonicalUrl: `${baseUrl}/#reviews`,
        ogTitle: '240+ Verified 5-Star Google Reviews | Smart Life Typing Sharjah',
        ogDescription: 'Top-rated government typing center in Sharjah with 4.9 stars across 240+ verified Google customer reviews.',
        ogImage: PAGE_SHARE_IMAGES.reviews,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: '5-Star Google Reviews | Smart Life Typing Sharjah',
        twitterDescription: 'Trusted typing and visa center in Sharjah backed by 240+ verified customer reviews.',
        twitterImage: PAGE_SHARE_IMAGES.reviews,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            "itemReviewed": {
              "@type": "LocalBusiness",
              "name": "Smart Life Typing Services Sharjah",
              "image": PAGE_SHARE_IMAGES.reviews,
              "telephone": "+971-55-158-5570"
            },
            "ratingValue": "4.9",
            "reviewCount": "240",
            "bestRating": "5"
          },
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'Reviews', url: `${baseUrl}/#reviews` }
          ])
        ]
      };

    case 'company':
      return {
        title: 'About Smart Life Typing Services | Official Government Partner Sharjah',
        description: 'Learn about Smart Life Typing Services in Sharjah, UAE. Over 10 years of professional government document typing, legal translation, and visa clearances.',
        canonicalUrl: `${baseUrl}/#company`,
        ogTitle: 'About Smart Life Typing Services | Official Sharjah Typing Center',
        ogDescription: 'Dedicated documentation specialists providing error-free typing, visa clearance, and customer satisfaction across all 7 Emirates.',
        ogImage: PAGE_SHARE_IMAGES.company,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'About Smart Life Typing Services Sharjah',
        twitterDescription: 'Over 10 years of trusted government document processing in Sharjah, UAE.',
        twitterImage: PAGE_SHARE_IMAGES.company,
        jsonLd: [
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'About Us', url: `${baseUrl}/#company` }
          ])
        ]
      };

    case 'blog':
      return {
        title: 'UAE Visa Rules & Government Guides 2026 | Smart Life Typing',
        description: 'Official guides and updates on Sharjah Family Residence Visa, Golden Visa rules, MoHRE Labour Contracts, Certificate Attestation, and Indian Passport Renewal.',
        canonicalUrl: `${baseUrl}/#blog`,
        ogTitle: 'UAE Visa & Government Documentation Guides 2026 | Smart Life',
        ogDescription: 'Step-by-step legal guides written by document specialists in Sharjah, UAE.',
        ogImage: PAGE_SHARE_IMAGES.blog,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'UAE Visa & Government Guides 2026',
        twitterDescription: 'Expert step-by-step guides for Sharjah family visas, attestation, & passport renewal.',
        twitterImage: PAGE_SHARE_IMAGES.blog,
        jsonLd: [
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'Guides', url: `${baseUrl}/#blog` }
          ])
        ]
      };

    case 'blog-article': {
      const article = BLOG_POSTS.find(p => p.slug === articleSlug) || BLOG_POSTS[0];
      const articleUrl = `${baseUrl}/#guide/${article.slug}`;
      const articleTitle = `${article.title} | Smart Life Guide`;
      const articleDesc = article.summary;

      return {
        title: articleTitle,
        description: articleDesc,
        canonicalUrl: articleUrl,
        ogTitle: article.title,
        ogDescription: articleDesc,
        ogImage: PAGE_SHARE_IMAGES.blog,
        ogType: 'article',
        twitterCard: 'summary_large_image',
        twitterTitle: article.title,
        twitterDescription: articleDesc,
        twitterImage: PAGE_SHARE_IMAGES.blog,
        jsonLd: [
          generateArticleSchema(article),
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'Guides', url: `${baseUrl}/#blog` },
            { name: article.title, url: articleUrl }
          ])
        ]
      };
    }

    case 'faq':
      return {
        title: 'Frequently Asked Questions & Answers | Smart Life Typing Sharjah',
        description: 'Find clear answers to common questions on Sharjah family visa salary limits, medical fitness typing times, Emirates ID processing, MoFA attestation, and branch timings.',
        canonicalUrl: `${baseUrl}/#faq`,
        ogTitle: 'Sharjah Visa & Typing FAQ | Smart Life Typing Services',
        ogDescription: 'Instant answers to your top UAE government typing and visa questions.',
        ogImage: PAGE_SHARE_IMAGES.faq,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Sharjah Visa & Typing FAQ | Smart Life Services',
        twitterDescription: 'Answers to family visa limits, medical typing, Emirates ID, and attestation.',
        twitterImage: PAGE_SHARE_IMAGES.faq,
        jsonLd: [
          FAQ_SCHEMA,
          generateBreadcrumbSchema([
            { name: 'Home', url: baseUrl },
            { name: 'FAQ', url: `${baseUrl}/#faq` }
          ])
        ]
      };

    default:
      return {
        title: 'Smart Life Typing Services Sharjah | Family Visa & Government Documentation',
        description: 'Trusted UAE typing and visa center in Sharjah.',
        canonicalUrl: baseUrl,
        ogTitle: 'Smart Life Typing Services Sharjah',
        ogDescription: 'Trusted UAE typing and visa center in Sharjah.',
        ogImage: PAGE_SHARE_IMAGES.home,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Smart Life Typing Services Sharjah',
        twitterDescription: 'Trusted UAE typing and visa center in Sharjah.',
        twitterImage: PAGE_SHARE_IMAGES.home
      };
  }
}

// Applies metadata dynamically to document head tags
export function updateDomMetadata(config: PageSeoConfig) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = config.title;

  // Helper to set or create meta tag
  const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
    let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrVal);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', contentVal);
  };

  // Helper to set or create link tag
  const setLink = (relVal: string, hrefVal: string) => {
    let link = document.querySelector(`link[rel="${relVal}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', relVal);
      document.head.appendChild(link);
    }
    link.setAttribute('href', hrefVal);
  };

  // 2. Standard Meta Tags
  setMeta('name', 'description', config.description);
  setLink('canonical', config.canonicalUrl);

  // 3. OpenGraph Tags
  setMeta('property', 'og:title', config.ogTitle);
  setMeta('property', 'og:description', config.ogDescription);
  setMeta('property', 'og:image', config.ogImage);
  setMeta('property', 'og:url', config.canonicalUrl);
  setMeta('property', 'og:type', config.ogType);
  setMeta('property', 'og:site_name', 'Smart Life Typing Services Sharjah');

  // 4. Twitter Card Tags
  setMeta('name', 'twitter:card', config.twitterCard);
  setMeta('name', 'twitter:title', config.twitterTitle);
  setMeta('name', 'twitter:description', config.twitterDescription);
  setMeta('name', 'twitter:image', config.twitterImage);

  // 5. Dynamic JSON-LD Scripts
  const existingDynamicLds = document.querySelectorAll('script[data-seo-dynamic="true"]');
  existingDynamicLds.forEach(el => el.remove());

  if (config.jsonLd && config.jsonLd.length > 0) {
    config.jsonLd.forEach((schemaObj, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-dynamic', 'true');
      script.id = `seo-dynamic-schema-${idx}`;
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }
}
