import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, 
  Building2, ExternalLink, FileText, CheckCircle2, Sparkles, 
  BookOpen, HelpCircle, Star, Globe, ArrowRight, Facebook, Instagram, Linkedin, Twitter, Tv, Map
} from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink, getWhatsAppDisplayNumber } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { subscribeGeneralSettings, getStoredLocalSettings, SocialLinks } from '../firebase/dbSettings';

interface FooterProps {
  onNavigate: (page: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(getStoredLocalSettings().socialLinks || {});

  useEffect(() => {
    const unsub = subscribeGeneralSettings((settings) => {
      if (settings.socialLinks) {
        setSocialLinks(settings.socialLinks);
      }
    });
    return () => unsub();
  }, []);
  const mainBranch = BRANCHES_DATA[0];

  const handleLinkClick = (pageId: string, slug?: string) => {
    onNavigate(pageId, slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Bar: Brand, Trust Badges & Social Contact Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80 items-start">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-md shrink-0">
                <img 
                  src="/images/clients/logo-Black.png" 
                  alt="Smart Life Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block">
                  SMART LIFE TYPING SERVICES
                </span>
                <span className="text-xs text-blue-400 font-semibold tracking-wide block">
                  Sharjah & All Emirates Visa & Government Solutions
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Smart Life Typing Services is a government-approved typing & documentation center based in Sharjah, UAE. We specialize in fast, accurate processing for Family Residence Visas, Emirates ID, MoHRE Labour Contracts, Golden Visas, Certificate Attestation, Indian Passport Renewal (BLS), Trade Licenses, and Traffic Services across all 7 Emirates.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Guaranteed Documentation Accuracy</span>
              </div>
              <button 
                onClick={() => handleLinkClick('reviews')}
                className="flex items-center gap-2 text-slate-300 hover:text-amber-300 font-medium cursor-pointer transition-colors"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span>240+ 5-Star Verified Google Reviews</span>
              </button>
            </div>

            {/* Live Social Media Links Row */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Follow Us:</span>
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-400 hover:text-blue-400 flex items-center justify-center transition" title="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500 text-slate-400 hover:text-pink-400 flex items-center justify-center transition" title="Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-600 text-slate-400 hover:text-blue-500 flex items-center justify-center transition" title="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-400 text-slate-400 hover:text-white flex items-center justify-center transition" title="X / Twitter">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 text-slate-400 hover:text-red-400 flex items-center justify-center transition" title="YouTube">
                  <Tv className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.googleMaps && (
                <a href={socialLinks.googleMaps} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition" title="Google Maps Location">
                  <Map className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Direct Social & Quick Contact Links */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-6 pt-2">
            
            {/* WhatsApp Contact */}
            <a
              href={getWhatsAppLink({ message: 'Hi Smart Life Typing, I need urgent document typing assistance.' })}
              onClick={() => {
                trackAndOpenWhatsApp({
                  buttonLocation: 'Footer Instant WhatsApp Support',
                  contextDetails: 'Footer - Instant WhatsApp Support'
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-200 hover:text-emerald-400 transition-colors group shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Instant WhatsApp Support
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {getWhatsAppDisplayNumber()}
                </span>
              </div>
            </a>

            {/* Google Maps / Office Branches Link */}
            <button
              onClick={() => handleLinkClick('branches')}
              className="flex items-center gap-3 text-slate-200 hover:text-blue-400 transition-colors group cursor-pointer text-left shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Sharjah Office Branches
                </span>
                <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  Abu Shagara & Al Majaz 1
                </span>
              </div>
            </button>

          </div>

        </div>

        {/* Deep Navigation Columns (SEO / AEO / GEO Architecture) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-xs">
          
          {/* Column 1: Core Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Main Pages</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  All Government Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('branches')} className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-blue-300">
                  Branches & Contact Page
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('reviews')} className="hover:text-white transition-colors cursor-pointer text-left text-amber-300">
                  Google Verified Reviews
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('company')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About Smart Life & Story
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('blog')} className="hover:text-white transition-colors cursor-pointer text-left">
                  UAE Visa & Govt Guides
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('faq')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Typing Services */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Typing Services</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Family Residence Visa
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Tourist & Visit Visa Typing
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  MoHRE Labour Contracts
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Golden Visa Applications
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Emirates ID New / Renewal
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Degree & Certificate Attestation
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Trade License & Tasheel
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Indian Passport (BLS) Renewal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Document Checklists */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Document Checklists</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Family Visa Requirements
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Golden Visa Requirements
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Labour Contract Requirements
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Trade License Requirements
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Attestation Requirements
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Passport Renewal Checklist
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Medical Fitness Typing Docs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Detailed Guides & Portals */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Government Guides</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => handleLinkClick('blog-article', 'sharjah-family-visa-renewal-guide')} 
                  className="hover:text-white transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Family Visa Renewal Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('blog-article', 'educational-certificate-attestation-uae-guide')} 
                  className="hover:text-white transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Certificate Attestation Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('blog-article', 'indian-passport-renewal-bls-sharjah-checklist')} 
                  className="hover:text-white transition-colors cursor-pointer text-left line-clamp-1"
                >
                  BLS Indian Passport Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('blog-article', 'golden-visa-sharjah-requirements')} 
                  className="hover:text-white transition-colors cursor-pointer text-left line-clamp-1"
                >
                  Golden Visa Eligibility Guide
                </button>
              </li>
              <li className="pt-2">
                <a 
                  href="https://smartservices.icp.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-[11px]"
                >
                  <span>ICP Federal Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://gdrfad.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-[11px]"
                >
                  <span>GDRFA Dubai Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.mohre.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-[11px]"
                >
                  <span>MoHRE Labour Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Office Branches & Contact */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Sharjah Offices</span>
            </h4>

            <ul className="space-y-3 text-xs">
              <li>
                <button 
                  onClick={() => handleLinkClick('branches')}
                  className="group text-left space-y-0.5 cursor-pointer block hover:text-blue-300 transition-colors"
                >
                  <span className="text-xs font-bold text-blue-400 group-hover:underline flex items-center gap-1">
                    Abu Shagara (Main Branch)
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </span>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    Mirza Building, Shop No. 3, Next to Orient Exchange
                  </p>
                </button>
              </li>

              <li>
                <button 
                  onClick={() => handleLinkClick('branches')}
                  className="group text-left space-y-0.5 cursor-pointer block hover:text-emerald-300 transition-colors"
                >
                  <span className="text-xs font-bold text-emerald-400 group-hover:underline flex items-center gap-1">
                    Al Majaz 1 (Branch 1)
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </span>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    Safeer Building, Shop No. 2, Al Majaz 1
                  </p>
                </button>
              </li>
            </ul>

            <div className="text-[11px] text-slate-400 pt-2 space-y-1.5 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Working Hours: Sat – Thu 8am – 10pm</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Direct Phone: {getWhatsAppDisplayNumber()}</span>
              </div>
            </div>

          </div>

        </div>

        {/* GEO & Location Index Ribbon */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-400" />
              Serving All 7 Emirates & Local Areas Across UAE:
            </span>
            <span className="text-slate-500 text-[10px]">GEO & Location Index</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            <strong className="text-slate-300">Sharjah:</strong> Abu Shagara, Al Majaz 1, Al Majaz 2, Al Majaz 3, Al Qasimia, Muwaileh, Al Nahda Sharjah, Rolla, Al Khan, Al Taawun, University City, Al Juraina. <span className="mx-1">•</span>
            <strong className="text-slate-300">Dubai:</strong> Deira, Bur Dubai, Business Bay, Al Qusais, Al Nahda Dubai, Jumeirah, Karama. <span className="mx-1">•</span>
            <strong className="text-slate-300">Other Emirates:</strong> Abu Dhabi, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain.
          </p>
        </div>

        {/* Bottom Copyright & Legal Disclaimer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-900">
          <p>© {new Date().getFullYear()} Smart Life Typing Services. All Rights Reserved. Sharjah, UAE.</p>
          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            Government Document Typing & Passport Services Center
          </p>
        </div>

      </div>
    </footer>
  );
};
