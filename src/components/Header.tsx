import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Menu,
  X,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  FileText,
  FileCheck,
  Building2,
  Star,
  BookOpen,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, slug?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainBranch = BRANCHES_DATA[0];

  // Auto-shift top branch info vertically every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBranchIndex((prev) => (prev + 1) % BRANCHES_DATA.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const collections = [
    {
      key: 'company',
      label: 'Company & Help',
      items: [
        {
          id: 'company',
          label: 'About Smart Life',
          desc: 'Our government approvals, history & photo studio gallery',
          icon: Briefcase
        },
        {
          id: 'blog',
          label: 'Updates & Guides',
          desc: 'Latest UAE residency rules, ICP news & step-by-step guides',
          icon: BookOpen
        },
        {
          id: 'faq',
          label: 'FAQ & Support',
          desc: 'Common questions about typing fees & processing times',
          icon: HelpCircle
        },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Contact Bar - Vertically Shifting Branch Information */}
      <div
        onClick={() => handleNavClick('branches')}
        className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 cursor-pointer hover:bg-slate-950 transition-colors border-b border-slate-800/80 group"
        title="Click to view all Sharjah branch locations, maps, and working hours"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-hidden h-6 relative">

          {/* Vertical Sliding Branch Container */}
          <div className="flex-1 overflow-hidden h-6 relative">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${activeBranchIndex * 24}px)` }}
            >
              {BRANCHES_DATA.map((branch) => (
                <div
                  key={branch.id}
                  className="h-6 flex items-center gap-3 sm:gap-6 text-[11px] font-medium whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5 text-slate-100 font-semibold group-hover:text-blue-300 transition-colors shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-pulse" />
                    <span>{branch.name} ({branch.area})</span>
                  </div>

                  <div className="hidden md:flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{branch.workingDays}: {branch.workingHours}</span>
                  </div>

                  <div className="hidden lg:flex items-center gap-1 text-slate-300 font-semibold hover:text-white">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{branch.phoneDisplay}</span>
                  </div>

                  <span className="hidden sm:inline text-blue-400 font-bold group-hover:underline text-[10px] uppercase tracking-wider ml-auto">
                    Contact Branch &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Shifting Indicator Badge */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-400 shrink-0 border border-slate-700/60">
            <span className="text-blue-400 font-bold">{activeBranchIndex + 1}</span>
            <span>/</span>
            <span>{BRANCHES_DATA.length} Branches</span>
            <div className="flex flex-col ml-1 text-slate-500">
              <ChevronUp className="w-2.5 h-2.5 -mb-1" />
              <ChevronDown className="w-2.5 h-2.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center p-1 shadow-xs group-hover:bg-slate-800 transition-colors shrink-0">
            <img
              src="/images/clients/logo-png-trans-white.png"
              alt="Smart Life Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                SMART LIFE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              Typing & Government Services
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links Organized into Collections */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Home Link */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${currentPage === 'home'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
          >
            Home
          </button>

          {/* Services Catalog Link */}
          <button
            onClick={() => handleNavClick('services')}
            className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${currentPage === 'services'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
          >
            Services Catalog
          </button>

          {/* Collection Dropdowns */}
          {collections.map((group) => {
            const isGroupActive = group.items.some(item => item.id === currentPage);
            const isOpen = activeDropdown === group.key;

            return (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(group.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setActiveDropdown(isOpen ? null : group.key)}
                  className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${isGroupActive || isOpen
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>

                {/* Dropdown Card */}
                {isOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl p-2.5 shadow-xl border border-slate-200/90 ring-1 ring-slate-900/5 space-y-1">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isSubActive = currentPage === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 group/item ${isSubActive
                                ? 'bg-blue-50/80 border border-blue-200/80 text-blue-900'
                                : 'hover:bg-slate-50 text-slate-800'
                              }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 transition-colors ${isSubActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 group-hover/item:bg-blue-50 group-hover/item:text-blue-600'
                              }`}>
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>{item.label}</span>
                                {isSubActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Second Last: Google Reviews (Authentic Multi-Color Google Typography) */}
          <button
            onClick={() => handleNavClick('reviews')}
            className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${currentPage === 'reviews'
                ? 'bg-slate-100 border border-slate-200 shadow-2xs'
                : 'hover:bg-slate-100/80'
              }`}
          >
            <span>
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
              <span className="text-slate-700 font-semibold"> Reviews</span>
            </span>
          </button>

          {/* Last: Branches & Contact Page */}
          <button
            onClick={() => handleNavClick('branches')}
            className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${currentPage === 'branches'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
          >
            Branches & Contact
          </button>
        </nav>



        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown with Organized Groupings */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Home Link */}
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3.5 py-2.5 text-sm font-bold rounded-xl transition-colors ${currentPage === 'home'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            Home
          </button>

          {/* Services Catalog Link */}
          <button
            onClick={() => handleNavClick('services')}
            className={`w-full text-left px-3.5 py-2.5 text-sm font-bold rounded-xl transition-colors ${currentPage === 'services'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            Services Catalog
          </button>
          {collections.map((group) => (
            <div key={group.key} className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="px-3.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isSubActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${isSubActive
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className={`w-4 h-4 ${isSubActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Standalone Attention-Grabbing Google Reviews & Branches Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {/* Google Reviews */}
            <button
              onClick={() => handleNavClick('reviews')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-between transition-colors ${currentPage === 'reviews'
                  ? 'bg-slate-100 border border-slate-200'
                  : 'hover:bg-slate-50'
                }`}
            >
              <span>
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-slate-700 font-semibold"> Reviews</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Branches & Contact */}
            <button
              onClick={() => handleNavClick('branches')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${currentPage === 'branches'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${currentPage === 'branches' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>Branches & Contact</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>

          {/* Mobile Direct Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${mainBranch.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 font-semibold py-2.5 px-4 rounded-xl text-xs"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Call Abu Shagara: {mainBranch.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

