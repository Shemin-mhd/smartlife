import React, { useState } from 'react';
import { CORPORATE_CLIENTS, ClientItem } from '../data/clientsData';
import { Building2, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

export const ClientsSection: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Duplicate items to ensure a smooth, continuous infinite loop
  const marqueeItems = [...CORPORATE_CLIENTS, ...CORPORATE_CLIENTS];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5 text-blue-700" />
          <span>Corporate PRO & Business Client Network</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Trusted Corporate & Business Partners
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-3xl">
          Managing official government documentation, MoHRE labour quotas, and employee visas for leading commercial enterprises across Sharjah & the UAE
        </p>
      </div>

      {/* Horizontal Auto-Scrolling Marquee Container */}
      <div className="relative overflow-hidden w-full py-2">
        {/* Soft Side Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-slow flex items-center gap-4">
          {marqueeItems.map((client: ClientItem, idx: number) => {
            const itemKey = `${client.id}-${idx}`;
            const hasImageError = imageErrors[client.id];

            return (
              <div
                key={itemKey}
                className="w-48 sm:w-56 h-32 shrink-0 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center text-center shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all group overflow-hidden relative"
              >
                {client.logoUrl && !hasImageError ? (
                  client.fillBox ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      onError={() => handleImageError(client.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      onError={() => handleImageError(client.id)}
                      className="max-h-20 max-w-[85%] object-contain p-2 group-hover:scale-105 transition-all duration-300"
                    />
                  )
                ) : (
                  /* Professional Fallback Corporate Badge */
                  <div className="flex flex-col items-center justify-center space-y-1 p-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 font-extrabold text-xs tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {client.name
                        .split(' ')
                        .map((word) => word[0])
                        .filter(Boolean)
                        .slice(0, 3)
                        .join('')}
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                      {client.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium line-clamp-1">
                      {client.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seamless Integrated Corporate PRO Service Line */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Corporate PRO & Commercial Accounts Desk
            </h3>
            <p className="text-slate-600 text-xs mt-0.5">
              Dedicated document clearance specialists for trade licenses, MoHRE labour contracts, EJARI, & corporate employee visas.
            </p>
          </div>
        </div>

        <a
          href={getWhatsAppLink({ serviceTitle: 'Corporate PRO & Commercial Account Inquiry' })}
          onClick={() => {
            trackAndOpenWhatsApp({
              buttonLocation: 'Corporate Clients Section Banner',
              serviceTitle: 'Corporate PRO Account Inquiry',
              contextDetails: 'Corporate Partners Banner'
            });
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-extrabold text-xs group cursor-pointer shrink-0"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 fill-current" />
          <span className="underline decoration-blue-300 underline-offset-4 group-hover:decoration-blue-700 transition-colors">
            Contact Corporate PRO Specialist
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-700 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};
