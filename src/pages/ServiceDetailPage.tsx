import React, { useEffect, useState } from 'react';
import { ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { BRANCHES_DATA } from '../data/branchesData';
import { getWhatsAppLink } from '../config/whatsapp';
import { trackAndOpenWhatsApp } from '../utils/whatsappTracker';
import { generateGovernmentServiceSchema, generateBreadcrumbSchema, SITE_DOMAIN } from '../data/seoData';
import { subscribeServices } from '../firebase/dbServices';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ArrowLeft, 
  Copy, 
  Check, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ServiceDetailPageProps {
  serviceId: string;
  onNavigate: (page: string, slug?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId, onNavigate }) => {
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [copied, setCopied] = useState(false);
  const mainBranch = BRANCHES_DATA[0];

  useEffect(() => {
    const unsubscribe = subscribeServices((updatedServices) => {
      if (updatedServices && updatedServices.length > 0) {
        setServices(updatedServices);
      }
    });
    return () => unsubscribe();
  }, []);

  const service = services.find(s => s.id === serviceId) || services[0];
  const relatedServices = services.filter(s => s.id !== service.id && s.category === service.category).slice(0, 3);

  // SEO Dynamic Meta Tags & Structured Schema Injection
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${service.title} Sharjah | Smart Life Government Typing`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const previousDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', `${service.shortDesc} Official processing time: ${service.processingTime}. Key documents: ${service.requiredDocuments.join(', ')}.`);

    // Inject JSON-LD GovernmentService Schema
    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.id = 'schema-service-page';
    serviceScript.text = JSON.stringify(generateGovernmentServiceSchema(service));

    // Inject Breadcrumb Schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'schema-breadcrumb-service';
    breadcrumbScript.text = JSON.stringify(
      generateBreadcrumbSchema([
        { name: 'Home', url: `${SITE_DOMAIN}/` },
        { name: 'Services Catalog', url: `${SITE_DOMAIN}/#services` },
        { name: service.title, url: `${SITE_DOMAIN}/#service/${service.id}` }
      ])
    );

    document.head.appendChild(serviceScript);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', previousDesc);
      const existingServiceSchema = document.getElementById('schema-service-page');
      if (existingServiceSchema) existingServiceSchema.remove();
      const existingBreadcrumb = document.getElementById('schema-breadcrumb-service');
      if (existingBreadcrumb) existingBreadcrumb.remove();
    };
  }, [service]);

  const handleCopyChecklist = () => {
    const checklistText = `Required Documents for ${service.title}:\n\n` + 
      service.requiredDocuments.map((doc, i) => `${i + 1}. ${doc}`).join('\n') + 
      `\n\nSharjah Office: Smart Life Typing (+971 55 158 5570)`;
    
    navigator.clipboard.writeText(checklistText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Breadcrumbs Bar */}
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
            onClick={() => onNavigate('services')} 
            className="hover:text-blue-700 transition-colors cursor-pointer"
          >
            Services Catalog
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{service.title}</span>
        </nav>

        <button
          onClick={() => onNavigate('services')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Services</span>
        </button>
      </div>

      {/* Main 2-Column Full Width Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Metadata & Title */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-[11px] uppercase tracking-wider border border-blue-100">
                {service.categoryLabel || service.category}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{service.processingTime}</span>
              </span>
              {service.isPopular && (
                <span className="bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200">
                  ★ Popular Service
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
              {service.title}
            </h1>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic border-l-3 border-blue-600 pl-4 bg-slate-50/80 py-3 rounded-r-lg">
              {service.shortDesc}
            </p>
          </header>

          {/* Service Detailed Overview */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Service Description & Overview</span>
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {service.fullDesc || service.shortDesc}
            </p>
          </section>

          {/* Mandatory Required Documents Checklist */}
          <section className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3>Required Documents Checklist</h3>
              </div>

              <button
                onClick={handleCopyChecklist}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Checklist Copied' : 'Copy Checklist'}</span>
              </button>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
              {service.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 text-xs">
              <span className="text-slate-500 font-medium">Verify your documents with our Sharjah typists before filing</span>
              <a
                href={getWhatsAppLink({ serviceTitle: service.title, message: `Hi Smart Life Typing, I want to apply for ${service.title}. Can you please review my documents?` })}
                onClick={() => {
                  trackAndOpenWhatsApp({
                    buttonLocation: 'Service Page Document Checklist CTA',
                    serviceTitle: service.title,
                    contextDetails: `Service Page Checklist: ${service.title}`
                  });
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Verify Documents on WhatsApp</span>
              </a>
            </div>
          </section>

          {/* Typing & Application Submission Steps */}
          <section className="space-y-3 pt-2">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Application & Submission Procedure
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-bold text-slate-900 text-sm">Document Verification</h4>
                <p className="text-slate-600 leading-relaxed">Send scans via WhatsApp or visit our Abu Shagara/Al Majaz branch for pre-check.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-bold text-slate-900 text-sm">Application Typing</h4>
                <p className="text-slate-600 leading-relaxed">Our licensed typists file your application with official government portals (ICP/GDRFA/MoHRE).</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-bold text-slate-900 text-sm">Receipt & Approval</h4>
                <p className="text-slate-600 leading-relaxed">Receive instant typing receipt and status tracking directly on your mobile.</p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="space-y-3 pt-4 border-t border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2">
              <HelpCircle className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <h3>Frequently Asked Questions About {service.title}</h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">Q: Can I apply for {service.title} completely online?</p>
                <p className="text-slate-600 leading-relaxed">
                  Yes! You can send your clear document scans directly to our WhatsApp. Our team will handle the typing and email/WhatsApp you the official application receipt.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">Q: How long does approval take for {service.title}?</p>
                <p className="text-slate-600 leading-relaxed">
                  Standard official processing time is {service.processingTime}. Express processing options are available upon request.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Sticky Right Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Instant WhatsApp Action Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Fast Application Filing
            </span>
            <h4 className="font-bold text-slate-900 text-base">Inquire About {service.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect with our senior Sharjah documentation consultant directly via WhatsApp.
            </p>

            <a
              href={getWhatsAppLink({ serviceTitle: service.title })}
              onClick={() => {
                trackAndOpenWhatsApp({
                  buttonLocation: 'Service Page Sidebar Action CTA',
                  serviceTitle: service.title,
                  contextDetails: `Service Page Sidebar: ${service.title}`
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Apply via WhatsApp</span>
            </a>
          </div>

          {/* Official Government Portal Info */}
          {service.officialPortalUrl && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Official Government Portal</span>
              </div>
              <p className="text-xs text-slate-600">Filed through official authority:</p>
              <a
                href={service.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 break-all"
              >
                <span>{service.officialPortalName || service.officialPortalUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {/* Sharjah Office Branch Locations */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Sharjah Counter Locations</span>
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

          {/* Related Services List */}
          {relatedServices.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                Related {service.categoryLabel || 'Typing'} Services
              </h4>

              <div className="space-y-2">
                {relatedServices.map((rel) => (
                  <div 
                    key={rel.id} 
                    onClick={() => onNavigate('service-detail', rel.id)}
                    className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-all cursor-pointer space-y-1 group"
                  >
                    <h5 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-blue-700 transition-colors">
                      {rel.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Processing: {rel.processingTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
