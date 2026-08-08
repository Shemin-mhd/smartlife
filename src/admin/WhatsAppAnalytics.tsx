import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Smartphone, 
  Monitor, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  Zap,
  MapPin
} from 'lucide-react';
import { WhatsAppClickEvent } from '../types';
import { fetchWhatsAppClicks, deleteWhatsAppClickEvent, subscribeWhatsAppClicks, clearAllWhatsAppClicks } from '../firebase/dbServices';

export const WhatsAppAnalytics: React.FC = () => {
  const [clicks, setClicks] = useState<WhatsAppClickEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time live updates
    const unsubscribe = subscribeWhatsAppClicks((liveData) => {
      setClicks(liveData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this click log entry?')) {
      await deleteWhatsAppClickEvent(id);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all recorded WhatsApp click logs?')) {
      await clearAllWhatsAppClicks();
    }
  };

  // KPI Computations
  const totalClicks = clicks.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayClicks = clicks.filter(c => c.timestamp.startsWith(todayStr)).length;

  // Find Top Clicked Button Location
  const locationCounts: Record<string, number> = {};
  clicks.forEach(c => {
    locationCounts[c.buttonLocation] = (locationCounts[c.buttonLocation] || 0) + 1;
  });
  const topLocationEntry = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];
  const topLocation = topLocationEntry ? topLocationEntry[0] : 'N/A';

  // Find Top Page Path
  const pageCounts: Record<string, number> = {};
  clicks.forEach(c => {
    const cleanPath = c.pagePath.split('#')[0] || '/';
    pageCounts[cleanPath] = (pageCounts[cleanPath] || 0) + 1;
  });
  const topPageEntry = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0];
  const topPage = topPageEntry ? topPageEntry[0] : '/';

  // Unique Button Location List for dropdown filter
  const uniqueLocations = Array.from(new Set(clicks.map(c => c.buttonLocation)));

  const filteredClicks = clicks.filter(c => {
    const matchesSearch = 
      c.buttonLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pagePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contextDetails && c.contextDetails.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || c.buttonLocation === locationFilter;
    const matchesDevice = deviceFilter === 'all' || c.deviceType === deviceFilter;

    return matchesSearch && matchesLocation && matchesDevice;
  });

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <MessageSquare className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">WhatsApp Click Analytics & Leads Tracker</h2>
            <p className="text-[11px] text-slate-500">Track every WhatsApp click location, page path, date & time across the site</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={async () => {
              setLoading(true);
              const fresh = await fetchWhatsAppClicks();
              setClicks(fresh);
              setLoading(false);
            }} 
            disabled={loading}
            className="p-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded flex items-center gap-1.5 font-medium transition cursor-pointer"
            title="Refresh WhatsApp Clicks Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Logs</span>
          </button>

          {clicks.length > 0 && (
            <button 
              onClick={handleClearAll} 
              className="p-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 flex items-center gap-1 font-medium transition cursor-pointer"
              title="Clear all recorded WhatsApp click logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All Logs</span>
            </button>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search location, service, page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded w-44 sm:w-56 focus:outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-700 max-w-[140px]"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Total WA Clicks</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{totalClicks}</div>
          <p className="text-[10px] text-slate-400 mt-1">Recorded Lead Triggers</p>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Today's Clicks</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{todayClicks}</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">Live Today</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Top Location Trigger</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate" title={topLocation}>{topLocation}</div>
          <p className="text-[10px] text-slate-400 mt-1">{locationCounts[topLocation] || 0} Total Clicks</p>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider">Top Referring Page</span>
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">{topPage}</div>
          <p className="text-[10px] text-slate-400 mt-1">{pageCounts[topPage] || 0} Click Events</p>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Breakdown */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Clicks Distribution by Button Location
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([loc, count]) => {
              const percent = Math.round((count / Math.max(totalClicks, 1)) * 100);
              return (
                <div key={loc} className="space-y-1">
                  <div className="flex justify-between text-slate-700 text-[11px]">
                    <span className="font-medium">{loc}</span>
                    <span className="text-slate-500">{count} clicks ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Breakdown */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Clicks Distribution by Website Page
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([page, count]) => {
              const percent = Math.round((count / Math.max(totalClicks, 1)) * 100);
              return (
                <div key={page} className="space-y-1">
                  <div className="flex justify-between text-slate-700 text-[11px]">
                    <span className="font-medium font-mono">{page}</span>
                    <span className="text-slate-500">{count} clicks ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Clicks Feed Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Date & Time</th>
                <th className="px-4 py-2.5">Button Trigger Location</th>
                <th className="px-4 py-2.5">Page Path</th>
                <th className="px-4 py-2.5">Context & Details</th>
                <th className="px-4 py-2.5">Device</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Loading WhatsApp click analytics feed...
                  </td>
                </tr>
              ) : filteredClicks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                    No WhatsApp click events match your filters.
                  </td>
                </tr>
              ) : (
                filteredClicks.map((click) => (
                  <tr key={click.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {new Date(click.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {click.buttonLocation}
                    </td>
                    <td className="px-4 py-3 text-blue-700 font-mono text-[11px] whitespace-nowrap">
                      {click.pagePath}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate" title={click.contextDetails}>
                      {click.contextDetails || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                        click.deviceType === 'Mobile' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {click.deviceType === 'Mobile' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                        {click.deviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {click.targetUrl && (
                        <a
                          href={click.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-200 transition inline-flex items-center gap-1"
                          title="Test WhatsApp target URL"
                        >
                          Target Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(click.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete log entry"
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
    </div>
  );
};
