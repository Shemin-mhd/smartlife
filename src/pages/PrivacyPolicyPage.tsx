import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, CheckCircle2, MessageSquare, ChevronRight, Building2, MapPin, Phone } from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';

interface PrivacyPolicyPageProps {
  onNavigate?: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const mainBranch = BRANCHES_DATA[0];
  const [activeSection, setActiveSection] = useState<string>('');

  const sections = [
    { id: 'controller', title: '1. Identity of Data Controller' },
    { id: 'collection', title: '2. Information We Collect' },
    { id: 'use', title: '3. How We Use Your Data' },
    { id: 'security', title: '4. Document Confidentiality & Security' },
    { id: 'rights', title: '5. Client Rights Under UAE PDPL' },
    { id: 'contact', title: '6. Contact & Data Protection' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header Section */}
      <div className="border-b border-slate-200 pb-8 space-y-4">
        {onNavigate && (
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-blue-700">
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Legal & Data Privacy
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">UAE Federal Decree-Law No. 45 of 2021 (PDPL)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Data Security
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Smart Life Typing Services is committed to respecting your privacy and safeguarding your personal government documents in full compliance with UAE Data Protection Regulations.
        </p>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2 font-medium">
          <span>Effective Date: <strong className="text-slate-700">September 2026</strong></span>
          <span>•</span>
          <span>Jurisdiction: <strong className="text-slate-700">Sharjah & All 7 Emirates, UAE</strong></span>
        </div>
      </div>

      {/* Key Guarantees Summary Bar */}
      <div className="bg-slate-50 border-l-4 border-blue-600 p-4 sm:p-5 rounded-r-xl space-y-2">
        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Key Privacy Commitments:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong className="text-slate-900">Strict Typing Use:</strong> Documents are used solely for processing official UAE government forms.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span><strong className="text-slate-900">Zero Third-Party Sharing:</strong> We never sell, rent, or trade your personal data or file copies.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong className="text-slate-900">Secure Disposal:</strong> Transient document files are deleted upon typing completion.</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-4 hidden lg:block">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              On this page
            </p>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between font-medium ${
                    activeSection === sec.id
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-blue-900">Have a privacy or data inquiry?</p>
            <p className="text-xs text-slate-600">Contact our data protection team directly via WhatsApp for quick assistance.</p>
            <a
              href={getWhatsAppLink({ message: 'Hi Smart Life Typing, I have a privacy policy inquiry.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors pt-1"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Contact Privacy Officer</span>
            </a>
          </div>
        </div>

        {/* Policy Document Sections */}
        <div className="lg:col-span-8 space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section id="controller" className="scroll-mt-28 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              1. Identity of Data Controller
            </h2>
            <p>
              This Privacy Policy applies to <strong>Smart Life Typing Services</strong>, a licensed government document typing center based in Sharjah, United Arab Emirates (Abu Shagara Main Branch & Al Majaz 1 Branch). Smart Life Typing Services acts as the data controller for personal documents provided by clients for visa applications, Emirates ID, MoHRE labor contracts, certificate attestations, and Indian passport renewals.
            </p>
          </section>

          <section id="collection" className="scroll-mt-28 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              2. Information We Collect
            </h2>
            <p>
              To perform government document typing and online immigration processing on your behalf, we may collect and process the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Identity Documents:</strong> Passport copies, current UAE residence visas, entry permits, Emirates ID copies, and passport photos.</li>
              <li><strong>Sponsorship & Employment Records:</strong> MoHRE Labour Contracts, Salary Certificates, Trade Licenses, and Company Establishment Cards.</li>
              <li><strong>Lease & Utility Proofs:</strong> Sharjah Municipal Lease Agreements (Ejari / Moulqad) and SEWA/DEWA/FEWA utility bills.</li>
              <li><strong>Attested Certificates:</strong> Degree certificates, diploma transcripts, marriage certificates, and birth certificates.</li>
              <li><strong>Contact Details:</strong> Full name, UAE mobile phone number, WhatsApp contact details, email address, and delivery address.</li>
            </ul>
          </section>

          <section id="use" className="scroll-mt-28 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              3. How We Use Your Data
            </h2>
            <p>
              Your information is processed strictly for legitimate legal and administrative services, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Typing electronic forms into official UAE government portals (ICP Federal Authority, GDRFA Dubai, MoHRE Labour Portal, MOFA Attestation, Alhind Indian Consulate, SEDD Sharjah).</li>
              <li>Booking medical fitness screening test appointments and Emirates ID biometric appointments.</li>
              <li>Sending status updates via SMS, Phone, or WhatsApp regarding application approvals and document readiness.</li>
              <li>Complying with mandatory UAE federal recordkeeping and legal obligations.</li>
            </ul>
          </section>

          <section id="security" className="scroll-mt-28 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              4. Document Confidentiality & Security
            </h2>
            <p>
              Smart Life Typing Services enforces rigorous technical and organizational security measures to protect your documents against unauthorized access, loss, or disclosure:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>All digital communications and forms sent through our website or portal are encrypted using standard 256-bit SSL technology.</li>
              <li>Physical copies of personal documents submitted at our branches are stored in restricted access areas and returned to clients or safely shredded upon request.</li>
              <li>Our staff members are bound by non-disclosure and strict confidentiality agreements regarding client government records.</li>
            </ul>
          </section>

          <section id="rights" className="scroll-mt-28 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              5. Client Rights Under UAE PDPL
            </h2>
            <p>
              Under UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection, clients have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Right of Access:</strong> You may request a copy of the personal data held by us.</li>
              <li><strong>Right to Rectification:</strong> You may ask us to update or correct inaccurate passport or personal details.</li>
              <li><strong>Right to Erasure:</strong> You may request the permanent deletion of your stored document copies from our systems once official government typing is finalized.</li>
            </ul>
          </section>

          <section id="contact" className="scroll-mt-28 space-y-4 pt-6 border-t-2 border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              6. Contact Our Data Protection Team
            </h2>
            <p className="text-slate-600">
              If you have any questions, concerns, or data erasure requests regarding our Privacy Policy, please contact our team directly or visit our main office in Sharjah:
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Smart Life Typing Services</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Mirza Building, Shop No. 3, Abu Shagara, Sharjah, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Phone / WhatsApp: <strong className="text-slate-900">{mainBranch.phoneDisplay}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">Available Saturday – Thursday, 9:00 AM – 11:00 PM</span>
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
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Contact via WhatsApp</span>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};
