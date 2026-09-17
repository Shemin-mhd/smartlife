import React, { useState, useEffect } from 'react';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { GoogleReviewsSection } from '../components/GoogleReviewsSection';
import {
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  Building2,
  Send,
  CheckCircle2,
  Navigation,
  Star,
  ExternalLink
} from 'lucide-react';

import { Branch } from '../types';
import { submitNewInquiry, subscribeBranches } from '../firebase/dbServices';

export const BranchesPage: React.FC = () => {
  const [branchesList, setBranchesList] = useState<Branch[]>(BRANCHES_DATA);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(BRANCHES_DATA[0].id);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceNeeded: 'Family Residence Visa',
    preferredBranch: 'Abu Shagara Main Branch',
    message: ''
  });

  useEffect(() => {
    const unsub = subscribeBranches((liveBranches) => {
      if (liveBranches && liveBranches.length > 0) {
        setBranchesList(liveBranches);
      }
    });
    return () => unsub();
  }, []);

  const selectedBranch = branchesList.find(b => b.id === selectedBranchId) || branchesList[0] || BRANCHES_DATA[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitNewInquiry({
      clientName: formData.name,
      phone: formData.phone,
      email: formData.email,
      serviceCategory: formData.serviceNeeded,
      serviceTitle: formData.serviceNeeded,
      message: formData.message || `Direct inquiry from website Branches page`,
      source: 'contact_form',
      assignedBranch: formData.preferredBranch
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        serviceNeeded: 'Family Residence Visa',
        preferredBranch: 'Abu Shagara Main Branch',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clean Light Page Header */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Sharjah Office Locations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Branches & Contact Information
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Visit our typing offices in Sharjah for face-to-face assistance, document typing, and express consular submissions, or connect with our customer consultants online.
          </p>
        </div>
      </div>

      {/* Branch Selector Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {branchesList.map((branch) => (
          <div
            key={branch.id}
            onClick={() => setSelectedBranchId(branch.id)}
            className={`cursor-pointer bg-white border-2 rounded-2xl p-6 transition-all ${selectedBranchId === branch.id
                ? 'border-blue-600 shadow-xs ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-slate-300'
              }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${branch.isMain
                    ? 'text-blue-700'
                    : 'text-emerald-700'
                  }`}>
                  • {branch.isMain ? 'MAIN BRANCH' : 'BRANCH 2'}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{branch.name}</h2>
              </div>
              <div className={`p-2 rounded-lg ${selectedBranchId === branch.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {branch.address}
            </p>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Landmark:</span>
                <span className="font-semibold text-slate-800">{branch.landmark}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Schedule:</span>
                <span className="font-semibold text-slate-800">{branch.workingDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Working Hours:</span>
                <span className="font-semibold text-slate-800">{branch.workingHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Direct Phone:</span>
                <a href={`tel:${branch.phoneRaw}`} className="font-bold text-blue-700 hover:underline">
                  {branch.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="pt-4 mt-2 flex flex-wrap items-center gap-2">
              <a
                href={branch.googleShareUrl || branch.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Profile & Directions</span>
                <ExternalLink className="w-3 h-3 text-blue-200" />
              </a>
              <a
                href={getWhatsAppLink({ branchName: branch.area })}
                onClick={(e) => {
                  e.stopPropagation();
                  trackAndOpenWhatsApp({
                    buttonLocation: 'Branches Page Card',
                    branchName: branch.area,
                    contextDetails: `Branch Card: ${branch.name}`
                  });
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Branch Detail Card + Direct Inquiry Form */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Branch Info & Location Directions Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              • SELECTED LOCATION DETAILS
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              {selectedBranch.name}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              {selectedBranch.address}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Phone & WhatsApp</span>
              <p className="font-bold text-slate-900 text-base">{selectedBranch.phoneDisplay}</p>
              <p className="text-xs text-slate-500">Instant response during business hours</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Working Days</span>
              <p className="font-bold text-slate-900 text-base">{selectedBranch.workingDays}</p>
              <p className="text-xs text-slate-500">{selectedBranch.workingHours}</p>
            </div>
          </div>

          {/* Clean Light Location Directions Box */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <MapPin className="w-5 h-5 text-blue-700" />
              <span>How to Find {selectedBranch.name}:</span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              Located at {selectedBranch.address}. Easily accessible with street parking options nearby. Look for the Smart Life Typing signage next to {selectedBranch.landmark}.
            </p>
            <a
              href={selectedBranch.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Directions in Google Maps</span>
            </a>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Send Direct Inquiry</h2>
            <p className="text-xs text-slate-500">
              Submit your inquiry and our typing consultant will get back to you shortly.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-base">Inquiry Submitted Successfully!</p>
              <p className="text-xs text-emerald-700">
                Thank you, {formData.name || 'Valued Client'}. Our Sharjah team will contact you at {formData.phone || 'your phone number'} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sheminmuhammed594@gmail.com"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Required</label>
                <select
                  value={formData.serviceNeeded}
                  onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option>Family Residence Visa</option>
                  <option>Emirates ID & Medical Typing</option>
                  <option>Indian Passport Renewal / Alhind</option>
                  <option>Certificate Attestation (MoFA)</option>
                  <option>MoHRE Labour Contract</option>
                  <option>Company Setup / Business PRO</option>
                  <option>Other Documentation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Branch</label>
                <select
                  value={formData.preferredBranch}
                  onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option>Abu Shagara Main Branch</option>
                  <option>Al Majaz 1 Branch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Questions</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide any details about your documents or questions..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Direct Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Business Profile Reviews */}
      <GoogleReviewsSection />
    </div>
  );
};
