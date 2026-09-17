import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Eye,
  AlertCircle,
  Link as LinkIcon,
  Check,
  X,
  ShieldCheck,
  MessageSquare,
  Clock,
  ArrowRight,
  Globe,
  Sliders
} from 'lucide-react';
import { BlogPost } from '../data/blogData';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem } from '../types';
import { fetchBlogPosts, saveBlogPost, deleteBlogPost, subscribeBlogPosts } from '../firebase/dbServices';

const COVER_IMAGE_PRESETS = [
  {
    label: 'Family Visa & Residency',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'MoFA Certificate Attestation',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Passport & Alhind Services',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'MoHRE Corporate & Labour',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Golden Visa & Investors',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop'
  }
];

export const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'preview'>('editor');

  const loadBlogData = async () => {
    setLoading(true);
    const data = await fetchBlogPosts();
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeBlogPosts((liveBlogs) => {
      setBlogs(liveBlogs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const [rawKeyTakeawaysText, setRawKeyTakeawaysText] = useState('');
  const [rawContentText, setRawContentText] = useState('');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlogPost(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setIsNew(false);
    setActiveTab('editor');
    setEditingPost(post);
    setRawKeyTakeawaysText((post.keyTakeaways || []).join('\n'));
    setRawContentText((post.content || []).join('\n\n'));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const parsedKeyTakeaways = rawKeyTakeawaysText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const parsedContent = rawContentText
      .split('\n\n')
      .map(s => s.trim())
      .filter(Boolean);

    const postToSave: BlogPost = {
      ...editingPost,
      keyTakeaways: parsedKeyTakeaways,
      content: parsedContent
    };

    await saveBlogPost(postToSave);
    setEditingPost(null);
  };

  const handleOpenAddModal = () => {
    setIsNew(true);
    setActiveTab('editor');
    const initialTakeaways = [
      'Minimum required salary is AED 4,000 or AED 3,000 + accommodation.',
      'Attested marriage and birth certificates are mandatory.',
      'EJARI tenancy contract must be in the sponsor name.'
    ];
    const initialContent = [
      'Sponsoring family members in Sharjah requires meeting specific ICP and Sharjah Immigration requirements. Before submitting your application, ensure all required documents are verified.',
      'Step 1: Obtain a valid Sharjah Municipality tenancy contract (EJARI) along with recent SEWA electricity bills.',
      'Step 2: Complete medical fitness screening and Emirates ID typing simultaneously at Smart Life Typing Services.'
    ];
    setEditingPost({
      id: 'post-' + Date.now(),
      title: '',
      slug: '',
      summary: '',
      category: 'Visa Updates',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: '4 min read',
      author: 'Smart Life Legal Team',
      coverImage: COVER_IMAGE_PRESETS[0].url,
      relatedServiceId: 'srv-1',
      seoKeywords: ['family visa renewal sharjah', 'icp typing services'],
      content: initialContent,
      keyTakeaways: initialTakeaways
    });
    setRawKeyTakeawaysText(initialTakeaways.join('\n'));
    setRawContentText(initialContent.join('\n\n'));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Real-Time SEO Scoring Engine
  const calculateSeoScore = (post: BlogPost) => {
    let score = 0;
    const tips: string[] = [];

    // Title Length Check (Optimal 40-65 chars)
    const titleLen = post.title.trim().length;
    if (titleLen >= 40 && titleLen <= 65) {
      score += 25;
    } else if (titleLen > 0 && titleLen < 40) {
      score += 15;
      tips.push(`Add ${40 - titleLen} more characters to Title for optimal Google search visibility.`);
    } else if (titleLen > 65) {
      score += 15;
      tips.push(`Title is slightly long (${titleLen} chars). Google will truncate titles over 65 chars.`);
    } else {
      tips.push('Article Title is empty.');
    }

    // Meta Excerpt / Summary Check (Optimal 100-160 chars)
    const summaryLen = post.summary.trim().length;
    if (summaryLen >= 100 && summaryLen <= 160) {
      score += 25;
    } else if (summaryLen > 0 && summaryLen < 100) {
      score += 15;
      tips.push(`Summary is too short (${summaryLen} chars). Write 100-160 chars for high search CTR.`);
    } else if (summaryLen > 160) {
      score += 15;
      tips.push(`Summary is ${summaryLen} chars. Google meta description truncates at ~160 chars.`);
    } else {
      tips.push('Article Summary is missing.');
    }

    // Cover Image Check
    if (post.coverImage && post.coverImage.trim().length > 10) {
      score += 20;
    } else {
      tips.push('Attach a Cover Image to generate OpenGraph & Twitter social preview cards.');
    }

    // Embedded Service Card Check
    if (post.relatedServiceId) {
      score += 15;
    } else {
      tips.push('Embed a Related Typing Service to convert blog readers into direct WhatsApp inquiries.');
    }

    // Key Takeaways Count Check
    if (post.keyTakeaways && post.keyTakeaways.length >= 3) {
      score += 15;
    } else {
      tips.push('Add at least 3 Key Takeaways to trigger Google AI Overview & Generative Snippets.');
    }

    return { score, tips };
  };

  const filteredBlogs = blogs.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedService = editingPost?.relatedServiceId
    ? SERVICES_DATA.find(s => s.id === editingPost.relatedServiceId)
    : undefined;

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Professional Blogger & CMS Editor</h2>
            <p className="text-[11px] text-slate-500 font-medium">Publish SEO-rich guides, cover image media, and embed direct service cards</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBlogData}
            disabled={loading}
            className="p-2 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-48 sm:w-60 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {/* Blogs Table View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Article Title & Media</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Embedded Service</th>
                <th className="px-4 py-3">SEO Score</th>
                <th className="px-4 py-3">URL Slug</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Loading articles...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                    No articles found matching search query.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((post) => {
                  const { score } = calculateSeoScore(post);
                  const linkedSrv = post.relatedServiceId
                    ? SERVICES_DATA.find(s => s.id === post.relatedServiceId)
                    : null;

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt=""
                              className="w-12 h-9 rounded object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                          ) : (
                            <div className="w-12 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1 max-w-xs" title={post.title}>
                              {post.title}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">By {post.author} • {post.date}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                          {post.category}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {linkedSrv ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                            <LinkIcon className="w-3 h-3 text-emerald-600" />
                            <span className="truncate max-w-[120px]">{linkedSrv.title}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">None attached</span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                              score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {score}/100
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-emerald-700 font-mono text-[11px]">
                        <a href={`#guide/${post.slug}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                          #{post.slug}
                          <ExternalLink className="w-3 h-3 text-emerald-600" />
                        </a>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => handleOpenEditPost(post)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-200 transition cursor-pointer"
                        >
                          Edit Article
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Blogger Modal Studio */}
      {editingPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">

            {/* Modal Header Bar with Tab Navigation */}
            <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold truncate max-w-md">
                  {isNew ? 'Publish New Article' : `Editing: ${editingPost.title}`}
                </h3>
              </div>

              {/* Tab Navigation Switches */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'editor' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
                    }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editor & Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('seo')}
                  className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5 cursor-pointer relative ${activeTab === 'seo' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
                    }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>SEO & Search Preview</span>
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.2 rounded font-bold">
                    {calculateSeoScore(editingPost).score}%
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5 cursor-pointer ${activeTab === 'preview' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
                    }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Article Preview</span>
                </button>
              </div>

              <button
                onClick={() => setEditingPost(null)}
                className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* TAB 1: CONTENT & MEDIA EDITOR */}
            {activeTab === 'editor' && (
              <form onSubmit={handleSaveModal} className="p-6 space-y-5 text-xs overflow-y-auto flex-grow bg-slate-50/50">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setEditingPost({
                          ...editingPost,
                          title,
                          slug: isNew ? generateSlug(title) : editingPost.slug
                        });
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                      placeholder="e.g. Complete Guide to UAE Family Residence Visa Renewal"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">URL Slug (Auto-generated)</label>
                    <input
                      type="text"
                      required
                      value={editingPost.slug}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: generateSlug(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-emerald-700"
                      placeholder="uae-visa-renewal-guide"
                    />
                  </div>
                </div>

                {/* Metadata Row: Category, Read Time, Author */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Category</label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as any })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-medium"
                    >
                      <option value="Visa Updates">Visa Updates</option>
                      <option value="Attestation">Attestation</option>
                      <option value="Indian Consular Services">Indian Consular Services</option>
                      <option value="MoHRE Labour">MoHRE Labour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Estimated Read Time</label>
                    <input
                      type="text"
                      value={editingPost.readTime}
                      onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
                      placeholder="4 min read"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Author Name</label>
                    <input
                      type="text"
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
                      placeholder="Smart Life Legal Team"
                    />
                  </div>
                </div>

                {/* Cover Image Studio */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Article Cover Image & Social Banner</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-normal">Featured Header Image</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="sm:col-span-2 space-y-2">
                      <input
                        type="url"
                        value={editingPost.coverImage || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-mono text-[11px]"
                      />

                      {/* Quick Cover Image Presets */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">One-Click Presets:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {COVER_IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setEditingPost({ ...editingPost, coverImage: preset.url })}
                              className="px-2 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-700 text-[10px] font-semibold rounded border border-slate-200 transition cursor-pointer"
                            >
                              + {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Image Preview Studio */}
                    <div className="w-full h-24 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center relative group">
                      {editingPost.coverImage ? (
                        <img
                          src={editingPost.coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2 text-slate-400 text-[11px]">
                          <ImageIcon className="w-5 h-5 mx-auto mb-1 opacity-50" />
                          <span>No cover image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Embedded Service Card Integrator */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50/60 p-4 rounded-xl border border-emerald-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-emerald-950 font-bold flex items-center gap-1.5">
                      <LinkIcon className="w-4 h-4 text-emerald-700" />
                      <span>Place & Embed Featured Typing Service Card</span>
                    </label>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded">
                      High-Conversion Feature
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Select a related typing service from your catalog to embed an interactive service box inside this blog guide. Readers can inquire directly via WhatsApp or inspect required document checklists!
                  </p>

                  <select
                    value={editingPost.relatedServiceId || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, relatedServiceId: e.target.value || undefined })}
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg focus:outline-none font-semibold text-slate-900 text-xs shadow-2xs"
                  >
                    <option value="">-- Do Not Embed Any Service --</option>
                    {SERVICES_DATA.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.title} ({srv.categoryLabel})
                      </option>
                    ))}
                  </select>

                  {/* Preview Selected Embedded Service */}
                  {selectedService && (
                    <div className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{selectedService.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{selectedService.processingTime} • {selectedService.requiredDocuments.length} Required Docs</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Will Render Active Card
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Summary (Meta Description) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-slate-800 font-bold mb-1">Article Summary (Short Excerpt for Cards & Meta Description)</label>
                  <textarea
                    rows={2}
                    required
                    value={editingPost.summary}
                    onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
                    placeholder="Short executive overview for social cards & search snippet..."
                  />
                </div>

                {/* Key Takeaways (One per line) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-slate-800 font-bold mb-1">Key Takeaways & Executive Summary (One point per line)</label>
                  <textarea
                    rows={3}
                    value={rawKeyTakeawaysText}
                    onChange={(e) => setRawKeyTakeawaysText(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none font-medium"
                    placeholder="Minimum salary AED 4,000 required&#10;Attested marriage certificate mandatory"
                  />
                </div>

                {/* Article Paragraphs */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <label className="block text-slate-800 font-bold mb-1">Article Content Paragraphs (Double break for new paragraph)</label>
                  <textarea
                    rows={7}
                    value={rawContentText}
                    onChange={(e) => setRawContentText(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none text-xs leading-relaxed"
                    placeholder="Paragraph 1: Overview of ICP guidelines in Sharjah...&#10;&#10;Paragraph 2: Step 1 EJARI verification..."
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Article</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: LIVE SEO & SEARCH PREVIEW */}
            {activeTab === 'seo' && (
              <div className="p-6 space-y-6 overflow-y-auto flex-grow bg-slate-50/60 text-xs">
                {/* SEO Health Meter Header */}
                {(() => {
                  const { score, tips } = calculateSeoScore(editingPost);

                  return (
                    <>
                      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span>SEO & Generative AI Health Meter</span>
                            </h4>
                            <p className="text-[11px] text-slate-500">Real-time search optimization score for Google & Bing</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-2xl font-extrabold ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                              {score}/100
                            </span>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Optimization'}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>

                        {/* Optimization Tips */}
                        {tips.length > 0 ? (
                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Actionable Recommendations:
                            </span>
                            <ul className="space-y-1">
                              {tips.map((tip, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-slate-600 text-xs">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs pt-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Article is 100% optimized for Google Search SERP!</span>
                          </div>
                        )}
                      </div>

                      {/* Google Search Desktop Preview Card */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span>Google Search Desktop Result Preview</span>
                        </h4>

                        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-1 max-w-2xl font-sans">
                          <div className="flex items-center gap-2 text-[12px] text-[#202124]">
                            <div className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                              SL
                            </div>
                            <span className="font-semibold">Smart Life Typing Services</span>
                            <span className="text-slate-400">https://smartlifetyping.com &rsaquo; guide &rsaquo; {editingPost.slug || 'slug'}</span>
                          </div>

                          <h3 className="text-lg text-[#1a0dab] hover:underline font-normal leading-snug cursor-pointer line-clamp-1">
                            {editingPost.title || 'Untitled Article Title - Smart Life Sharjah'}
                          </h3>

                          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                            {editingPost.summary || 'Article meta summary description snippet will appear here on Google search results...'}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Back to Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition cursor-pointer"
                  >
                    View Live Preview
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE ARTICLE PREVIEW */}
            {activeTab === 'preview' && (
              <div className="p-6 space-y-6 overflow-y-auto flex-grow bg-white text-xs font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-3xl mx-auto space-y-6 border border-slate-200 p-6 rounded-2xl shadow-2xs">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                    <span className="font-bold text-blue-700 uppercase tracking-wider">• {editingPost.category}</span>
                    <span>{editingPost.readTime} • {editingPost.date}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {editingPost.title || 'Article Title Preview'}
                  </h1>

                  {/* Cover Image Header */}
                  {editingPost.coverImage && (
                    <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={editingPost.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Excerpt Summary */}
                  <p className="text-slate-600 text-xs italic border-l-4 border-blue-600 pl-4 py-1.5 bg-slate-50 rounded-r-lg">
                    {editingPost.summary || 'Summary description...'}
                  </p>

                  {/* Key Takeaways */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
                    <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Executive Key Takeaways:</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {editingPost.keyTakeaways.map((tk, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-blue-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Embedded Related Service Card Callout */}
                  {selectedService && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-5 space-y-3 shadow-md border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          Recommended Official Service
                        </span>
                        <span className="text-xs text-slate-400">{selectedService.processingTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{selectedService.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{selectedService.shortDesc}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                        <span className="text-xs font-bold text-emerald-400">Smart Life Typing Center</span>
                        <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Inquire on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="space-y-4 text-xs leading-relaxed text-slate-800">
                    {editingPost.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Back to Editor
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModal}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Article Now</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
