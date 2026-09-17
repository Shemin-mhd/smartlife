import React, { useState } from 'react';
import { Search, ExternalLink, ShieldAlert, CheckCircle2, FileText, Info, HelpCircle } from 'lucide-react';
import { openCentralWhatsApp } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

export const VisaStatusHelper: React.FC = () => {
  const [passportNo, setPassportNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleGuideInquiry = (portalName: string) => {
    const url = trackAndOpenWhatsApp({
      buttonLocation: 'Visa Status Helper Card',
      contextDetails: `Portal Inquiry: ${portalName}${passportNo ? ` (Passport: ${passportNo})` : ''}`,
      message: `Hi Smart Life Typing, I need help checking my UAE visa status on ${portalName}.${passportNo ? ` Passport No: ${passportNo}` : ''}`
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="status" className="py-12 lg:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Official Portal Quick Links</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Check Your UAE Visa & Application Status
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Guide and official direct links for checking UAE residence visa validity, entry permit approval, and passport application status.
          </p>
        </div>

        {/* Portals Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* ICP Smart Services */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                • ICP FEDERAL PORTAL
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Sharjah & Federal Visas (ICP)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check visa validity, entry permit status, and fines for visas issued in Sharjah, Abu Dhabi, Ajman, RAK, Fujairah, and UAQ.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              <a
                href="https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
              >
                <span>Open ICP Status Checker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleGuideInquiry('ICP Federal Services')}
                className="w-full text-xs font-semibold text-slate-700 hover:text-blue-700 py-1"
              >
                Ask Smart Life to Check for You →
              </button>
            </div>
          </div>

          {/* GDRFA Dubai */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                • GDRFA DUBAI PORTAL
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Dubai Visas (GDRFA)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify residence visa status, application reference number, and tourist visa validity issued by Dubai GDRFA.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              <a
                href="https://gdrfad.gov.ae/en/visa-status"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
              >
                <span>Open GDRFA Dubai Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleGuideInquiry('GDRFA Dubai Portal')}
                className="w-full text-xs font-semibold text-slate-700 hover:text-emerald-700 py-1"
              >
                Ask Smart Life to Check for You →
              </button>
            </div>
          </div>

          {/* Indian Passport / Alhind Status */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                • ALHIND INDIA PORTAL
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Indian Passport & PCC Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your Indian passport renewal application, newborn passport, or PCC status submitted through Alhind UAE.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              <a
                href="https://alhindgroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
              >
                <span>Track Alhind Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleGuideInquiry('Alhind Indian Passport Services')}
                className="w-full text-xs font-semibold text-slate-700 hover:text-orange-700 py-1"
              >
                Ask Smart Life to Check for You →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
