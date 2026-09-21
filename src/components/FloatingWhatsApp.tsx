import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

/* EXACT official WhatsApp icon — flat green speech bubble + white phone */
const WhatsAppIcon = ({ size = 62 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-label="WhatsApp"
  >
    {/* Single flat green speech-bubble with bottom-left tail — official WhatsApp shape */}
    <path
      fill="#4CAF50"
      d="M.057 24 1.744 17.837C.67 16.02.102 13.956.102 11.85.105 5.337 5.335.108 11.85.108c3.183.001 6.172 1.24 8.42 3.49a11.82 11.82 0 0 1 3.479 8.41c-.003 6.514-5.233 11.743-11.747 11.743a11.75 11.75 0 0 1-5.62-1.43z"
    />
    {/* Official white telephone handset */}
    <path
      fill="#FAFAFA"
      d="M16.604 13.764c-.278-.14-1.647-.813-1.902-.906-.255-.093-.44-.139-.626.14-.186.278-.718.906-.88 1.091-.162.186-.325.209-.603.07-.278-.14-1.174-.433-2.236-1.38-.826-.738-1.384-1.649-1.546-1.927-.162-.278-.017-.428.122-.567.125-.124.278-.325.417-.487.14-.163.186-.278.278-.464.093-.185.047-.348-.023-.487-.07-.14-.626-1.51-.857-2.068-.226-.542-.456-.468-.626-.477l-.533-.01c-.186 0-.487.07-.742.348s-.974.951-.974 2.319.997 2.69 1.136 2.876c.139.185 1.96 2.995 4.75 4.2.664.286 1.182.457 1.585.585.666.211 1.273.181 1.752.11.534-.079 1.647-.673 1.879-1.321.232-.648.232-1.204.162-1.321-.07-.116-.255-.186-.533-.325z"
    />
  </svg>
);

export const FloatingWhatsApp: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Float animation keyframes */}
      <style>{`
        @keyframes wa-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .wa-float {
          animation: wa-float 2.4s ease-in-out infinite;
        }
        .wa-float:hover {
          animation: none;
          transform: scale(1.1);
        }
      `}</style>

      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end">

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
                  onClick={(e) => {
                    e.stopPropagation();
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
                  <div className="shrink-0">
                    <WhatsAppIcon size={34} />
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

        {/* Floating Round Trigger Button */}
        <button
          onClick={() => setOpen(!open)}
          className="wa-float drop-shadow-2xl cursor-pointer"
          aria-label="Open WhatsApp Support"
        >
          <WhatsAppIcon size={62} />
        </button>

      </div>
    </>
  );
};
