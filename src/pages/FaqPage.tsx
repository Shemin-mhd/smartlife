import React, { useState, useEffect } from 'react';
import { FAQS_DATA } from '../data/faqsData';
import { BRANCHES_DATA } from '../data/branchesData';
import { Branch, FaqItem } from '../types';
import { getWhatsAppLink } from '../config/whatsapp';
import { subscribeFaqs, subscribeBranches } from '../firebase/dbServices';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Phone
} from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [faqsList, setFaqsList] = useState<FaqItem[]>(FAQS_DATA);
  const [branchesList, setBranchesList] = useState<Branch[]>(BRANCHES_DATA);
  const [activeFaqId, setActiveFaqId] = useState<number | null>(FAQS_DATA[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsubFaqs = subscribeFaqs((liveFaqs) => {
      if (liveFaqs && liveFaqs.length > 0) {
        setFaqsList(liveFaqs);
      }
    });
    const unsubBranches = subscribeBranches((liveBranches) => {
      if (liveBranches && liveBranches.length > 0) {
        setBranchesList(liveBranches);
      }
    });
    return () => {
      unsubFaqs();
      unsubBranches();
    };
  }, []);

  const mainBranch = branchesList[0] || BRANCHES_DATA[0];

  const faqCategories = ['All', 'Visas & Residence', 'Medical & Emirates ID', 'Indian Consulate (Alhind)', 'Attestation & Legal', 'General Services'];

  const filteredFaqs = faqsList.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' ||
      faq.category === selectedCategory ||
      (selectedCategory.includes('Indian') && (faq.category.includes('Indian') || faq.category.includes('Consulate')));
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    return matchesCategory && (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clean Light Header Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer Assistance & Clarifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Get clear answers to common questions regarding UAE family visas, document typing turnaround times, Indian consulate renewals, and attestation procedures.
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ e.g., Family Visa, Medical Fitness, Passport Renewal..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {faqCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                ? 'bg-blue-700 text-white font-semibold shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
            <p className="font-bold text-slate-800 text-base">No matching questions found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or select another category above.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = activeFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span className="flex-1">{faq.question}</span>
                  <div className={`p-1.5 rounded-lg shrink-0 ${isOpen ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Category: <strong className="text-slate-800">{faq.category}</strong></span>
                      <a
                        href={getWhatsAppLink({ faqQuestion: faq.question })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>Ask More via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Direct Contact Support Box - Clean Light Style */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Still have questions?</p>
          <h2 className="text-xl font-bold text-slate-900">Speak with our Sharjah Document Consultant</h2>
          <p className="text-xs text-slate-600">Call our main Abu Shagara branch or chat with us on WhatsApp.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`tel:${mainBranch.phoneRaw}`}
            className="bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>{mainBranch.phoneDisplay}</span>
          </a>
          <a
            href={getWhatsAppLink({ message: 'Hello Smart Life Typing Services, I have a question.' })}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp Consultation</span>
          </a>
        </div>
      </div>
    </div>
  );
};
