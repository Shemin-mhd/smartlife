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
  BookOpen
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
  const mainBranch = BRANCHES_DATA[0];

  useEffect(() => {
    const unsubscribe = subscribeServices((liveServices) => {
      if (liveServices && liveServices.length > 0) {
        setServicesList(liveServices);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter ONLY services marked as featured / popular by the admin in Admin Panel (Max 6 limit)
  const popularServices = useMemo(() => {
    return servicesList.filter((s) => !!s.isPopular).slice(0, 6);
  }, [servicesList]);

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

      {/* Featured Services Overview (Hidden if no services are starred) */}
      {popularServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Core Government & Visa Solutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Typing Services
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Select from our most requested visa, legal attestation, and consular services
              </p>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Services Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      • {service.categoryLabel}
                    </span>
                    {(service.isPopular || service.badgeTag) && (
                      <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                        {service.badgeTag ? service.badgeTag.toUpperCase() : 'POPULAR'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Processing time badge */}
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Turnaround: <strong className="text-slate-800">{service.processingTime}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectServiceDocs(service)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Required Docs</span>
                  </button>
                  <a
                    href={getWhatsAppLink({ serviceTitle: service.title })}
                    data-wa-location="Homepage Service Card"
                    data-wa-context={`Service: ${service.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 fill-current" />
                    <span>Inquire</span>
                  </a>
                </div>
              </div>
            ))}
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
