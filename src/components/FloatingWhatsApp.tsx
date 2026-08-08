import React, { useState } from 'react';
import { MessageSquare, X, Building2, ChevronUp } from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

export const FloatingWhatsApp: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Branch Selector Popup */}
      {open && (
        <div className="mb-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl w-72 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">WhatsApp Quick Support</h4>
              <p className="text-[11px] text-slate-500">Choose preferred Sharjah branch</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {BRANCHES_DATA.map((branch) => (
              <a
                key={branch.id}
                href={getWhatsAppLink({ branchName: branch.area })}
                onClick={() => {
                  trackAndOpenWhatsApp({
                    buttonLocation: 'Global Floating Widget',
                    branchName: branch.area,
                    contextDetails: `Floating Popup - ${branch.name}`
                  });
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 transition-colors group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    {branch.area} Branch
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    {branch.landmark}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
        aria-label="Open WhatsApp Support"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp Help</span>
      </button>

    </div>
  );
};
