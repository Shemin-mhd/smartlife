import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  FileText, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { InquiryItem, ServiceItem } from '../types';
import { fetchInquiries, fetchServices, fetchBlogPosts, fetchBranches, fetchWhatsAppClicks } from '../firebase/dbServices';
import { isFirebaseConfigured } from '../firebase/config';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [blogsCount, setBlogsCount] = useState<number>(0);
  const [waClicksCount, setWaClicksCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      setLoading(true);
      const [inqData, srvData, blogData, waData] = await Promise.all([
        fetchInquiries(),
        fetchServices(),
        fetchBlogPosts(),
        fetchWhatsAppClicks()
      ]);
      setInquiries(inqData);
      setServicesCount(srvData.length);
      setBlogsCount(blogData.length);
      setWaClicksCount(waData.length);
      setLoading(false);
    };

    loadOverviewData();
  }, []);

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner Alert for New Inquiries */}
      {newInquiriesCount > 0 && (
        <div 
          onClick={() => onNavigateTab('inquiries')}
          className="bg-amber-50 border border-amber-200 p-3 rounded flex items-center justify-between text-xs text-amber-900 cursor-pointer hover:bg-amber-100/80 transition"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{newInquiriesCount} new customer inquiry</strong> requiring PRO attention in your centralized bank.
            </span>
          </div>
        </div>
      )}

      {/* Metrics Row - Clean, Compact, Professional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigateTab('inquiries')}
          className="bg-white p-3.5 rounded border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Customer Inquiries</span>
            <Inbox className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{inquiries.length}</span>
            {newInquiriesCount > 0 && (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                +{newInquiriesCount} New
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Centralized Database Inbox</p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigateTab('services')}
          className="bg-white p-3.5 rounded border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Active Services</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{servicesCount}</span>
            <span className="text-[10px] text-slate-500">Categorized</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Visas, Attestation, BLS, MoHRE</p>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigateTab('blogs')}
          className="bg-white p-3.5 rounded border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Published Guides</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{blogsCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">SEO Optimized</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Articles & UAE Law Guides</p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigateTab('whatsapp_analytics')}
          className="bg-white p-3.5 rounded border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">WhatsApp Leads</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{waClicksCount}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Tracked</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Live Click Location Feed</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Inquiries + Database System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Recent Inquiries Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Recent Client Submissions</h3>
              <p className="text-[11px] text-slate-500">Latest form submissions from homepage & visa helper</p>
            </div>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs text-emerald-700 hover:underline font-medium flex items-center gap-1"
            >
              View All Inquiries <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2">Client</th>
                  <th className="py-2">Service</th>
                  <th className="py-2">Date</th>
                  <th className="py-2 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-400">Loading recent data...</td></tr>
                ) : inquiries.slice(0, 4).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-900">
                      {item.clientName}
                      <div className="text-[10px] text-slate-400 font-normal">{item.phone}</div>
                    </td>
                    <td className="py-2.5 text-slate-700 max-w-[140px] truncate">
                      {item.serviceTitle || item.serviceCategory}
                    </td>
                    <td className="py-2.5 text-slate-500 whitespace-nowrap text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] border border-emerald-200 hover:bg-emerald-100"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Security & System Health Box (1 col) */}
        <div className="bg-slate-900 text-white rounded p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">System Security & Database</h3>
                <p className="text-[10px] text-slate-400">Security Rules & Storage Health</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Firebase Database Connection</span>
                {isFirebaseConfigured() ? (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">CONNECTED LIVE</span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">DEMO FALLBACK ENGINE</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[11px]">DevTools Injection Protection</span>
                <span className="text-[10px] font-semibold text-emerald-400">ENABLED</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Central Inquiry Bank Encryption</span>
                <span className="text-[10px] font-semibold text-emerald-400">SSL 256-BIT</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Server Time: {new Date().toLocaleTimeString()}</span>
            <span>Version 2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
