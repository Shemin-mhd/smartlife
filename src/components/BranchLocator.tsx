import React from 'react';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Navigation, Building2, CheckCircle } from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

export const BranchLocator: React.FC = () => {
  return (
    <section id="branches" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sharjah Office Locations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit Our Offices in Sharjah
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We operate two convenient branches in Sharjah to serve you quickly. Drop by or initiate your document typing through WhatsApp.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {BRANCHES_DATA.map((branch) => (
            <div
              key={branch.id}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Branch Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      branch.isMain ? 'text-blue-700' : 'text-emerald-700'
                    }`}
                  >
                    {branch.isMain ? '★ MAIN BRANCH' : 'BRANCH 1'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{branch.city}, UAE</span>
                  </span>
                </div>

                {/* Branch Name */}
                <h3 className="text-xl font-extrabold text-slate-900">
                  {branch.name}
                </h3>

                {/* Address Details */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">{branch.area}, {branch.city}</strong>
                      <p className="text-slate-600">{branch.address}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Landmark: {branch.landmark}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Working Hours:</strong> {branch.workingHours} ({branch.workingDays})
                    </span>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Express Typing Counters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Document Intake Available</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${branch.phoneRaw}`}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {branch.area}</span>
                </a>

                <a
                  href={branch.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Remote WhatsApp Assistance Banner */}
        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-3 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900">
            Can't visit our office in person?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            You don't need to visit our office for many services! You can start your visa, attestation, or passport typing process online via WhatsApp by sending clear document copies.
          </p>
          <a
            href={getWhatsAppLink({ message: 'Hi Smart Life Typing, I want to start my service application online through WhatsApp.' })}
            onClick={() => {
              trackAndOpenWhatsApp({
                buttonLocation: 'Branch Locator Online Intake Banner',
                contextDetails: 'Branch Locator - Start Online Application'
              });
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Start Application via WhatsApp Now</span>
          </a>
        </div>

      </div>
    </section>
  );
};
