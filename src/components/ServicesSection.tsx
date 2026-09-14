import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Search, Clock, ExternalLink, MessageSquare, CheckSquare, 
  FileCheck, Shield, Sparkles, BadgeCheck, Filter 
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { CategoryItem, ServiceCategory, ServiceItem } from '../types';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { subscribeServices } from '../firebase/dbServices';
import { subscribeCategories } from '../firebase/dbCategories';
import { DEFAULT_CATEGORIES } from '../data/categoriesData';

interface ServicesSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectServiceDocuments: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectServiceDocuments
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const mainBranch = BRANCHES_DATA[0];

  useEffect(() => {
    const unsubServices = subscribeServices((liveServices) => {
      if (liveServices && liveServices.length > 0) {
        setServicesList(liveServices);
      }
    });

    const unsubCategories = subscribeCategories((liveCategories) => {
      if (liveCategories && liveCategories.length > 0) {
        setCategoriesList(liveCategories);
      }
    });

    return () => {
      unsubServices();
      unsubCategories();
    };
  }, []);

  // Filter ONLY services marked as featured / popular by the admin for the homepage (Max 6 limit)
  const featuredOnlyServices = useMemo(() => {
    return servicesList.filter(s => !!s.isPopular).slice(0, 6);
  }, [servicesList]);

  const categories: { key: ServiceCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Featured', count: featuredOnlyServices.length },
    ...categoriesList.map(c => ({
      key: c.id,
      label: c.label,
      count: featuredOnlyServices.filter(s => s.category === c.id).length
    }))
  ];

  const filteredServices = useMemo(() => {
    return featuredOnlyServices.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesTitle = service.title.toLowerCase().includes(query);
      const matchesDesc = service.shortDesc.toLowerCase().includes(query) || service.fullDesc.toLowerCase().includes(query);
      const matchesKeywords = service.keywords ? service.keywords.some(kw => kw.toLowerCase().includes(query)) : false;

      return matchesCategory && (matchesTitle || matchesDesc || matchesKeywords);
    });
  }, [featuredOnlyServices, selectedCategory, searchQuery]);

  if (featuredOnlyServices.length === 0) {
    return null;
  }

  return (
    <section id="services" className="py-12 lg:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Comprehensive UAE Documentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Professional Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From family visa processing across all Emirates to Indian passport renewals, certificate attestations, and corporate PRO solutions.
          </p>
        </div>

        {/* Filters & Search Header Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.key
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory === cat.key
                      ? 'bg-blue-800 text-blue-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Sub-Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter services by keyword..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredServices.length}</span> featured services on homepage
            </p>
          </div>

        </div>

        {/* Services Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 max-w-lg mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No featured services currently active</h3>
            <p className="text-xs text-slate-500 px-4">
              Toggle the Badge/Star icon on services in your Admin Control Panel to feature them directly on the homepage.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-slate-800"
            >
              Reset Category Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group h-full"
              >
                <div className="space-y-3 flex-1 flex flex-col">
                  
                  {/* Category Badge & Popular Tag */}
                  <div className="flex items-center justify-between gap-2 min-h-[24px]">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      • {service.categoryLabel}
                    </span>
                    {service.isPopular && (
                      <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        {service.badgeTag ? service.badgeTag.toUpperCase() : 'POPULAR'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors leading-snug line-clamp-2 min-h-[2.75rem] flex items-start">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[2.25rem]">
                    {service.shortDesc}
                  </p>

                  {/* Processing Time Indicator */}
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium pt-1 min-h-[28px]">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Est. Time: <strong className="text-slate-800">{service.processingTime}</strong></span>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-auto border-t border-slate-100 space-y-2 shrink-0">
                  
                  {/* Check Documents Button */}
                  <button
                    onClick={() => onSelectServiceDocuments(service)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Required Documents ({service.requiredDocuments.length})</span>
                  </button>

                  {/* Direct WhatsApp Inquiry */}
                  <a
                    href={getWhatsAppLink({ serviceTitle: service.title })}
                    onClick={(e) => {
                      e.stopPropagation();
                      trackAndOpenWhatsApp({
                        buttonLocation: 'Services Catalog Card',
                        serviceTitle: service.title,
                        contextDetails: `Service: ${service.title}`
                      });
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>Inquire via WhatsApp</span>
                  </a>

                  {/* Official Portal Reference */}
                  <div className="h-5 flex items-center justify-center">
                    {service.officialPortalUrl ? (
                      <a
                        href={service.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        <span>Official Portal: {service.officialPortalName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
