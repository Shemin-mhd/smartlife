import React, { useState } from 'react';
import { X, Code, Copy, Download, Check, FileCode, Search, Globe, ShieldCheck, MapPin } from 'lucide-react';
import { LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA, generateXmlSitemap, generateRobotsTxt, SITE_DOMAIN } from '../data/seoData';

interface SeoToolsSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoToolsSection: React.FC<SeoToolsSectionProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sitemap' | 'robots' | 'schema' | 'geo'>('sitemap');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const xmlSitemapContent = generateXmlSitemap();
  const robotsTxtContent = generateRobotsTxt();

  const getActiveContent = () => {
    switch (activeTab) {
      case 'sitemap':
        return xmlSitemapContent;
      case 'robots':
        return robotsTxtContent;
      case 'schema':
        return JSON.stringify([LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA], null, 2);
      case 'geo':
        return `<!-- Technical GEO SEO Meta Tags for Sharjah, UAE Local Search -->
<meta name="geo.region" content="AE-SH" />
<meta name="geo.placename" content="Sharjah" />
<meta name="geo.position" content="25.3463;55.3864" />
<meta name="ICBM" content="25.3463, 55.3864" />
<meta name="coverage" content="United Arab Emirates (Dubai, Sharjah, Abu Dhabi, Ajman, RAK, Fujairah, UAQ)" />
<meta name="target_country" content="ae" />
`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'sitemap' ? 'sitemap.xml' : activeTab === 'robots' ? 'robots.txt' : 'schema.json';
    const blob = new Blob([getActiveContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div 
        className="bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                Technical SEO & GEO Indexing Tools
              </h3>
              <p className="text-xs text-slate-400">
                Generated XML Sitemap, robots.txt, Schema.org LocalBusiness JSON-LD, and GEO Location Tags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-3 bg-slate-900/60 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'sitemap' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>XML Sitemap (sitemap.xml)</span>
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'robots' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Robots.txt</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'schema' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schema.org JSON-LD</span>
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'geo' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>UAE GEO Meta Tags</span>
          </button>
        </div>

        {/* Code Output Viewer */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-cyan-300 bg-slate-900/90 leading-relaxed border-y border-slate-800">
          <pre className="whitespace-pre-wrap break-all">{getActiveContent()}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Domain Target: <strong className="text-white">{SITE_DOMAIN}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
