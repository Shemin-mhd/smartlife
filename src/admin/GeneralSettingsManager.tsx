import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  MessageSquare, 
  Building2, 
  Clock, 
  Mail, 
  MapPin, 
  Save, 
  ExternalLink, 
  Check, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Share2,
  Tv,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Map,
  Plus,
  X,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { 
  GeneralSettings, 
  saveGeneralSettings, 
  subscribeGeneralSettings,
  DEFAULT_GENERAL_SETTINGS 
} from '../firebase/dbSettings';
import { getCleanWhatsAppNumber } from '../config/whatsapp';

export const GeneralSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_GENERAL_SETTINGS);
  const [subTab, setSubTab] = useState<'whatsapp' | 'social' | 'company'>('whatsapp');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailInputError, setEmailInputError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeGeneralSettings((liveSettings) => {
      setSettings(liveSettings);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Parse comma-separated emails into clean array
  const emailList: string[] = (settings.notificationEmail || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

  const handleAddEmail = () => {
    setEmailInputError(null);
    const trimmed = newEmailInput.trim().toLowerCase();
    if (!trimmed) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailInputError('Please enter a valid email address (e.g. name@company.com)');
      return;
    }

    if (emailList.includes(trimmed)) {
      setEmailInputError('This email is already added to the list.');
      return;
    }

    const updated = [...emailList, trimmed].join(', ');
    setSettings(prev => ({ ...prev, notificationEmail: updated }));
    setNewEmailInput('');
  };

  const handleRemoveEmail = (indexToRemove: number) => {
    const updated = emailList.filter((_, idx) => idx !== indexToRemove).join(', ');
    setSettings(prev => ({ ...prev, notificationEmail: updated }));
  };

  const handleClearAllEmails = () => {
    setSettings(prev => ({ ...prev, notificationEmail: '' }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await saveGeneralSettings(settings);
    setSaving(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 4000);
  };

  const cleanNumber = getCleanWhatsAppNumber(settings.whatsappNumber);
  const testWhatsAppUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`;

  const socialLinks = settings.socialLinks || DEFAULT_GENERAL_SETTINGS.socialLinks || {};

  const handleSocialChange = (key: keyof typeof socialLinks, val: string) => {
    setSettings({
      ...settings,
      socialLinks: {
        ...socialLinks,
        [key]: val
      }
    });
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] max-w-5xl">

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">General Settings Control Center</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                LIVE REAL-TIME SYNC
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage centralized WhatsApp routing, notification emails, social media, and business contact info.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessToast && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
              <Check className="w-4 h-4 text-emerald-600" />
              Settings Saved Successfully!
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2">
        <button
          type="button"
          onClick={() => setSubTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            subTab === 'whatsapp'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>1. WhatsApp & Notification Emails</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('social')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            subTab === 'social'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>2. Social Media Links</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('company')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            subTab === 'company'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>3. Company Profile & Hours</span>
        </button>
      </div>

      {/* Main Content Area */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* SUB-TAB 1: WHATSAPP & NOTIFICATION EMAILS */}
        {subTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold">Centralized WhatsApp Optimization</h3>
                    <p className="text-[11px] text-slate-400">Controls target WhatsApp number for all floating widgets, service CTAs & contact buttons</p>
                  </div>
                </div>

                <a
                  href={testWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Redirection</span>
                </a>
              </div>

              <div className="p-6 space-y-6 text-xs">
                {/* Phone Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center justify-between">
                      <span>WhatsApp Target Phone Number</span>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold">Clean Digits: {cleanNumber}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-mono font-bold text-slate-900"
                      placeholder="971551585570"
                    />
                    <p className="text-[11px] text-slate-500">
                      Accepts international format with country code (e.g. 971551585570 or +971 55 158 5570). All non-digit symbols are stripped automatically for wa.me links.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold">
                      Public Display Phone Number Format
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsappDisplayNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappDisplayNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-semibold text-slate-900"
                      placeholder="+971 55 158 5570"
                    />
                    <p className="text-[11px] text-slate-500">
                      Formatted text shown visually in Header, Footer, and Contact cards for visitors to read.
                    </p>
                  </div>
                </div>

                {/* Target Notification Email Addresses (Multi-Email Manager) */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>Target Notification Email Addresses</span>
                      <span className="text-slate-500 font-medium">({emailList.length} Connected)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {emailList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllEmails}
                          className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear All</span>
                        </button>
                      )}
                      <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        CONNECTED TO INQUIRIES
                      </span>
                    </div>
                  </div>

                  {/* Connected Email Tag Pills */}
                  {emailList.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[52px]">
                      {emailList.map((em, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shadow-2xs group hover:border-slate-400 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{em}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(idx)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50 transition-colors ml-1 cursor-pointer"
                            title={`Remove ${em}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>No notification emails connected. Add at least one email address below to receive client inquiries.</span>
                    </div>
                  )}

                  {/* Add New Email Input Row */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={newEmailInput}
                          onChange={(e) => {
                            setNewEmailInput(e.target.value);
                            if (emailInputError) setEmailInputError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddEmail();
                            }
                          }}
                          placeholder="Type an email address (e.g. manager@smartlifetyping.ae) and click + Add"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 text-xs font-mono font-medium text-slate-900 shadow-2xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddEmail}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Email</span>
                      </button>
                    </div>

                    {emailInputError && (
                      <p className="text-xs font-semibold text-red-600 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{emailInputError}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    You can add multiple email addresses. When a visitor submits an inquiry or booking form, an instant alert is sent to all connected emails simultaneously. Click <strong>Save Settings</strong> above after making changes.
                  </p>
                </div>

                {/* Default Greeting Message */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="block text-slate-800 font-bold">
                    Default WhatsApp Initial Greeting Message
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={settings.whatsappDefaultMessage}
                    onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="Hello Smart Life Typing Services, I need assistance with UAE visa & government documentation."
                  />
                  <p className="text-[11px] text-slate-500">
                    This is the default message pre-filled in the user's WhatsApp input box when clicking general consultation links.
                  </p>
                </div>

                {/* Live Link Verification Box */}
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-Time WhatsApp Target Link Status</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-emerald-200 font-mono text-[11px] text-slate-800 break-all select-all">
                    {testWhatsAppUrl}
                  </div>
                </div>

              </div>
            </div>

            {/* Centralized Impact Matrix */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">Where does this WhatsApp number update?</h4>
              </div>
              <p className="text-slate-600">
                Saving your new WhatsApp number here instantly routes all of the following user actions to your new phone number:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {[
                  'Floating WhatsApp Widget (Bottom-right)',
                  'Header WhatsApp Consultation CTA',
                  'Hero Main Action Button',
                  'Service Detail Single Pages',
                  'Services Catalog Cards',
                  'Required Documents Checklist Modal',
                  'Blog Guide Sticky WhatsApp CTA',
                  'Branches & Counter Maps',
                  'FAQ Question WhatsApp Assist',
                  'Footer Emergency Contact Line',
                  'Corporate Account Inquiry Form',
                  'WhatsApp Analytics Click Tracker'
                ].map((loc, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2 text-slate-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: SOCIAL MEDIA LINKS */}
        {subTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-bold">Social Media Channels & External Profiles</h3>
                    <p className="text-[11px] text-slate-400">Configure official social media profile URLs (refreshes live in Website Footer & Header)</p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Facebook */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook Page URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.facebook || ''}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="https://facebook.com/smartlifetyping"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="https://instagram.com/smartlifetyping"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                    <span>LinkedIn Company URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="https://linkedin.com/company/smartlifetyping"
                  />
                </div>

                {/* Twitter / X */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-slate-900" />
                    <span>Twitter / X Handle URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="https://twitter.com/smartlifetyping"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube Channel URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.youtube || ''}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="https://youtube.com/@smartlifetyping"
                  />
                </div>

                {/* Google Maps */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Maps Direct Place URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.googleMaps || ''}
                    onChange={(e) => handleSocialChange('googleMaps', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="https://maps.google.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: COMPANY PROFILE */}
        {subTab === 'company' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold">Company Profile & Working Hours</h3>
                    <p className="text-[11px] text-slate-400">Controls business contact details displayed across Header top-bar, Contact Cards, and Footer</p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Business Legal Name */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold">
                    Official Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-semibold text-slate-900"
                    placeholder="Smart Life Typing Services"
                  />
                </div>

                {/* Support Email */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold">
                    Support / Inquiry Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="admin@smartlifetyping.ae"
                  />
                </div>

                {/* Working Hours */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Working Hours</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.workingHours}
                    onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="Sat - Thu: 8:00 AM - 10:00 PM"
                  />
                </div>

                {/* Main Branch Address */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Main Branches Summary</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.mainBranchAddress}
                    onChange={(e) => setSettings({ ...settings, mainBranchAddress: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-medium text-slate-800"
                    placeholder="Abu Shagara & Al Majaz 1, Sharjah, UAE"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
