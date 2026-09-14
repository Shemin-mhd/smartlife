import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  ExternalLink,
  Check,
  X,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Save,
  Tag,
  Sparkles,
  BadgeCheck,
  FolderPlus,
  FolderTree,
  Globe,
  Download,
  Code
} from 'lucide-react';
import { ServiceItem, ServiceCategory, CategoryItem } from '../types';
import { fetchServices, saveService, deleteService, saveAllServices, subscribeServices } from '../firebase/dbServices';
import { subscribeCategories, saveCategory, deleteCategory } from '../firebase/dbCategories';
import { generateXmlSitemap, SITE_DOMAIN } from '../data/seoData';
import { BLOG_POSTS } from '../data/blogData';

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSavedToast, setOrderSavedToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const originalBackupRef = React.useRef<ServiceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [modalTab, setModalTab] = useState<'details' | 'seo'>('details');

  // Category Manager & Sitemap Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSitemapModalOpen, setIsSitemapModalOpen] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState('');

  const loadServicesData = async () => {
    setLoading(true);
    const data = await fetchServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubServices = subscribeServices((liveServices) => {
      setServices(liveServices);
      setLoading(false);
    });

    const unsubCategories = subscribeCategories((liveCategories) => {
      setCategoriesList(liveCategories);
    });

    return () => {
      unsubServices();
      unsubCategories();
    };
  }, []);

  const [rawDocumentsText, setRawDocumentsText] = useState('');
  const [rawKeywordsText, setRawKeywordsText] = useState('');

  // Real-time live keystroke auto-sync as Admin types in Service Studio modal
  useEffect(() => {
    if (!editingService || !editingService.title) return;

    const parsedDocs = rawDocumentsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const parsedKeywords = rawKeywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const isPop = !!editingService.isPopular;
    const liveDraft: ServiceItem = {
      ...editingService,
      requiredDocuments: parsedDocs,
      keywords: parsedKeywords,
      isPopular: isPop,
      badgeTag: isPop ? (editingService.badgeTag || 'POPULAR') : ''
    };

    const timer = setTimeout(() => {
      saveService(liveDraft);
    }, 120);

    return () => clearTimeout(timer);
  }, [editingService, rawDocumentsText, rawKeywordsText]);

  const handleTogglePopular = async (service: ServiceItem) => {
    const nextIsPopular = !service.isPopular;
    if (nextIsPopular) {
      const currentFeaturedCount = services.filter(s => s.isPopular && s.id !== service.id).length;
      if (currentFeaturedCount >= 6) {
        alert('Maximum limit reached! You can feature a maximum of 6 services on the homepage. Please un-star an existing featured service first.');
        return;
      }
    }
    const updated: ServiceItem = { 
      ...service, 
      isPopular: nextIsPopular,
      badgeTag: nextIsPopular ? (service.badgeTag || 'POPULAR') : ''
    };
    
    // Instant local UI state update
    setServices(prev => prev.map(s => s.id === service.id ? updated : s));

    await saveService(updated);
  };

  const handleDownloadSitemap = () => {
    const xml = generateXmlSitemap(services, BLOG_POSTS);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...services];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setServices(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === services.length - 1) return;
    const updated = [...services];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setServices(updated);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    await saveAllServices(services);
    setSavingOrder(false);
    setOrderSavedToast(true);
    setTimeout(() => setOrderSavedToast(false), 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service listing?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      await deleteService(id);
    }
  };

  const handleOpenAddModal = () => {
    setIsNew(true);
    setModalTab('details');
    const initialDocs = ['Sponsor Passport Copy & Emirates ID'];
    const newSrv: ServiceItem = {
      id: `service_${Date.now()}`,
      title: '',
      category: categoriesList[0]?.id || 'visas',
      categoryLabel: categoriesList[0]?.label || 'Visas & Immigration',
      shortDesc: '',
      fullDesc: '',
      requiredDocuments: initialDocs,
      processingTime: '24 - 48 Hours',
      isPopular: false,
      keywords: []
    };
    originalBackupRef.current = null;
    setEditingService(newSrv);
    setRawDocumentsText(initialDocs.join('\n'));
    setRawKeywordsText('');
  };

  const handleOpenEditModal = (service: ServiceItem) => {
    setIsNew(false);
    setModalTab('details');
    originalBackupRef.current = { ...service };
    setEditingService({ ...service, keywords: service.keywords || [] });
    setRawDocumentsText((service.requiredDocuments || []).join('\n'));
    setRawKeywordsText((service.keywords || []).join(', '));
  };

  const handleCancelModal = async () => {
    if (originalBackupRef.current) {
      await saveService(originalBackupRef.current);
    }
    setEditingService(null);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const parsedDocs = rawDocumentsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const parsedKeywords = rawKeywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const isPop = !!editingService.isPopular;
    const serviceToSave: ServiceItem = {
      ...editingService,
      requiredDocuments: parsedDocs,
      keywords: parsedKeywords,
      isPopular: isPop,
      badgeTag: isPop ? (editingService.badgeTag || 'POPULAR') : ''
    };

    if (isNew) {
      setServices(prev => [serviceToSave, ...prev]);
    } else {
      setServices(prev => prev.map(s => s.id === serviceToSave.id ? serviceToSave : s));
    }
    await saveService(serviceToSave);
    setEditingService(null);
  };

  // Category Management Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryLabel.trim()) return;
    const id = newCategoryLabel.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const newCat: CategoryItem = {
      id,
      label: newCategoryLabel.trim(),
      sortOrder: categoriesList.length + 1
    };
    await saveCategory(newCat);
    setNewCategoryLabel('');
  };

  const handleSaveCategoryEdit = async (id: string) => {
    if (!editingCategoryLabel.trim()) return;
    const target = categoriesList.find(c => c.id === id);
    if (!target) return;
    await saveCategory({ ...target, label: editingCategoryLabel.trim() });
    setEditingCategoryId(null);
  };

  const handleDeleteCategoryItem = async (id: string) => {
    if (window.confirm(`Delete category "${id}"? Services in this category will remain intact.`)) {
      await deleteCategory(id);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQ = s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  // Service SEO Score Calculation (0 - 100)
  const calculateServiceSeoScore = (srv: ServiceItem) => {
    let score = 0;
    const title = srv.title || '';
    const desc = srv.shortDesc || '';
    const docs = srv.requiredDocuments || [];
    const keywords = srv.keywords || [];

    // Title length & location keywords
    if (title.length >= 20 && title.length <= 70) score += 25;
    else if (title.length > 0) score += 12;

    if (title.toLowerCase().includes('sharjah') || title.toLowerCase().includes('uae')) score += 15;

    // Description length
    if (desc.length >= 50 && desc.length <= 200) score += 25;
    else if (desc.length > 0) score += 10;

    // Document checklist complete
    if (docs.length >= 4) score += 20;
    else if (docs.length > 0) score += 10;

    // Target keywords present
    if (keywords.length >= 2) score += 15;
    else if (keywords.length === 1) score += 8;

    return Math.min(score, 100);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Services Catalog & Technical SEO Studio</h2>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                services.filter(s => s.isPopular).length >= 6
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                Featured: {services.filter(s => s.isPopular).length} / 6 Max
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Manage typing services, deep URLs, document checklists & Google Search Optimization</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orderSavedToast && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              Saved!
            </span>
          )}

          <button 
            onClick={handleSaveOrder}
            disabled={savingOrder}
            className="px-3 py-1.5 bg-blue-700 text-white rounded text-xs font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Save className={`w-3.5 h-3.5 ${savingOrder ? 'animate-spin' : ''}`} />
            <span>Save Order</span>
          </button>

          <button
            onClick={() => setIsSitemapModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            title="View dynamic XML sitemap"
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
            <span>View sitemap.xml</span>
          </button>

          <button
            onClick={handleDownloadSitemap}
            className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Download sitemap.xml for Google Search Console"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Sitemap</span>
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 py-2.5 text-center">Order</th>
                <th className="px-3 py-2.5">Badge</th>
                <th className="px-4 py-2.5">Service Title & Category</th>
                <th className="px-4 py-2.5">Processing Time</th>
                <th className="px-4 py-2.5">Req. Documents</th>
                <th className="px-4 py-2.5">Official Portal</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Loading services catalog...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                    No services found matching filters.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service, index) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition">
                    {/* Order Sequence Rearrange Controls */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[11px] font-bold text-slate-400 w-5">#{index + 1}</span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className={`p-0.5 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 cursor-pointer'}`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === services.length - 1}
                            className={`p-0.5 rounded hover:bg-slate-200 ${index === services.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 cursor-pointer'}`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Badge Column */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePopular(service)}
                        className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 text-[11px] font-extrabold cursor-pointer border shadow-2xs ${
                          service.isPopular 
                            ? 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300' 
                            : 'text-slate-400 bg-slate-100 hover:bg-slate-200 border-slate-200'
                        }`}
                        title={service.isPopular ? 'Popular Badge Active - Click to remove' : 'Set Popular Badge - Click to add'}
                      >
                        <BadgeCheck className={`w-3.5 h-3.5 ${service.isPopular ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span>{service.isPopular ? (service.badgeTag || 'POPULAR') : 'None'}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{service.title}</div>
                      <div className="text-[11px] text-slate-500">{service.categoryLabel}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {service.processingTime}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {service.requiredDocuments.length} Documents
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {service.officialPortalName ? (
                        <a 
                          href={service.officialPortalUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-emerald-700 hover:underline inline-flex items-center gap-1 text-[11px]"
                        >
                          {service.officialPortalName}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold hover:bg-slate-200 transition cursor-pointer"
                      >
                        Edit & SEO
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Tab Professional Service & SEO Studio Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header & Tabs */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    {isNew ? 'Add New Service Listing' : `Service Studio: ${editingService.title}`}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {editingService.id}</span>
                </div>
              </div>
              <button onClick={handleCancelModal} className="text-slate-400 hover:text-white text-xs cursor-pointer p-1">✕</button>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab('details')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                  modalTab === 'details'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Service & Document Details</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('seo')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                  modalTab === 'seo'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>2. Google Search Preview & SEO Studio</span>
                <span className="ml-1 bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-extrabold">
                  {calculateServiceSeoScore(editingService)}/100
                </span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs overflow-y-auto flex-grow">
              
              {/* TAB 1: SERVICE & DOCUMENT DETAILS */}
              {modalTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-slate-700 font-bold mb-1">Service Title</label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none font-semibold text-slate-900"
                        placeholder="e.g. Sharjah Family Residence Visa Renewal"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-700 font-bold">Category</label>
                        <button
                          type="button"
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Manage Categories</span>
                        </button>
                      </div>
                      <select
                        value={editingService.category}
                        onChange={(e) => {
                          const selectedCatId = e.target.value;
                          const matchedCat = categoriesList.find(c => c.id === selectedCatId);
                          setEditingService({ 
                            ...editingService, 
                            category: selectedCatId, 
                            categoryLabel: matchedCat ? matchedCat.label : 'Services' 
                          });
                        }}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none font-medium"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Processing Time</label>
                      <input
                        type="text"
                        required
                        value={editingService.processingTime}
                        onChange={(e) => setEditingService({ ...editingService, processingTime: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none"
                        placeholder="e.g. 2 - 4 Working Days"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Official Government Portal Name</label>
                      <input
                        type="text"
                        value={editingService.officialPortalName || ''}
                        onChange={(e) => setEditingService({ ...editingService, officialPortalName: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none"
                        placeholder="e.g. ICP Smart Services"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Portal URL</label>
                    <input
                      type="url"
                      value={editingService.officialPortalUrl || ''}
                      onChange={(e) => setEditingService({ ...editingService, officialPortalUrl: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none font-mono text-[11px]"
                      placeholder="https://smartservices.icp.gov.ae"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Short Excerpt Summary (Displayed on Service Cards)</label>
                    <textarea
                      rows={2}
                      required
                      value={editingService.shortDesc}
                      onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none"
                      placeholder="Summary for homepage & service cards..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Detailed Procedure Description</label>
                    <textarea
                      rows={3}
                      value={editingService.fullDesc}
                      onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none"
                      placeholder="Comprehensive procedures and details..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-bold">Required Documents Checklist (One item per line)</label>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {rawDocumentsText.split('\n').filter(line => line.trim()).length} Items Total
                      </span>
                    </div>
                    <textarea
                      rows={Math.max(7, rawDocumentsText.split('\n').length + 1)}
                      value={rawDocumentsText}
                      onChange={(e) => setRawDocumentsText(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none font-mono text-[11px] leading-relaxed"
                      placeholder="Sponsor Passport Copy&#10;Emirates ID Copy&#10;Tenancy Contract Ejari"
                    />
                  </div>

                  {/* Popular Featured Highlight Checkbox */}
                  <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="popularCheck"
                        checked={editingService.isPopular || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            const currentFeaturedCount = services.filter(s => s.isPopular && s.id !== editingService.id).length;
                            if (currentFeaturedCount >= 6) {
                              alert('Maximum limit reached! You can feature a maximum of 6 services on the homepage. Please un-star an existing featured service first.');
                              return;
                            }
                          }
                          setEditingService({ 
                            ...editingService, 
                            isPopular: checked,
                            badgeTag: checked ? (editingService.badgeTag || 'POPULAR') : ''
                          });
                        }}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer w-4 h-4"
                      />
                      <div>
                        <label htmlFor="popularCheck" className="text-slate-900 font-bold cursor-pointer text-xs sm:text-sm block">
                          Feature Service as Popular (Show on Homepage)
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Displays POPULAR badge & features this service in top homepage grid (Max 6 limit).
                        </span>
                      </div>
                    </div>
                    {editingService.isPopular && (
                      <span className="bg-amber-50 text-amber-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200 shrink-0 flex items-center gap-1.5 shadow-2xs">
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-600" />
                        {editingService.badgeTag || 'POPULAR'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: GOOGLE SEARCH PREVIEW & SEO STUDIO */}
              {modalTab === 'seo' && (
                <div className="space-y-5">
                  
                  {/* Live Google Search Desktop Snippet Mockup */}
                  <div className="bg-white border border-slate-300 p-4 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-b border-slate-100 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Google Search Snippet Preview</span>
                      </span>
                      <span className="text-slate-400 font-normal">Desktop Result</span>
                    </div>

                    <div className="space-y-1 font-sans">
                      <div className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                        <span className="text-slate-400">smartlifetyping.com</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-600 font-mono">#service/{editingService.id}</span>
                      </div>
                      <h4 className="text-blue-800 hover:underline font-semibold text-base leading-snug cursor-pointer">
                        {editingService.title || 'Service Title'} Sharjah | Smart Life Typing
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {editingService.shortDesc || 'Comprehensive service details and document checklists in Sharjah...'} Official processing time: {editingService.processingTime || '24-48 hours'}.
                      </p>
                    </div>
                  </div>

                  {/* Target Keywords Input */}
                  <div className="space-y-1">
                    <label className="block text-slate-800 font-bold">
                      Target Search Keywords (Comma separated search phrases)
                    </label>
                    <input
                      type="text"
                      value={rawKeywordsText}
                      onChange={(e) => setRawKeywordsText(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none font-medium"
                      placeholder="e.g. family visa sharjah, ejari requirements, icp residence permit"
                    />
                    <p className="text-[11px] text-slate-500">
                      Add exact search terms people type on Google when looking for this service.
                    </p>
                  </div>

                  {/* Service SEO Health Score Bar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Service Search Optimization Readiness</span>
                      <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        {calculateServiceSeoScore(editingService)}% Score
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          calculateServiceSeoScore(editingService) >= 80 ? 'bg-emerald-600' :
                          calculateServiceSeoScore(editingService) >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${calculateServiceSeoScore(editingService)}%` }}
                      />
                    </div>

                    {/* Actionable Advice */}
                    <div className="space-y-1 text-xs text-slate-700 pt-1 border-t border-slate-200">
                      <span className="font-bold block text-[11px] text-slate-500 uppercase tracking-wider">Optimization Tips:</span>
                      <ul className="space-y-1 text-[11px]">
                        {!editingService.title.toLowerCase().includes('sharjah') && (
                          <li className="text-amber-800 flex items-center gap-1">
                            <span>• Add "Sharjah" or "UAE" to title to rank for local searches.</span>
                          </li>
                        )}
                        {editingService.requiredDocuments.length < 4 && (
                          <li className="text-amber-800 flex items-center gap-1">
                            <span>• Add at least 4 items to the required documents checklist.</span>
                          </li>
                        )}
                        {(!editingService.keywords || editingService.keywords.length < 2) && (
                          <li className="text-amber-800 flex items-center gap-1">
                            <span>• Add target search keywords (e.g. "labour visa sharjah").</span>
                          </li>
                        )}
                        {calculateServiceSeoScore(editingService) >= 80 && (
                          <li className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>This service is 100% optimized for Google search index!</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelModal}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Service Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic XML Sitemap Viewer Modal */}
      {isSitemapModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Live Dynamic XML Sitemap (sitemap.xml)</h3>
              </div>
              <button 
                onClick={() => setIsSitemapModalOpen(false)} 
                className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-y-auto flex-grow space-y-2">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {generateXmlSitemap(services, BLOG_POSTS)}
              </pre>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-500 font-medium">Includes {services.length} Services + {BLOG_POSTS.length} Blog Guides</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSitemap}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download sitemap.xml</span>
                </button>
                <button
                  onClick={() => setIsSitemapModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-white rounded font-semibold hover:bg-slate-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Service Category Manager</h3>
              </div>
              <button 
                onClick={() => setIsCategoryModalOpen(false)} 
                className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs overflow-y-auto flex-grow">
              {/* Add New Category Form */}
              <form onSubmit={handleCreateCategory} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <label className="block text-slate-800 font-bold">Add New Service Category</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    placeholder="e.g. Golden Visa, Legal Translation..."
                    className="flex-grow p-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-emerald-600 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded transition flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Category</span>
                  </button>
                </div>
              </form>

              {/* Existing Categories Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Active Categories ({categoriesList.length})</span>
                  <span className="text-[11px] text-slate-500 font-normal">Actions: Edit Label / Delete</span>
                </h4>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[11px] uppercase font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Category Name</th>
                        <th className="py-2.5 px-3">Services</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {categoriesList.map((cat) => {
                        const serviceCount = services.filter(s => s.category === cat.id).length;
                        const isEditingThis = editingCategoryId === cat.id;

                        return (
                          <tr key={cat.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              {isEditingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={editingCategoryLabel}
                                    onChange={(e) => setEditingCategoryLabel(e.target.value)}
                                    className="p-1 border border-blue-400 rounded text-xs w-full focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveCategoryEdit(cat.id)}
                                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                                    title="Save changes"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingCategoryId(null)}
                                    className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <span className="font-bold text-slate-800">{cat.label}</span>
                                  <span className="text-[10px] text-slate-400 ml-2 font-mono">id: {cat.id}</span>
                                </div>
                              )}
                            </td>

                            <td className="py-2 px-3 text-slate-600 font-medium">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                {serviceCount} service{serviceCount !== 1 ? 's' : ''}
                              </span>
                            </td>

                            <td className="py-2 px-3 text-right space-x-1">
                              {!isEditingThis && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCategoryId(cat.id);
                                      setEditingCategoryLabel(cat.label);
                                    }}
                                    className="p-1 text-slate-500 hover:text-blue-600 transition cursor-pointer"
                                    title="Edit Category Name"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteCategoryItem(cat.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900 cursor-pointer"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
