import React, { useState, useEffect, useMemo } from 'react';
import { Hero } from '../components/Hero';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import { ClientsSection } from '../components/ClientsSection';
import { SERVICES_DATA } from '../data/servicesData';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { COMPANY_STORY, COMPANY_VALUES } from '../data/companyData';
import { BLOG_POSTS } from '../data/blogData';
import { ServiceItem } from '../types';
import { subscribeServices } from '../firebase/dbServices';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Building2,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HomePageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onSelectServiceDocs: (service: ServiceItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  setSearchQuery,
  onNavigate,
  onSelectServiceDocs,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [showAllPopular, setShowAllPopular] = useState(false);
  const mainBranch = BRANCHES_DATA[0];

  const toggleExpandService = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  useEffect(() => {
    const unsubscribe = subscribeServices((liveServices) => {
      if (liveServices && liveServices.length > 0) {
        setServicesList(liveServices);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter services marked as popular, fallback to top services if fewer than 3 marked
  const popularServices = useMemo(() => {
    const popular = servicesList.filter((s) => !!s.isPopular);
    if (popular.length >= 3) return popular;
    const setIds = new Set(popular.map((s) => s.id));
    const fill = servicesList.filter((s) => !setIds.has(s.id));
    return [...popular, ...fill];
  }, [servicesList]);

  const displayedPopularServices = useMemo(() => {
    return showAllPopular ? popularServices : popularServices.slice(0, 3);
  }, [popularServices, showAllPopular]);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Header Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExploreServices={() => onNavigate('services')}
        onCheckDocuments={() => onNavigate('documents')}
        onNavigate={onNavigate}
        onSelectServiceDocs={onSelectServiceDocs}
      />

      {/* Featured Services Overview (Right after Hero & before Corporate Clients) */}
      {popularServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Core Government & Visa Solutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Most Popular Services
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Our top-requested residence visa processing, legal attestation, and MoHRE labor typing solutions
              </p>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <span>Explore Full Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Services Cards Grid - Independent height cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {popularServices.slice(0, 3).map((service) => {
              const isExpanded = !!expandedServices[service.id];
              const visibleDocs = isExpanded
                ? service.requiredDocuments
                : service.requiredDocuments.slice(0, 3);

              return (
                <div
                  key={service.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between min-w-0 overflow-hidden h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                        • {service.categoryLabel}
                      </span>
                      {(service.isPopular || service.badgeTag) && (
                        <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs shrink-0">
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                          {service.badgeTag ? service.badgeTag.toUpperCase() : 'POPULAR'}
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => onNavigate && onNavigate('service-detail', service.id)}
                      className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-blue-700 transition-colors"
                    >
                      {service.title}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Turnaround Time */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Processing Time: <strong className="text-slate-800">{service.processingTime}</strong></span>
                    </div>

                    {/* Required Documents Highlight Preview */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Key Required Documents ({service.requiredDocuments.length}):
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {visibleDocs.map((doc, i) => (
                          <li key={i} className="flex items-start gap-1.5 min-w-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className={isExpanded ? 'leading-relaxed text-slate-800 font-medium break-words min-w-0' : 'truncate min-w-0'}>
                              {doc}
                            </span>
                          </li>
                        ))}
                        {service.requiredDocuments.length > 3 && (
                          <li className="pl-5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => toggleExpandService(service.id, e)}
                              className="text-[11px] text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                            >
                              {isExpanded
                                ? '− Show fewer items'
                                : `+${service.requiredDocuments.length - 3} more items in checklist`}
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectServiceDocs(service)}
                        className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2.5 sm:py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-w-0"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">View Docs Checklist</span>
                      </button>
                      <a
                        href={getWhatsAppLink({ serviceTitle: service.title })}
                        data-wa-location="Homepage Service Card"
                        data-wa-context={`Service: ${service.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 sm:py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
                        title="Inquire via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Corporate Clients Section - Directly Below Services */}
      <ClientsSection />

      {/* Google Business Profile & Customer Reviews Section - Below Clients */}
      <GoogleReviewsSection onNavigate={onNavigate} />

      {/* Company Overview & Trust Pillars - Below Reviews */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>About Smart Life Typing Services</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {COMPANY_STORY.heading}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {COMPANY_STORY.aboutText[0]}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
              {COMPANY_STORY.stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <p className="text-2xl font-black text-blue-700">{stat.value}</p>
                  <p className="text-[11px] text-slate-600 font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('company')}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <span>Discover Our Company Story & Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid gap-4">
            {COMPANY_VALUES.slice(0, 3).map((val, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{val.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sharjah Branch Locations Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Two Sharjah Locations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Visit Our Typing Centers in Sharjah
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Located conveniently in Abu Shagara & Al Majaz 1 with extended working hours
              </p>
            </div>
            <button
              onClick={() => onNavigate('branches')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <span>View Branch Maps & Hours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BRANCHES_DATA.map((branch) => (
              <div key={branch.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-slate-300 transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                      • {branch.isMain ? 'MAIN BRANCH' : 'BRANCH 2'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{branch.name}</h3>
                  </div>
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {branch.address}
                </p>

                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Working Hours:</span>
                    <span className="font-semibold text-slate-800">{branch.workingHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Phone Number:</span>
                    <a href={`tel:${branch.phoneRaw}`} className="font-bold text-blue-700 hover:underline">
                      {branch.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={branch.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Maps</span>
                  </a>
                  <a
                    href={getWhatsAppLink({ branchName: branch.area })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog & Guidance Articles Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>UAE Government Rules & Guidance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Typing & Visa Guides
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Stay informed on current UAE visa rules, attestation steps, and passport renewals
            </p>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {BLOG_POSTS.slice(0, 2).map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-blue-700 text-xs uppercase tracking-wider">
                  • {post.category}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{post.summary}</p>
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onNavigate('blog-article', post.slug)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
