import React from 'react';
import { 
  COMPANY_STORY, 
  COMPANY_TIMELINE, 
  COMPANY_VALUES 
} from '../data/companyData';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';

export const CompanyPage: React.FC = () => {
  const mainBranch = BRANCHES_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Clean Light Corporate Header Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Corporate Overview & Heritage</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            About Smart Life Typing Services
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {COMPANY_STORY.subheading}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={getWhatsAppLink({ message: 'Hello Smart Life Typing team, I am inquiring through your Company page.' })}
              onClick={() => {
                trackAndOpenWhatsApp({
                  buttonLocation: 'Company Page Story Banner',
                  contextDetails: 'Company Page Header - Contact Team'
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Contact Sharjah Team</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Story & Statistics */}
      <section className="grid lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 space-y-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            • OUR MISSION & STORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            A Trusted Name in Sharjah Government Typing & Documentation
          </h2>

          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            {COMPANY_STORY.aboutText.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            {COMPANY_STORY.stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <p className="text-2xl font-black text-blue-700">{stat.value}</p>
                <p className="text-xs text-slate-600 font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Trust Box - Clean Light Style */}
        <div className="lg:col-span-5 bg-blue-50/70 border border-blue-200 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Why Sharjah Residents Choose Smart Life</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We understand that documentation errors cause stress and delays. Our typists double-check every detail before official portal upload.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-800 border-t border-blue-200/60 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full compliance with ICP, MoHRE, & Sharjah Municipality</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-lingual staff in English, Arabic, Hindi, & Urdu</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Two accessible branches in Abu Shagara & Al Majaz 1</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp document verification for remote prep</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <a
              href={`tel:${mainBranch.phoneRaw}`}
              className="w-full inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors"
            >
              Call Sharjah Office: {mainBranch.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            • OUR CORE VALUES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Principles That Drive Our Typing Services
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Maintaining excellence, accuracy, and absolute integrity across every visa and legal file
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANY_VALUES.map((val, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{val.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company Milestones & Journey Timeline */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
            COMPANY JOURNEY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Milestones & Growth Timeline
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Over a decade of dedicated government and typing documentation service in Sharjah
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {COMPANY_TIMELINE.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2 relative">
              <div className="inline-block bg-blue-700 text-white font-bold text-xs px-2.5 py-1 rounded-md">
                {item.year}
              </div>
              <h3 className="font-bold text-slate-900 text-base pt-1">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clean Call to Action Banner */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Ready to process your UAE documents?</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Visit our Abu Shagara or Al Majaz 1 branch in Sharjah today or message us on WhatsApp.
          </p>
        </div>
        <a
          href={getWhatsAppLink({ message: 'Hello Smart Life Typing Services, I would like to inquire about document typing.' })}
          onClick={() => {
            trackAndOpenWhatsApp({
              buttonLocation: 'Company Page Footer Banner',
              contextDetails: 'Company Page Bottom - WhatsApp Consultation'
            });
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
        >
          WhatsApp Consultation
        </a>
      </div>
    </div>
  );
};
