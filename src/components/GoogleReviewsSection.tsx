import React, { useState, useRef, useEffect } from 'react';
import { GOOGLE_PROFILE_STATS, GOOGLE_REVIEWS_DATA } from '../data/googleReviewsData';
import {
  Star,
  MapPin,
  ExternalLink,
  ThumbsUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface GoogleReviewsSectionProps {
  onNavigate?: (page: string) => void;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filterCategories = ['All', 'Family Visas', 'Indian Passport & Alhind', 'Attestation', 'Medical & ID'];

  const filteredReviews = GOOGLE_REVIEWS_DATA.filter((rev) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Family Visas') return rev.serviceCategory.includes('Visa');
    if (selectedFilter === 'Indian Passport & Alhind') return rev.serviceCategory.includes('Indian') || rev.serviceCategory.includes('Passport') || rev.serviceCategory.includes('Alhind');
    if (selectedFilter === 'Attestation') return rev.serviceCategory.includes('Attestation');
    if (selectedFilter === 'Medical & ID') return rev.serviceCategory.includes('Medical') || rev.serviceCategory.includes('ID');
    return true;
  });

  // Automatic Horizontal Scroll Loop (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, filteredReviews]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent triggering parent card click
    setLikedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openGoogleProfile = (url?: string) => {
    const targetUrl = url || GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="google-reviews" className="relative bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Bar - Clean Google Visual Identity */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Google Multi-Color Iconic G Badge */}
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4285F4] uppercase tracking-wider">Google Business Profile</span>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    • Verified Reviews
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Customer Feedback on Google
                </h2>
              </div>
            </div>
          </div>

          {/* Rating Summary + Google Action Button */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
              <span className="text-2xl font-black text-slate-900">{GOOGLE_PROFILE_STATS.overallRating}</span>
              <div className="space-y-0.5">
                <div className="flex items-center text-[#FBBC05]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  {GOOGLE_PROFILE_STATS.totalReviews}+ Verified Reviews
                </p>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('reviews')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 rounded-xl transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span>View All 240+ Reviews</span>
              </button>
            )}

            <button
              onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara)}
              className="bg-[#4285F4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-3 rounded-xl transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <span>Write a Review on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills & Manual Scroll Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedFilter === cat
                    ? 'bg-[#4285F4] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Left/Right Scroll Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Single Scroll Stream (Auto-scrolls horizontally, pauses on hover) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory pt-2"
        >
          {filteredReviews.map((rev) => {
            const isLiked = likedReviews[rev.id];
            const likes = (rev.likesCount || 0) + (isLiked ? 1 : 0);
            const targetUrl = rev.googleUrl || GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara;

            return (
              <div
                key={rev.id}
                onClick={() => openGoogleProfile(targetUrl)}
                className="w-[300px] sm:w-[340px] shrink-0 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-[#4285F4] transition-all flex flex-col justify-between space-y-4 snap-start relative cursor-pointer group overflow-hidden"
              >
                {/* Google Signature 4-Color Gradient Bar at top of card */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

                <div className="space-y-3 pt-1">
                  {/* Top user header with Google multi-color gradient ring on avatar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {/* Google Colors Avatar Ring */}
                      <div className="p-[2px] rounded-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] shrink-0">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {rev.authorName.charAt(0)}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[#4285F4] transition-colors flex items-center gap-1">
                          <span>{rev.authorName}</span>
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <CheckCircle2 className="w-3 h-3 text-[#34A853] shrink-0" />
                          <span>Google Reviewer</span>
                        </div>
                      </div>
                    </div>

                    {/* Google External Link indicator */}
                    <div className="p-1 rounded bg-slate-50 text-slate-400 group-hover:text-[#4285F4] group-hover:bg-blue-50 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-0.5 text-[#FBBC05]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                  </div>

                  {/* Service Badge */}
                  <div className="inline-block bg-slate-100 text-slate-700 font-semibold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                    {rev.serviceCategory}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 text-xs leading-relaxed line-clamp-4 italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Card Footer: Branch Location & Direct Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                    <MapPin className="w-3 h-3 text-[#EA4335] shrink-0" />
                    <span className="truncate max-w-[140px]">{rev.branchName}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleLike(e, rev.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded transition-colors ${isLiked ? 'text-[#4285F4] bg-blue-50' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current text-[#4285F4]' : ''}`} />
                      <span>{likes}</span>
                    </button>

                    <span className="text-[10px] text-[#4285F4] font-bold group-hover:underline flex items-center gap-0.5">
                      <span>Google</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean, Professional Light Bottom Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Official Google Business Profiles</h4>
              <p className="text-[11px] text-slate-500">Click below to open live Google Maps, directions, and customer feedback.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.abuShagara)}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Abu Shagara Profile</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => openGoogleProfile(GOOGLE_PROFILE_STATS.googleProfileLinks.alMajaz)}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#34A853]" />
              <span>Al Majaz Profile</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};


