import React, { useEffect, useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { SERVICES_DATA } from '../data/servicesData';
import { BRANCHES_DATA } from '../data/branchesData';
import { Branch, ServiceItem } from '../types';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { generateArticleSchema, generateBreadcrumbSchema, SITE_DOMAIN } from '../data/seoData';
import { subscribeBlogPosts, subscribeServices, subscribeBranches } from '../firebase/dbServices';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  Sparkles, 
  FileCheck, 
  ChevronRight,
  Printer,
  HelpCircle,
  FileText,
  ArrowRight
} from 'lucide-react';

interface ArticlePageProps {
  articleSlug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ articleSlug, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [blogsList, setBlogsList] = useState<BlogPost[]>(BLOG_POSTS);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [branchesList, setBranchesList] = useState<Branch[]>(BRANCHES_DATA);

  useEffect(() => {
    const unsubBlogs = subscribeBlogPosts((liveBlogs) => {
      if (liveBlogs && liveBlogs.length > 0) setBlogsList(liveBlogs);
    });
    const unsubServices = subscribeServices((liveServices) => {
      if (liveServices && liveServices.length > 0) setServicesList(liveServices);
    });
    const unsubBranches = subscribeBranches((liveBranches) => {
      if (liveBranches && liveBranches.length > 0) setBranchesList(liveBranches);
    });

    return () => {
      unsubBlogs();
      unsubServices();
      unsubBranches();
    };
  }, []);

  const mainBranch = branchesList[0] || BRANCHES_DATA[0];
  const article = blogsList.find(p => p.slug === articleSlug) || blogsList[0] || BLOG_POSTS[0];
  const relatedArticles = blogsList.filter(p => p.slug !== article.slug).slice(0, 2);

  const linkedService = article.relatedServiceId 
    ? servicesList.find(s => s.id === article.relatedServiceId)
    : null;

  // SEO, GEO, and AEO Dynamic Meta Tags & Schema Injection
  useEffect(() => {
    // 1. Dynamic Document Title
    const originalTitle = document.title;
    document.title = `${article.title} | Smart Life Typing Sharjah`;

    // 2. Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const previousDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', article.summary);

    // 3. Dynamic JSON-LD Article Schema
    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.id = 'schema-article-page';
    articleScript.text = JSON.stringify(generateArticleSchema(article));

    // 4. Dynamic Breadcrumb Schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'schema-breadcrumb-page';
    breadcrumbScript.text = JSON.stringify(
      generateBreadcrumbSchema([
        { name: 'Home', url: `${SITE_DOMAIN}/` },
        { name: 'Updates & Guides', url: `${SITE_DOMAIN}/#blog` },
        { name: article.title, url: `${SITE_DOMAIN}/#guide/${article.slug}` }
      ])
    );

    document.head.appendChild(articleScript);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', previousDesc);
      const existingArticleSchema = document.getElementById('schema-article-page');
      if (existingArticleSchema) existingArticleSchema.remove();
      const existingBreadcrumb = document.getElementById('schema-breadcrumb-page');
      if (existingBreadcrumb) existingBreadcrumb.remove();
    };
  }, [article]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#guide/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Breadcrumb Navigation Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap text-xs font-medium text-slate-500 pb-6 border-b border-slate-200/80 mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button 
            onClick={() => onNavigate('blog')} 
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Updates & Guides
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{article.category}</span>
        </nav>

        <button
          onClick={() => onNavigate('blog')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Guides</span>
        </button>
      </div>

      {/* Main 2-Column Full Width Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left / Main Editorial Content Column (8 cols) */}
        <article className="lg:col-span-8 space-y-8">
          
          {/* Header Metadata & Title */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-[11px] uppercase tracking-wider border border-blue-100">
                {article.category}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTime}</span>
              </span>
              <span>•</span>
              <span className="font-medium">Published: {article.date}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
              {article.title}
            </h1>

            {/* Author Credential & Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-b border-slate-100 py-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  SL
                </div>
                <div>
                  <p className="font-bold text-slate-900">{article.author}</p>
                  <p className="text-[11px] text-slate-500">Sharjah Government Typing Specialists</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Copy share link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Share Link'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Print guide"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          {article.coverImage && (
            <div className="w-full h-72 sm:h-96 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Excerpt Overview */}
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic border-l-3 border-blue-600 pl-4 bg-slate-50/80 py-3 rounded-r-lg">
            {article.summary}
          </p>

          {/* Main Article Body Paragraphs */}
          <section className="space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed pt-2">
            {article.content.map((paragraph, idx) => (
              <div key={idx} className="space-y-2">
                {idx === 0 && (
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Overview & Initial Requirements
                  </h2>
                )}
                {idx === 2 && (
                  <h2 className="text-xl font-bold text-slate-900 pt-4 border-b border-slate-100 pb-2">
                    Step-by-Step Submission Procedure
                  </h2>
                )}
                <p className="text-slate-700 leading-relaxed">{paragraph}</p>
              </div>
            ))}
          </section>

          {/* Embedded Related Service Card */}
          {linkedService && (
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Related Typing Service</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">⚡ {linkedService.processingTime}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{linkedService.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{linkedService.shortDesc}</p>
              </div>

              <div className="text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-700">Required Documents: </span>
                <span>{linkedService.requiredDocuments.join(', ')}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Smart Life Typing Center • Sharjah</span>
                <a
                  href={getWhatsAppLink({ serviceTitle: linkedService.title, message: `Hi Smart Life Typing, I read your article "${article.title}" and would like assistance with ${linkedService.title}.` })}
                  onClick={() => {
                    trackAndOpenWhatsApp({
                      buttonLocation: 'Embedded Blog Service Card CTA',
                      serviceTitle: linkedService.title,
                      contextDetails: `Embedded Service Card in Blog: ${article.title}`
                    });
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </section>
          )}

          {/* Frequently Asked Questions */}
          <section className="space-y-3 pt-4 border-t border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2">
              <HelpCircle className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <h3>Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">Q: Can I complete this typing process online?</p>
                <p className="text-slate-600 leading-relaxed">
                  Yes, send your scanned documents directly to Smart Life Typing via WhatsApp for online verification and typing.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">Q: How long does approval take in Sharjah?</p>
                <p className="text-slate-600 leading-relaxed">
                  Standard processing takes 24 to 48 hours for ICP residence permits and 1 to 3 working days for MoFA attestations.
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* Right Sticky Sidebar Column (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Key Takeaways Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Executive Summary</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Fact Sheet</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {article.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700 leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instant WhatsApp Support Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Direct Application Help
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Need Help Filing This Document?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send scans via WhatsApp for immediate typing pre-checks and filing.
            </p>

            <a
              href={getWhatsAppLink({ articleTitle: article.title })}
              onClick={() => {
                trackAndOpenWhatsApp({
                  buttonLocation: 'Sidebar WhatsApp Widget',
                  articleTitle: article.title,
                  contextDetails: `Sidebar Widget: ${article.title}`
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>

          {/* Sharjah Office Branches */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Sharjah Office Branches</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-0.5">
                <span className="font-bold text-slate-900 block">Abu Shagara Main Branch</span>
                <p className="text-slate-600 text-[11px]">Mirza Building, Shop No. 3</p>
                <p className="text-slate-500 text-[11px] font-medium">{mainBranch.phoneDisplay}</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-0.5">
                <span className="font-bold text-slate-900 block">Al Majaz 1 Branch</span>
                <p className="text-slate-600 text-[11px]">Safeer Building, Shop No. 2</p>
                <p className="text-slate-500 text-[11px]">Sat – Thu: 8:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Related Articles Widget */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              Related Sharjah Guides
            </h4>

            <div className="space-y-2">
              {relatedArticles.map((rel) => (
                <div 
                  key={rel.id} 
                  onClick={() => onNavigate('blog-article', rel.slug)}
                  className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-all cursor-pointer space-y-1 group"
                >
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                    {rel.category}
                  </span>
                  <h5 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-blue-700 transition-colors">
                    {rel.title}
                  </h5>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium pt-1">
                    <span>Read Guide</span>
                    <ChevronRight className="w-3 h-3 text-blue-600" />
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};
