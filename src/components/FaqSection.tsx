import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Search } from 'lucide-react';
import { FAQS_DATA } from '../data/faqsData';
import { BRANCHES_DATA } from '../data/branchesData';
import { FaqItem } from '../types';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { subscribeFaqs } from '../firebase/dbServices';

export const FaqSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1); // first FAQ open by default
  const [faqSearch, setFaqSearch] = useState('');
  const [faqsList, setFaqsList] = useState<FaqItem[]>(FAQS_DATA);

  useEffect(() => {
    const unsub = subscribeFaqs((liveFaqs) => {
      if (liveFaqs && liveFaqs.length > 0) {
        setFaqsList(liveFaqs);
      }
    });
    return () => unsub();
  }, []);

  const mainBranch = BRANCHES_DATA[0];

  const filteredFaqs = faqsList.filter((faq) => {
    const q = faqSearch.toLowerCase().trim();
    if (!q) return true;
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Common queries about UAE family visas, tourist visas, certificate attestations, company formation, and Indian passport services in Sharjah.
          </p>
        </div>

        {/* Search FAQ */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder="Search FAQs e.g., Family visa, Office location, Certificate attestation..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        {/* FAQ Accordions List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.id}. {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-1 sm:px-5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                    <p>{faq.answer}</p>
                    {faq.id === 10 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
                        <a
                          href={getWhatsAppLink({ faqQuestion: 'Check visa status' })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Share details with us on WhatsApp for status assistance</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-10 p-6 bg-blue-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-base text-white">Have a specific question not listed here?</h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Contact our experienced documentation team directly via WhatsApp or Phone.
            </p>
          </div>
          <a
            href={getWhatsAppLink({ message: 'Hi Smart Life Typing, I have a custom question regarding UAE government services.' })}
            onClick={() => {
              trackAndOpenWhatsApp({
                buttonLocation: 'Homepage FAQ CTA Banner',
                contextDetails: 'FAQ Section - Custom Question'
              });
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors shadow-xs"
          >
            Ask On WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
