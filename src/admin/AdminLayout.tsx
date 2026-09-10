import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  BookOpen, 
  Building2, 
  HelpCircle, 
  LogOut, 
  ExternalLink,
  Shield,
  User,
  ChevronRight,
  Menu,
  X,
  Settings,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardOverview } from './DashboardOverview';
import { InquiriesInbox } from './InquiriesInbox';
import { ServicesManager } from './ServicesManager';
import { BlogManager } from './BlogManager';
import { BranchesManager } from './BranchesManager';
import { FaqsManager } from './FaqsManager';
import { WhatsAppAnalytics } from './WhatsAppAnalytics';
import { GeneralSettingsManager } from './GeneralSettingsManager';

interface AdminLayoutProps {
  onExitAdmin: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitAdmin }) => {
  const { user, logout, isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await logout();
    onExitAdmin();
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiry Central Bank', icon: Inbox, badge: 'Live' },
    { id: 'whatsapp_analytics', label: 'WhatsApp Clicks Feed', icon: MessageSquare, badge: 'Tracked' },
    { id: 'services', label: 'Services Catalog', icon: FileText },
    { id: 'blogs', label: 'Blog & Guides CMS', icon: BookOpen },
    { id: 'branches', label: 'Branches & Contacts', icon: Building2 },
    { id: 'faqs', label: 'FAQ Management', icon: HelpCircle },
    { id: 'settings', label: 'General Settings', icon: Settings, badge: 'Live' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col sm:flex-row text-slate-900">
      {/* Mobile Top Nav Bar */}
      <div className="sm:hidden bg-slate-950 text-white p-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Smart Life Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-slate-300">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Clean, Professional Dark Slate */}
      <aside className={`
        fixed sm:static inset-y-0 left-0 z-40 w-56 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-semibold text-white tracking-tight leading-tight">Smart Life Portal</h1>
              <p className="text-[10px] text-slate-400">Admin Control Center</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition
                    ${isActive 
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-emerald-500 shadow-2xs' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/80">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-900 border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[11px] font-medium text-slate-200 truncate">{user?.displayName || 'Admin User'}</p>
              <p className="text-[9px] text-slate-400 truncate">{user?.email || 'admin@smartlifetyping.ae'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <button
              onClick={onExitAdmin}
              className="text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> Website
            </button>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium hover:underline"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Admin</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="capitalize text-slate-600 font-medium">
              {navItems.find(n => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && <DashboardOverview onNavigateTab={setActiveTab} />}
          {activeTab === 'inquiries' && <InquiriesInbox />}
          {activeTab === 'whatsapp_analytics' && <WhatsAppAnalytics />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'blogs' && <BlogManager />}
          {activeTab === 'branches' && <BranchesManager />}
          {activeTab === 'faqs' && <FaqsManager />}
          {activeTab === 'settings' && <GeneralSettingsManager />}
        </div>
      </main>
    </div>
  );
};
