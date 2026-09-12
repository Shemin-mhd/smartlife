import React, { useState } from 'react';
import { FileCheck, Search, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem } from '../types';

interface DocumentChecklistSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const DocumentChecklistSection: React.FC<DocumentChecklistSectionProps> = ({ onSelectService }) => {
  const [docFilter, setDocFilter] = useState('');
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  const toggleExpandService = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const featuredServices = SERVICES_DATA.filter((s) => {
    if (!docFilter) return s.isPopular;
    return (
      s.title.toLowerCase().includes(docFilter.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(docFilter.toLowerCase())
    );
  });

  return (
    <section id="documents" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Instant Pre-Check</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Document Requirements & Checklists
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Know exactly what documents you need before applying. Save time by preparing your passport, tenancy contract, salary certificate, or photographs in advance.
          </p>
        </div>

        {/* Filter Input */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={docFilter}
            onChange={(e) => setDocFilter(e.target.value)}
            placeholder="Search service checklist e.g., Family Visa, Attestation..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 shadow-xs"
          />
        </div>

        {/* Requirements Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredServices.slice(0, 6).map((service) => {
            const isExpanded = !!expandedServices[service.id];
            const visibleDocs = isExpanded
              ? service.requiredDocuments
              : service.requiredDocuments.slice(0, 4);

            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors min-w-0 overflow-hidden h-full"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    • {service.categoryLabel}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2 mb-3">
                    {service.title}
                  </h3>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {visibleDocs.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className={isExpanded ? 'leading-relaxed text-slate-800 font-medium break-words min-w-0' : 'line-clamp-2 min-w-0'}>
                          {doc}
                        </span>
                      </li>
                    ))}
                    {service.requiredDocuments.length > 4 && (
                      <li className="pl-5 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => toggleExpandService(service.id, e)}
                          className="text-[11px] text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors"
                        >
                          {isExpanded
                            ? '− Show fewer requirements'
                            : `+ ${service.requiredDocuments.length - 4} more document requirements`}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onSelectService(service)}
                  className="w-full flex items-center justify-between text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <span>View Complete Checklist</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        </div>

      </div>
    </section>
  );
};
