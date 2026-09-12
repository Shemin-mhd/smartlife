import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, MessageSquare, ArrowLeft, Building2 } from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

interface PrivacyPolicyPageProps {
  onNavigate?: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const mainBranch = BRANCHES_DATA[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Back Navigation Bar */}
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 space-y-4 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-72 h-72 text-blue-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>UAE Data Protection & Legal Policy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Smart Life Typing Services is committed to respecting your privacy and safeguarding your personal government documents in full compliance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Jurisdiction: Sharjah & All 7 Emirates, UAE</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official Typing Use Only</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Your documents are strictly used for typing and submitting official applications to UAE government entities (ICP, GDRFA, MoHRE, MOFA, BLS).
          </p>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Zero Third-Party Sales</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            We never sell, trade, rent, or share customer personal information or document copies to any third-party marketing companies.
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Secure Storage & Deletion</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            All transient file copies are protected by bank-grade SSL encryption and deleted permanently upon completion of visa/document typing.
          </p>
        </div>
      </div>

      {/* Main Privacy Policy Clauses */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>1. Identity of Data Controller</span>
          </h2>
          <p>
            This Privacy Policy applies to <strong>Smart Life Typing Services</strong>, a licensed government document typing center based in Sharjah, United Arab Emirates (Abu Shagara Main Branch & Al Majaz 1 Branch). Smart Life Typing Services acts as the data controller for personal documents provided by clients for visa applications, Emirates ID, MoHRE labor contracts, certificate attestations, and Indian passport renewals.
          </p>
        </section>

        <hr className="border-slate-100" />

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 shrink-0" />
            <span>2. Information We Collect</span>
          </h2>
          <p>
            To perform government document typing and online immigration processing on your behalf, we may collect and process the following categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Identity Documents:</strong> Passport copies, current UAE residence visas, entry permits, Emirates ID copies, and passport photos.</li>
            <li><strong>Sponsorship & Employment Records:</strong> MoHRE Labour Contracts, Salary Certificates, Trade Licenses, and Company Establishment Cards.</li>
            <li><strong>Lease & Utility Proofs:</strong> Sharjah Municipal Lease Agreements (Ejari / Moulqad) and SEWA/DEWA/FEWA utility bills.</li>
            <li><strong>Attested Certificates:</strong> Degree certificates, diploma transcripts, marriage certificates, and birth certificates.</li>
            <li><strong>Contact Details:</strong> Full name, UAE mobile phone number, WhatsApp contact details, email address, and delivery address.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>3. How We Use Your Data</span>
          </h2>
          <p>
            Your information is processed strictly for legitimate legal and administrative services, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Typing electronic forms into official UAE government portals (ICP Federal Authority, GDRFA Dubai, MoHRE Labour Portal, MOFA Attestation, BLS Indian Consulate, SEDD Sharjah).</li>
            <li>Booking medical fitness screening test appointments and Emirates ID biometric appointments.</li>
            <li>Sending status updates via SMS, Phone, or WhatsApp regarding application approvals and document readiness.</li>
            <li>Complying with mandatory UAE federal recordkeeping and legal obligations.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600 shrink-0" />
            <span>4. Document Confidentiality & Security</span>
          </h2>
          <p>
            Smart Life Typing Services enforces rigorous technical and organizational security measures to protect your documents against unauthorized access, loss, or disclosure:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>All digital communications and forms sent through our website or portal are encrypted using standard 256-bit SSL technology.</li>
            <li>Physical copies of personal documents submitted at our branches are stored in restricted access areas and returned to clients or safely shredded upon request.</li>
            <li>Our staff members are bound by non-disclosure and strict confidentiality agreements regarding client government records.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-600 shrink-0" />
            <span>5. Client Rights Under UAE PDPL</span>
          </h2>
          <p>
            Under UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection, clients have the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Right of Access:</strong> You may request a copy of the personal data held by us.</li>
            <li><strong>Right to Rectification:</strong> You may ask us to update or correct inaccurate passport or personal details.</li>
            <li><strong>Right to Erasure:</strong> You may request the permanent deletion of your stored document copies from our systems once official government typing is finalized.</li>
          </ul>
        </section>

        <hr className="border-slate-100" />

        {/* Section 6: Contact */}
        <section className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Contact Our Data Protection Team</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you have any questions, concerns, or data erasure requests regarding our Privacy Policy, please contact our team directly or visit our office:
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-slate-800">Smart Life Typing Services</p>
              <p className="text-slate-500">Mirza Building, Shop No. 3, Abu Shagara, Sharjah, UAE</p>
              <p className="text-slate-500">Phone / WhatsApp: {mainBranch.phone}</p>
            </div>
            <a
              href={getWhatsAppLink({ message: 'Hi Smart Life Typing, I have a privacy policy inquiry.' })}
              onClick={() => {
                trackAndOpenWhatsApp({
                  buttonLocation: 'Privacy Policy Page Contact',
                  contextDetails: 'Privacy Policy Contact Button'
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Contact via WhatsApp</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
