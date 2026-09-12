import React, { useState, useEffect } from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { CategoryItem, ServiceCategory, ServiceItem } from '../types';
import { subscribeServices } from '../firebase/dbServices';
import { subscribeCategories } from '../firebase/dbCategories';
import { DEFAULT_CATEGORIES } from '../data/categoriesData';
import { 
  Search, 
  FileText, 
  Clock, 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  X,
  Filter
} from 'lucide-react';

interface ServicesPageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectServiceDocs: (service: ServiceItem) => void;
  onNavigate?: (page: string, slug?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectServiceDocs,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const mainBranch = BRANCHES_DATA[0];

  const toggleExpandService = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

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

  const filteredServices = servicesList.filter((service) => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      service.title.toLowerCase().includes(q) ||
      service.shortDesc.toLowerCase().includes(q) ||
      service.fullDesc.toLowerCase().includes(q) ||
      (service.keywords ? service.keywords.some((k) => k.toLowerCase().includes(q)) : false);

    return matchesCategory && matchesQuery;
  });

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: 'All Services' },
    ...categoriesList.map(c => ({ id: c.id, label: c.label }))
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 min-w-0 overflow-x-hidden">
      {/* Clean Light Page Header */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-8 space-y-3 sm:space-y-4 min-w-0 overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>UAE Typing & Legal Documentation</span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Government & Typing Services
          </h1>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Browse our full range of typing, residence visa processing, Indian passport renewal, certificate attestation, and MoHRE labor solutions for individuals, families, and businesses.
          </p>

          {/* Inline Search Bar */}
          <div className="pt-1 sm:pt-2">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service e.g., Family Visa, Attestation..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 scrollbar-none min-w-0">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-blue-700 text-white font-semibold shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>Showing <strong>{filteredServices.length}</strong> typing services</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-700 hover:underline font-semibold"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <p className="text-slate-700 font-bold text-lg">No matching typing service found</p>
          <p className="text-slate-500 text-xs">
            Try adjusting your search query or select another category filter above.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          {filteredServices.map((service) => {
            const isExpanded = !!expandedServices[service.id];
            const visibleDocs = isExpanded
              ? service.requiredDocuments
              : service.requiredDocuments.slice(0, 3);

            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between min-w-0 overflow-hidden h-auto"
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
                    data-wa-location="Services Catalog Card"
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

                {service.officialPortalUrl && (
                  <a
                    href={service.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-700 pt-1"
                  >
                    <span>Official Portal: {service.officialPortalName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
