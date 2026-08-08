import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Copy, MessageSquare, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../types';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { submitNewInquiry } from '../firebase/dbServices';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

interface DocumentChecklistModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export const DocumentChecklistModal: React.FC<DocumentChecklistModalProps> = ({ service, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!service) return null;

  const mainBranch = BRANCHES_DATA[0];

  const formattedDocList = service.requiredDocuments
    .map((doc, idx) => `${idx + 1}. ${doc}`)
    .join('\n');

  const handleCopyDocs = () => {
    navigator.clipboard.writeText(
      `*Required Documents for ${service.title}*\n\n${formattedDocList}\n\nSmart Life Typing Services - Sharjah, UAE`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Smart Life Typing Services,\nI would like to apply for "${service.title}".\n\nI am preparing these documents:\n${formattedDocList}\n\nPlease check and advise on next steps.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {service.categoryLabel}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {service.title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Official Document Requirements & Verification Checklist
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close document modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Service Description Brief */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
            <strong className="block font-bold text-blue-950 mb-1">Service Overview:</strong>
            {service.fullDesc}
          </div>

          {/* Document Checklist Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Required Documents Checklist ({service.requiredDocuments.length})</span>
              </h4>
              <button
                onClick={handleCopyDocs}
                className="text-xs font-semibold text-slate-700 hover:text-blue-700 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Document List'}</span>
              </button>
            </div>

            <ul className="space-y-2.5">
              {service.requiredDocuments.map((doc, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Service Info */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Estimated Turnaround:</span>
              <span className="font-bold text-slate-900 text-sm">{service.processingTime}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Service Coverage:</span>
              <span className="font-bold text-slate-900 text-sm">Dubai, Sharjah & All Emirates</span>
            </div>
          </div>

          {/* Important Advice */}
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Note:</strong> Original documents may be required for official government verification (ICP / GDRFA / MoHRE / Consulate / MOFA). You can send initial document scans via WhatsApp for instant pre-checking.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Close Window
          </button>

          <a
            href={getWhatsAppLink({ documentTitle: service.title })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackAndOpenWhatsApp({
                buttonLocation: 'Document Checklist Modal Footer',
                documentTitle: service.title,
                contextDetails: `Checklist Modal: ${service.title}`
              });
              submitNewInquiry({
                clientName: 'WhatsApp Visitor',
                phone: 'WhatsApp Direct',
                serviceCategory: service.categoryLabel,
                serviceTitle: service.title,
                message: `Client opened document checklist for "${service.title}" and clicked WhatsApp direct link.`,
                source: 'document_checklist',
                assignedBranch: 'Abu Shagara Main Branch'
              });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Send Documents via WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
