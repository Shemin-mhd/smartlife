import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BookCheck,
  ArrowRight
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem } from '../types';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { subscribeServices } from '../firebase/dbServices';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreServices: () => void;
  onCheckDocuments: () => void;
  onNavigate?: (page: string, slug?: string) => void;
  onSelectServiceDocs?: (service: ServiceItem) => void;
}

// Featured Showcase Cards for Hero Section
const SLIDING_CARDS = [
  {
    id: 'indian-passport',
    title: 'Indian Passport Renewal Services',
    category: 'Indian Consular Services',
    image: '/images/cards/card_indian_passport.png',
    whatsappMsg: 'Hi Smart Life Typing, I need information regarding Indian Passport Renewal Services.'
  },
  {
    id: 'family-visa',
    title: 'All Emirates Family Visa Services (New / Renewal)',
    category: 'Visas & Immigration',
    image: '/images/cards/card_family_visa.png',
    whatsappMsg: 'Hi Smart Life Typing, I need information regarding All Emirates Family Visa Services.'
  },
  {
    id: 'tourist-visa',
    title: 'UAE Tourist Visa & Visit Visa Services',
    category: 'Visas & Immigration',
    image: '/images/cards/card_tourist_visa.png',
    whatsappMsg: 'Hi Smart Life Typing, I need information regarding UAE Tourist Visa & Visit Visa Services.'
  }
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreServices,
  onCheckDocuments,
  onNavigate,
  onSelectServiceDocs,
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);

  useEffect(() => {
    const unsub = subscribeServices((liveServices) => {
      if (liveServices && liveServices.length > 0) {
        setServicesList(liveServices);
      }
    });
    return () => unsub();
  }, []);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveCardIndex((prevIndex) => (prevIndex + 1) % SLIDING_CARDS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onExploreServices();
  };

  // Search matching logic - flat listing of matching services
  const query = searchQuery.trim().toLowerCase();
  const hasQuery = query.length >= 1;

  const matchingResults = hasQuery
    ? servicesList.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.categoryLabel.toLowerCase().includes(query) ||
      s.shortDesc.toLowerCase().includes(query) ||
      (s.keywords && s.keywords.some(k => k.toLowerCase().includes(query))) ||
      (s.requiredDocuments && s.requiredDocuments.some(d => d.toLowerCase().includes(query)))
    ).slice(0, 6)
    : [];

  const totalResultsCount = matchingResults.length;

  const handleSelectService = (service: ServiceItem) => {
    setSearchQuery(service.title);
    setIsOpen(false);
    if (onSelectServiceDocs) {
      onSelectServiceDocs(service);
    } else {
      onExploreServices();
    }
  };

  const handleSelectDoc = (service: ServiceItem) => {
    setSearchQuery(`${service.title} Documents`);
    setIsOpen(false);
    if (onSelectServiceDocs) {
      onSelectServiceDocs(service);
    } else if (onNavigate) {
      onNavigate('documents');
    }
  };

  const handleSelectBlog = (slug: string, title: string) => {
    setSearchQuery(title);
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('blog-article', slug);
    }
  };

  const handleSelectFaq = (question: string) => {
    setSearchQuery(question);
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('faq');
    }
  };

  const handleBookPassport = () => {
    const passportService = servicesList.find(
      s => s.id === 'indian-passport-renewal' || 
           s.category === 'indian_consulate' || 
           s.title.toLowerCase().includes('passport')
    ) || SERVICES_DATA.find(s => s.id === 'indian-passport-renewal');

    if (passportService && onSelectServiceDocs) {
      onSelectServiceDocs(passportService);
    } else if (onNavigate) {
      onNavigate('service-detail', 'indian-passport-renewal');
    } else {
      onExploreServices();
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 via-blue-50/20 to-white py-6 sm:py-10 lg:py-12 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">

          {/* Left Column: Copy & Search */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smart Life Typing Services
              <span className="block text-blue-700 font-bold text-xl sm:text-3xl lg:text-4xl mt-1 sm:mt-1.5">
                Your Reliable Partner for UAE Visa, Typing & Government Services
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl font-medium">
              Trusted UAE-based typing, visa, and government services provider delivering fast, accurate, and professional solutions for individuals, families, and businesses across all 7 Emirates.
            </p>

            {/* Quick Search Container with Live Auto-Suggestions */}
            <div ref={searchRef} className="relative max-w-xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 sm:left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  placeholder="Search service, documents, e.g., Family Visa, SEWA..."
                  className="w-full pl-9 sm:pl-11 pr-24 sm:pr-32 py-2.5 sm:py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm font-medium shadow-2xs transition-all"
                />

                {/* Clear Input Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsOpen(false);
                    }}
                    className="absolute right-20 sm:right-24 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1 sm:right-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Find Service</span>
                </button>
              </form>

              {/* Clean Auto-Suggestions (Flat Listing Type) */}
              {isOpen && hasQuery && matchingResults.length > 0 && (
                <div className="mt-2 sm:mt-3 bg-white border border-slate-200/90 rounded-xl shadow-md overflow-hidden divide-y divide-slate-100 text-slate-900 max-h-[300px] sm:max-h-[340px] overflow-y-auto z-30 relative">
                  {matchingResults.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className="px-3.5 sm:px-4 py-2.5 sm:py-3 hover:bg-blue-50/60 transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-0.5 sm:space-y-1 max-w-[85%] min-w-0">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {service.title}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                            {service.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {service.shortDesc}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Action Buttons Section */}
            <div className="space-y-2.5 sm:space-y-3 pt-0.5 max-w-xl">
              {/* Top Featured Button: Book Your Passport */}
              <button
                type="button"
                onClick={handleBookPassport}
                className="w-full flex items-center justify-between bg-blue-700 hover:bg-blue-800 text-white p-2.5 sm:px-5 sm:py-3 rounded-xl transition-all shadow-md shadow-blue-700/20 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-800/90 flex items-center justify-center shrink-0 border border-blue-500/50">
                    <BookCheck className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="text-left min-w-0 flex-1 pr-1.5">
                    <div className="text-xs sm:text-sm font-bold leading-tight truncate text-white">
                      Book Your Passport Appointment
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-blue-200 font-medium truncate mt-0.5">
                      Indian Passport Renewal, Form Preparation & Checklist
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold bg-white text-blue-800 px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs group-hover:bg-blue-50 transition-colors shrink-0">
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Two Bottom Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
                <a
                  href={getWhatsAppLink({ message: 'Hi Smart Life Typing Services, I need help with UAE visa & government documentation.' })}
                  onClick={(e) => {
                    e.stopPropagation();
                    trackAndOpenWhatsApp({
                      buttonLocation: 'Hero Primary CTA',
                      contextDetails: 'Hero - Instant WhatsApp Inquiry'
                    });
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                  <span>Instant WhatsApp Inquiry</span>
                </a>

                <button
                  type="button"
                  onClick={onExploreServices}
                  className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                >
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Browse Services Catalog</span>
                </button>
              </div>
            </div>

            {/* Key Trust Highlights - Fully wrapping & non-overflowing */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 sm:pt-2 text-[11px] sm:text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 7 Emirates Covered</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Accurate Typing</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fast Turnaround</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean HTML/CSS SaaS 2-Card Feature Showcase Deck with Floating Animations */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-4 sm:py-6 lg:py-4 min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
            <style>{`
              @keyframes floatCard1 {
                0%, 100% { transform: translateY(0px) rotate(-1deg); }
                50% { transform: translateY(-8px) rotate(-1deg); }
              }
              @keyframes floatCard2 {
                0%, 100% { transform: translateY(0px) rotate(1deg); }
                50% { transform: translateY(-10px) rotate(1deg); }
              }
              .animate-float-1 {
                animation: floatCard1 6s ease-in-out infinite;
              }
              .animate-float-2 {
                animation: floatCard2 6s ease-in-out 3s infinite;
              }
            `}</style>

            <div className="relative w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[540px] h-[360px] sm:h-[430px] lg:h-[470px] flex items-center justify-center">

              {/* Card 1: Dynamic Family Visa Service Card */}
              {(() => {
                const card1 = servicesList.find(s => s.id === 'family-visa' || s.title.toLowerCase().includes('family')) || servicesList[0];
                if (!card1) return null;
                const visibleDocs = (card1.requiredDocuments || []).slice(0, 3);
                const extraDocsCount = Math.max(0, (card1.requiredDocuments || []).length - 3);

                return (
                  <div
                    onClick={() => {
                      if (onSelectServiceDocs) {
                        onSelectServiceDocs(card1);
                      } else {
                        onExploreServices();
                      }
                    }}
                    className="absolute left-0 sm:left-2 top-0 sm:top-2 w-[88%] max-w-[280px] sm:max-w-none sm:w-[335px] bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform-gpu cursor-pointer z-10 hover:z-30 hover:scale-105 animate-float-1 group"
                  >
                    <div className="space-y-2.5 sm:space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                          • {card1.categoryLabel || 'Visas & Immigration'}
                        </span>
                        {card1.isPopular && (
                          <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs shrink-0">
                            <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                            {card1.badgeTag ? card1.badgeTag.toUpperCase() : 'POPULAR'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                        {card1.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {card1.shortDesc}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-800 bg-blue-50/80 p-1.5 sm:p-2 rounded-lg border border-blue-100">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">Time: <strong className="text-slate-900">{card1.processingTime}</strong></span>
                      </div>

                      <div className="space-y-1 pt-0.5 hidden xs:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Key Required Documents ({card1.requiredDocuments?.length || 0}):
                        </p>
                        <ul className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs text-slate-700">
                          {visibleDocs.map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="truncate min-w-0">{d}</span>
                            </li>
                          ))}
                          {extraDocsCount > 0 && (
                            <li className="pl-5 text-[10px] sm:text-[11px] font-bold text-blue-700">
                              +{extraDocsCount} more items
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-400" />
                        <span>View Docs</span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 fill-current" />
                        <span>WhatsApp</span>
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Card 2: Dynamic Certificate Attestation Service Card */}
              {(() => {
                const card2 = servicesList.find(s => s.id === 'certificate-attestation' || s.title.toLowerCase().includes('attestation')) || servicesList[1] || servicesList[0];
                if (!card2) return null;
                const visibleDocs = (card2.requiredDocuments || []).slice(0, 3);
                const extraDocsCount = Math.max(0, (card2.requiredDocuments || []).length - 3);

                return (
                  <div
                    onClick={() => {
                      if (onSelectServiceDocs) {
                        onSelectServiceDocs(card2);
                      } else {
                        onExploreServices();
                      }
                    }}
                    className="absolute right-0 sm:right-2 bottom-0 sm:bottom-2 w-[88%] max-w-[285px] sm:max-w-none sm:w-[340px] bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-2xl hover:shadow-2xl transition-all duration-300 transform-gpu cursor-pointer z-20 hover:z-30 hover:scale-105 animate-float-2 group"
                  >
                    <div className="space-y-2.5 sm:space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                          • {card2.categoryLabel || 'Certificate Attestation'}
                        </span>
                        {card2.isPopular && (
                          <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs shrink-0">
                            <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                            {card2.badgeTag ? card2.badgeTag.toUpperCase() : 'POPULAR'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                        {card2.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {card2.shortDesc}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-800 bg-blue-50/80 p-1.5 sm:p-2 rounded-lg border border-blue-100">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">Time: <strong className="text-slate-900">{card2.processingTime}</strong></span>
                      </div>

                      <div className="space-y-1 pt-0.5 hidden xs:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Key Required Documents ({card2.requiredDocuments?.length || 0}):
                        </p>
                        <ul className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs text-slate-700">
                          {visibleDocs.map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="truncate min-w-0">{d}</span>
                            </li>
                          ))}
                          {extraDocsCount > 0 && (
                            <li className="pl-5 text-[10px] sm:text-[11px] font-bold text-blue-700">
                              +{extraDocsCount} more items
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-400" />
                        <span>View Docs</span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 fill-current" />
                        <span>WhatsApp</span>
                      </span>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
