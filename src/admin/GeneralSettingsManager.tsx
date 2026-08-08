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
  Map
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

  useEffect(() => {
    const unsub = subscribeGeneralSettings((liveSettings) => {
      setSettings(liveSettings);
      setLoading(false);
    });
    return () => unsub();
  }, []);

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
              Manage centralized WhatsApp routing, social media channels, and business contact information.
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
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Sub-Settings Tab Bar */}
      <div className="flex border border-slate-200 rounded-xl bg-white p-1.5 shadow-2xs text-xs font-bold gap-1">
        <button
          type="button"
          onClick={() => setSubTab('whatsapp')}
          className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            subTab === 'whatsapp'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>1. WhatsApp Optimization</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('social')}
          className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            subTab === 'social'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>2. Social Media Links</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('company')}
          className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            subTab === 'company'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>3. Company Profile & Hours</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SUB-TAB 1: WHATSAPP OPTIMIZATION */}
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
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Test WhatsApp click redirection"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Redirection</span>
                </a>
              </div>

              <div className="p-5 space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Target WhatsApp Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center justify-between">
                      <span>WhatsApp Target Phone Number</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">Clean Digits: {cleanNumber}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-mono font-bold text-slate-900"
                      placeholder="971551585570 or +971 55 158 5570"
                    />
                    <p className="text-[11px] text-slate-500">
                      Accepts international format with country code (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">971551585570</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">+971 55 158 5570</code>). All non-digit symbols are stripped automatically for <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">wa.me</code> links.
                    </p>
                  </div>

                  {/* Public Display Phone Format */}
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

                {/* Default Greeting Message */}
                <div className="space-y-1.5">
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

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Facebook */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook Page URL</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={socialLinks.facebook || ''}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-slate-800 text-[11px]"
                        placeholder="https://facebook.com/smartlifetyping"
                      />
                      {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0" title="Test link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>Instagram Profile URL</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={socialLinks.instagram || ''}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-pink-600 font-mono text-slate-800 text-[11px]"
                        placeholder="https://instagram.com/smartlifetyping"
                      />
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0" title="Test link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn Company Page</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={socialLinks.linkedin || ''}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-700 font-mono text-slate-800 text-[11px]"
                        placeholder="https://linkedin.com/company/smartlifetyping"
                      />
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0" title="Test link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Twitter / X */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <Twitter className="w-4 h-4 text-slate-800" />
                      <span>X / Twitter Profile URL</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={socialLinks.twitter || ''}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-slate-800 font-mono text-slate-800 text-[11px]"
                        placeholder="https://x.com/smartlifetyping"
                      />
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0" title="Test link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-red-600" />
                      <span>YouTube Channel URL</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={socialLinks.youtube || ''}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-red-600 font-mono text-slate-800 text-[11px]"
                        placeholder="https://youtube.com/@smartlifetyping"
                      />
                      {socialLinks.youtube && (
                        <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0" title="Test link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Google Maps / Business Profile */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <Map className="w-4 h-4 text-emerald-600" />
                      <span>Google Maps / Business Profile Link</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={socialLinks.googleMaps || ''}
                        onChange={(e) => handleSocialChange('googleMaps', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600 font-mono text-slate-800 text-[11px]"
                        placeholder="https://maps.google.com/..."
                      />
                      {socialLinks.googleMaps && (
                        <a href={socialLinks.googleMaps} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0" title="Test link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-1.5">
                  <span className="font-bold text-blue-900 block text-xs">ℹ️ Footer & Social Synchronization</span>
                  <p className="text-slate-600 text-[11px]">
                    Social media profile links added here will automatically render as official clickable icons in the website Footer, facilitating customer trust and social proof.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: COMPANY PROFILE & HOURS */}
        {subTab === 'company' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-slate-900 text-white p-4 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-bold">Company Profile & Operating Details</h3>
                  <p className="text-[11px] text-slate-400">Business legal identity, official email & branch working hours</p>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Business Legal Name</label>
                    <input
                      type="text"
                      required
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Support Email Address</label>
                    <input
                      type="email"
                      required
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Working Hours Text</label>
                    <input
                      type="text"
                      required
                      value={settings.workingHours}
                      onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Main Office Address Summary</label>
                    <input
                      type="text"
                      required
                      value={settings.mainBranchAddress}
                      onChange={(e) => setSettings({ ...settings, mainBranchAddress: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>Save & Apply Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
