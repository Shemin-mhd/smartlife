import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DocumentChecklistModal } from './components/DocumentChecklistModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BranchesPage } from './pages/BranchesPage';
import { CompanyPage } from './pages/CompanyPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { FaqPage } from './pages/FaqPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServiceItem } from './types';
import { LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA } from './data/seoData';
import { getSeoConfigForPage, updateDomMetadata } from './utils/seoManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hashSHA256 } from './utils/cryptoHelper';
import { initGlobalWhatsAppTracker } from './utils/whatsappTracker';

// Dynamic Code-Splitting: Admin Panel JS bundle is NEVER downloaded by public visitors.
// It only loads on-demand from the server when secret authorization succeeds.
const AdminLogin = lazy(() => import('./admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./admin/AdminLayout').then(m => ({ default: m.AdminLayout })));

// SHA-256 One-Way Cryptographic Checksum of the Secret URL Hash.
const SECRET_HASH_CHECKSUM = 'cbca90c962d9e7d03ee249e062b628f3ea192e1250f9a1d700e39af2a75c9a21';

// Custom Unique Admin Access Path Name (configurable via VITE_ADMIN_SECRET_ROUTE in .env)
export const UNIQUE_ADMIN_ROUTE = (import.meta.env.VITE_ADMIN_SECRET_ROUTE || 'sl-gate-2026').toLowerCase();

function AdminWrapper({ onExitAdmin }: { onExitAdmin: () => void }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
        Verifying Security Session...
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
        Loading Secure Portal Module...
      </div>
    }>
      {!user ? (
        <AdminLogin 
          onSuccess={() => {}} 
          onCancel={onExitAdmin} 
        />
      ) : (
        <AdminLayout onExitAdmin={onExitAdmin} />
      )}
    </Suspense>
  );
}

function MainContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string>('sharjah-family-visa-renewal-guide');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('family-visa');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedServiceDocs, setSelectedServiceDocs] = useState<ServiceItem | null>(null);

  // Derive active SEO config for current page / article / service
  const currentSeoConfig = getSeoConfigForPage(currentPage, currentPage === 'service-detail' ? selectedServiceId : activeArticleSlug);

  // Initialize Global Automatic WhatsApp Click Tracker for 100% coverage
  useEffect(() => {
    const cleanup = initGlobalWhatsAppTracker();
    return cleanup;
  }, []);

  // Automatically update HTML head meta tags, title, canonical link, OpenGraph & Twitter cards in background whenever page changes
  useEffect(() => {
    updateDomMetadata(currentSeoConfig);
  }, [currentPage, activeArticleSlug, selectedServiceId]);

  // Parse URL hash and pathname to route to Admin or internal pages
  useEffect(() => {
    const handleHashChange = async () => {
      const rawHash = window.location.hash.trim().replace(/^#/, '');
      const pathname = window.location.pathname.trim().replace(/^\//, '').toLowerCase();

      // Unique secret route verification
      const targetUniqueRoute = UNIQUE_ADMIN_ROUTE.toLowerCase();

      // Secret path matching: only allow exact match of secret route (e.g. /sl-gate-2026 or #sl-gate-2026)
      const isExactUniqueRoute = (
        pathname === targetUniqueRoute || 
        rawHash.toLowerCase() === targetUniqueRoute
      );

      if (isExactUniqueRoute) {
        setCurrentPage('admin');
        return;
      }

      if (rawHash.toLowerCase().startsWith('service/')) {
        const id = rawHash.replace(/service\//i, '');
        if (id) {
          setSelectedServiceId(id);
          setCurrentPage('service-detail');
        }
        return;
      }

      if (rawHash.toLowerCase().startsWith('guide/')) {
        const slug = rawHash.replace(/guide\//i, '');
        if (slug) {
          setActiveArticleSlug(slug);
          setCurrentPage('blog-article');
        }
        return;
      }

      if (rawHash) {
        // Hash the entered URL string using SHA-256 and compare against non-invertible checksum
        const computedHash = await hashSHA256(rawHash);
        if (computedHash === SECRET_HASH_CHECKSUM) {
          setCurrentPage('admin');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavigate = (page: string, slugOrId?: string) => {
    if (page === 'service-detail' && slugOrId) {
      setSelectedServiceId(slugOrId);
      window.location.hash = `service/${slugOrId}`;
    } else if (page === 'blog-article' && slugOrId) {
      setActiveArticleSlug(slugOrId);
      window.location.hash = `guide/${slugOrId}`;
    } else {
      if (window.location.hash) {
        try {
          window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        } catch {
          window.location.hash = '';
        }
      }
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return <AdminWrapper onExitAdmin={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigate={handleNavigate}
            onSelectServiceDocs={(service) => setSelectedServiceDocs(service)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectServiceDocs={(service) => setSelectedServiceDocs(service)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'service-detail' && (
          <ServiceDetailPage
            serviceId={selectedServiceId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'branches' && <BranchesPage />}

        {currentPage === 'reviews' && <ReviewsPage onNavigate={handleNavigate} />}

        {currentPage === 'company' && <CompanyPage />}

        {currentPage === 'blog' && <BlogPage onNavigate={handleNavigate} />}

        {currentPage === 'blog-article' && (
          <ArticlePage
            articleSlug={activeArticleSlug}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'faq' && <FaqPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Quick Contact Button */}
      <FloatingWhatsApp />

      {/* Document Checklist Modal */}
      <DocumentChecklistModal
        service={selectedServiceDocs}
        onClose={() => setSelectedServiceDocs(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
