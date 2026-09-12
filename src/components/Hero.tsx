import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem } from '../types';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreServices: () => void;
  onCheckDocuments: () => void;
  onNavigate?: (page: string, slug?: string) => void;
  onSelectServiceDocs?: (service: ServiceItem) => void;
}

// 3 Featured Service Cards for 3D Cover Flow Deck Slider
const SLIDING_CARDS = [
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
  },
  {
    id: 'indian-passport',
    title: 'Indian Passport Renewal Services (BLS Approved)',
    category: 'BLS Indian Consulate',
    image: '/images/cards/card_indian_passport.png',
    whatsappMsg: 'Hi Smart Life Typing, I need information regarding Indian Passport Renewal Services.'
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

  // Auto-slide to the right every 3.5 seconds
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
    ? SERVICES_DATA.filter(s =>
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

  return (
    <section className="bg-gradient-to-b from-slate-50 via-blue-50/20 to-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Copy & Search */}
          <div className="lg:col-span-6 space-y-5">

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smart Life Typing Services
              <span className="block text-blue-700 font-bold text-2xl sm:text-3xl lg:text-4xl mt-1.5">
                Your Reliable Partner for UAE Visa, Typing & Government Services
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Trusted UAE-based typing, visa, and government services provider delivering fast, accurate, and professional solutions for individuals, families, and businesses across all 7 Emirates.
            </p>

            {/* Quick Search Container with Live Auto-Suggestions */}
            <div ref={searchRef} className="relative max-w-xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  placeholder="Search service, documents, or guides e.g., Family Visa, BLS, SEWA..."
                  className="w-full pl-11 pr-32 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium shadow-2xs transition-all"
                />

                {/* Clear Input Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsOpen(false);
                    }}
                    className="absolute right-24 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Find Service</span>
                </button>
              </form>

              {/* Clean Auto-Suggestions (Flat Listing Type) */}
              {isOpen && hasQuery && matchingResults.length > 0 && (
                <div className="mt-3 bg-white border border-slate-200/90 rounded-xl shadow-md overflow-hidden divide-y divide-slate-100 text-slate-900 max-h-[340px] overflow-y-auto">
                  {matchingResults.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className="px-4 py-3 hover:bg-blue-50/60 transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1 max-w-[85%] min-w-0">
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

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
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
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Inquiry</span>
              </a>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Browse Services Catalog</span>
              </button>
            </div>

            {/* Key Trust Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 7 Emirates Covered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Accurate Typing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fast Turnaround</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D COVER FLOW CARD DECK STACK SLIDER (Exact match to Reference Image) */}
          <div className="lg:col-span-6 relative flex justify-center py-4">
            <div
              className="relative w-full max-w-[500px] h-[380px] sm:h-[420px] flex items-center justify-center perspective-1000"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {SLIDING_CARDS.map((card, idx) => {
                // Calculate position relative to activeCardIndex (0 = active, 1 = right, 2 = left)
                const position = (idx - activeCardIndex + SLIDING_CARDS.length) % SLIDING_CARDS.length;

                let styleClass = '';
                let isCenter = false;

                if (position === 0) {
                  // Active Center Card
                  isCenter = true;
                  styleClass = 'translate-x-0 scale-100 z-30 opacity-100 shadow-2xl shadow-blue-900/25 cursor-pointer';
                } else if (position === 1) {
                  // Right Preview Card (Tilted & Receded)
                  styleClass = 'translate-x-[24%] sm:translate-x-[28%] scale-[0.82] z-10 opacity-50 filter blur-[0.5px] shadow-lg cursor-pointer hover:opacity-80 hover:scale-85';
                } else {
                  // Left Preview Card (Tilted & Receded)
                  styleClass = '-translate-x-[24%] sm:-translate-x-[28%] scale-[0.82] z-10 opacity-50 filter blur-[0.5px] shadow-lg cursor-pointer hover:opacity-80 hover:scale-85';
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (!isCenter) {
                        setActiveCardIndex(idx);
                      } else {
                        const matched = SERVICES_DATA.find(s => s.title.toLowerCase().includes(card.category.toLowerCase()) || card.title.toLowerCase().includes(s.title.toLowerCase()));
                        if (matched && onSelectServiceDocs) {
                          onSelectServiceDocs(matched);
                        } else {
                          onExploreServices();
                        }
                      }
                    }}
                    className={`absolute w-[290px] sm:w-[330px] rounded-2xl overflow-hidden transition-all duration-700 ease-out transform-gpu ${styleClass}`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-auto object-contain block rounded-2xl"
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
