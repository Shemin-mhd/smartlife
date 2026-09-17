import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { subscribeBlogPosts } from '../firebase/dbServices';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowRight, 
  X,
  Filter
} from 'lucide-react';

interface BlogPageProps {
  onNavigate?: (page: string, slug?: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blogsList, setBlogsList] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    const unsub = subscribeBlogPosts((liveBlogs) => {
      if (liveBlogs && liveBlogs.length > 0) {
        setBlogsList(liveBlogs);
      }
    });
    return () => unsub();
  }, []);

  const categories = ['All', 'Visa Updates', 'Attestation', 'Indian Consular Services', 'MoHRE Labour'];

  const filteredPosts = blogsList.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    return matchesCategory && (
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      (post.keyTakeaways && post.keyTakeaways.some(k => k.toLowerCase().includes(q)))
    );
  });

  const handleReadGuide = (slug: string) => {
    if (onNavigate) {
      onNavigate('blog-article', slug);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clean Light Header Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>UAE Documentation Knowledge Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            UAE Government & Typing Updates
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Read practical guides and rule changes for Sharjah residence visas, certificate attestation, Indian passport renewals, and MoHRE labor contracts.
          </p>

          {/* Search bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guide topics e.g., Family Visa, Attestation, Alhind Passport..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white font-semibold shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid - Compact 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            {post.coverImage && (
              <div 
                onClick={() => handleReadGuide(post.slug)}
                className="w-full h-36 overflow-hidden bg-slate-100 cursor-pointer relative"
              >
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs border border-slate-200/60">
                  {post.category}
                </span>
              </div>
            )}

            <div className="p-4 space-y-2.5 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  {!post.coverImage && (
                    <span className="font-bold text-blue-700 uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-medium text-slate-400 ml-auto">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h2 
                  onClick={() => handleReadGuide(post.slug)}
                  className="text-sm sm:text-base font-bold text-slate-900 leading-snug cursor-pointer group-hover:text-blue-700 transition-colors line-clamp-2"
                >
                  {post.title}
                </h2>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {post.summary}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">{post.date}</span>
                <button
                  onClick={() => handleReadGuide(post.slug)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
