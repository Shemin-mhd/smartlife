import React, { useState, useEffect } from 'react';
import { GOOGLE_PROFILE_STATS, GOOGLE_REVIEWS_DATA } from '../data/googleReviewsData';
import {
  Star,
  StarHalf,
  MapPin,
  ExternalLink,
  ThumbsUp,
  CheckCircle2,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

interface ReviewsPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Abu Shagara' | 'Al Majaz'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const categories = [
    'All',
    'Family Visas',
    'Medical & Emirates ID',
    'Indian Passport & Alhind',
    'Attestation & MoFA',
    'SEWA & Tenancy',
    'Photo Studio',
    'Golden Visa'
  ];

  // Inject Schema.org AggregateRating for Google SEO
  useEffect(() => {
    const reviewSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Smart Life Typing & Studio Sharjah',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': GOOGLE_PROFILE_STATS.overallRating,
        'reviewCount': GOOGLE_PROFILE_STATS.totalReviews,
        'bestRating': '5',
        'worstRating': '1'
      },
      'review': GOOGLE_REVIEWS_DATA.map(rev => ({
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': rev.authorName
        },
        'datePublished': '2026-01-15',
        'reviewBody': rev.comment,
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': rev.rating,
          'bestRating': '5'
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-google-reviews-page';
    script.text = JSON.stringify(reviewSchema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('schema-google-reviews-page');
      if (existing) existing.remove();
    };
  }, []);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openGoogleProfile = (url?: string) => {
    const targetUrl = url || GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const filteredReviews = GOOGLE_REVIEWS_DATA.filter(rev => {
    // Branch filter
    if (selectedBranch === 'Abu Shagara' && !rev.branchName.includes('Abu Shagara')) return false;
    if (selectedBranch === 'Al Majaz' && !rev.branchName.includes('Al Majaz')) return false;

    // Category filter
    if (selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      const revCatLower = rev.serviceCategory.toLowerCase();
      if (catLower.includes('family') && !revCatLower.includes('family')) return false;
      if (catLower.includes('medical') && (!revCatLower.includes('medical') && !revCatLower.includes('emirates id'))) return false;
      if (catLower.includes('passport') && (!revCatLower.includes('passport') && !revCatLower.includes('alhind') && !revCatLower.includes('bls') && !revCatLower.includes('pcc'))) return false;
      if (catLower.includes('attestation') && (!revCatLower.includes('attestation') && !revCatLower.includes('mofa'))) return false;
      if (catLower.includes('sewa') && (!revCatLower.includes('sewa') && !revCatLower.includes('tenancy') && !revCatLower.includes('ejari'))) return false;
      if (catLower.includes('photo') && !revCatLower.includes('photo')) return false;
      if (catLower.includes('golden') && !revCatLower.includes('golden')) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rev.authorName.toLowerCase().includes(q) ||
        rev.comment.toLowerCase().includes(q) ||
        rev.serviceCategory.toLowerCase().includes(q) ||
        rev.branchName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-10">

      {/* Top Hero Section - Clean, Open, Professional (No Boxy Card Container) */}
      <div className="max-w-7xl mx-auto pt-4 pb-2 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">

          {/* Main Hero Copy */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#34A853]" />
              <span>
                Verified <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span> Business Reviews
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Real Customer Ratings & Feedback on{' '}
              <span className="inline-block">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-slate-900"> Maps</span>
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore genuine, unedited customer reviews submitted by Sharjah residents and business owners for our Abu Shagara Main Branch and Al Majaz 1 Branch on{' '}
              <span className="font-semibold text-slate-800">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span> Business Profiles
              </span>.
            </p>

            {/* Direct Profile Link Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara)}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>Abu Shagara Branch (148+ Reviews)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.alMajaz)}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#34A853]" />
                <span>Al Majaz 1 Branch (92+ Reviews)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Rating Summary Callout - Clean, Professional & Integrated */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 pt-2 lg:pt-0">
            <div className="text-left lg:text-right space-y-1">
              <div className="flex items-center lg:justify-end gap-1 text-[#FBBC05]">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <StarHalf className="w-5 h-5 fill-current" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                4.5 <span className="text-lg font-bold text-slate-400">/ 5.0</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Based on <strong className="text-slate-900 font-bold">240+ Verified Reviews</strong> on{' '}
                <span>
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
              </p>
            </div>

            <button
              onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara)}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
              <span>
                Write a Review on{' '}
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar Section - Unboxed & Clean Toolbar */}
      <div className="max-w-7xl mx-auto space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200/80">

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews (e.g. Family Visa, Alhind, SEWA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent shadow-2xs"
            />
          </div>

          {/* Branch Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl w-full sm:w-auto">
            {(['All', 'Abu Shagara', 'Al Majaz'] as const).map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${selectedBranch === branch
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {branch === 'All' ? 'All Branches (240+)' : `${branch} Branch`}
              </button>
            ))}
          </div>

        </div>

        {/* Service Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                  ? 'bg-[#4285F4] text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <p className="font-medium">
            Showing <strong className="text-slate-900 font-bold">{filteredReviews.length}</strong> verified Google reviews
          </p>
          <p className="hidden sm:block text-slate-400">Click any card to verify directly on Google Business Profile</p>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No reviews match your filters</h3>
            <p className="text-xs text-slate-500">Try clearing your search term or switching to "All" categories.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedBranch('All'); setVisibleCount(12); }}
              className="bg-[#4285F4] text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.slice(0, visibleCount).map((rev) => {
                const isLiked = likedReviews[rev.id];
                const likes = (rev.likesCount || 0) + (isLiked ? 1 : 0);
                const targetUrl = rev.googleUrl || GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara;

                return (
                  <div
                    key={rev.id}
                    onClick={() => openGoogleProfile(targetUrl)}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-[#4285F4] transition-all flex flex-col justify-between space-y-4 relative cursor-pointer group overflow-hidden"
                  >
                    {/* Google Signature 4-Color Gradient Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

                    <div className="space-y-3 pt-1">
                      {/* Top user header with Google multi-color gradient ring on avatar */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {/* Google Colors Avatar Ring */}
                          <div className="p-[2px] rounded-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] shrink-0">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                              {rev.authorName.charAt(0)}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[#4285F4] transition-colors flex items-center gap-1">
                              <span>{rev.authorName}</span>
                            </h3>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <CheckCircle2 className="w-3 h-3 text-[#34A853] shrink-0" />
                              <span>Google Verified Reviewer</span>
                            </div>
                          </div>
                        </div>

                        {/* Google External Link indicator */}
                        <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-[#4285F4] group-hover:bg-blue-50 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Rating Stars & Date */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-0.5 text-[#FBBC05]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                      </div>

                      {/* Service Category Badge */}
                      <div className="inline-block bg-slate-100 text-slate-800 font-semibold text-[11px] px-2.5 py-1 rounded-md border border-slate-200">
                        {rev.serviceCategory}
                      </div>

                      {/* Comment */}
                      <p className="text-slate-700 text-xs leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Card Footer: Branch Location & Direct Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#EA4335] shrink-0" />
                        <span className="truncate max-w-[160px]">{rev.branchName}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleLike(e, rev.id)}
                          className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded transition-colors ${isLiked ? 'text-[#4285F4] bg-blue-50' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-[#4285F4]' : ''}`} />
                          <span>{likes}</span>
                        </button>

                        <span className="text-[11px] font-bold group-hover:underline flex items-center gap-0.5">
                          <span>
                            Verify on <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
                          </span>
                          <ExternalLink className="w-3 h-3 text-[#4285F4]" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More / Google Profiles Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {visibleCount < filteredReviews.length && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Load More Indexed Reviews ({filteredReviews.length - visibleCount} Remaining)
                </button>
              )}

              <button
                onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara)}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
              >
                <span>
                  View All 240+ Live Reviews on{' '}
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span> Maps
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Authenticity Assurance Notice for Users */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-slate-900 font-extrabold text-base sm:text-lg">
            <ShieldCheck className="w-6 h-6 text-[#34A853]" />
            <h3>Google Business Profile Authenticity & Verification Statement</h3>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            All reviews displayed on this platform are indexed directly from our verified <strong>Smart Life Typing & Studio Google Business Profiles</strong> (Abu Shagara Main Branch and Al Majaz 1 Branch in Sharjah). We strictly adhere to Google’s review guidelines. Every review reflects authentic customer experiences for UAE visa processing, Emirates ID typing, medical fitness scheduling, EJARI tenancy registration, SEWA connections, MoHRE labor contracts, MoFA attestations, and Indian consulate services.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 text-[#4285F4]">
            <button
              onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara)}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Abu Shagara on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.alMajaz)}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Al Majaz on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
