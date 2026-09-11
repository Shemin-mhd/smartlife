import React, { useState, useEffect } from 'react';
import { Building2, Edit2, Phone, MapPin, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { Branch } from '../types';
import { fetchBranches, saveBranch, subscribeBranches } from '../firebase/dbServices';

export const BranchesManager: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const loadBranchesData = async () => {
    setLoading(true);
    const data = await fetchBranches();
    setBranches(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeBranches((liveBranches) => {
      setBranches(liveBranches);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    await saveBranch(editingBranch);
    await loadBranchesData();
    setEditingBranch(null);
  };

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Physical Branch & Contact Manager</h2>
            <p className="text-[11px] text-slate-500">Update working hours, phone numbers, WhatsApp, & map URLs</p>
          </div>
        </div>

        <button 
          onClick={loadBranchesData} 
          disabled={loading}
          className="p-1.5 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{branch.name}</h3>
                  {branch.isMain && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Main Headquarter</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{branch.landmark}</p>
              </div>
              <button
                onClick={() => setEditingBranch(branch)}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-medium hover:bg-slate-200 transition shrink-0"
              >
                Edit Info
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{branch.address}, {branch.area}, {branch.emirate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Phone: <strong className="font-semibold text-slate-900">{branch.phoneDisplay}</strong> | WhatsApp: <strong className="font-semibold text-slate-900">{branch.whatsapp}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Working Hours: <strong>{branch.workingHours}</strong> ({branch.workingDays})</span>
              </div>
              {branch.fridayHours && (
                <div className="pl-5 text-[11px] text-slate-500">
                  Friday: {branch.fridayHours}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Rating: <strong>{branch.rating || 4.9} ⭐</strong> ({branch.reviewCount || 100}+ Google Reviews)</span>
              <a href={branch.googleMapUrl} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1">
                Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Edit Branch: {editingBranch.name}</h3>
              <button onClick={() => setEditingBranch(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleSaveBranch} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Address & Landmark</label>
                <input
                  type="text"
                  required
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded mb-2"
                />
                <input
                  type="text"
                  value={editingBranch.landmark}
                  onChange={(e) => setEditingBranch({ ...editingBranch, landmark: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  placeholder="Landmark e.g. Next to Orient Exchange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Display</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.phoneDisplay}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phoneDisplay: e.target.value, phoneRaw: e.target.value.replace(/[^0-9+]/g, '') })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">WhatsApp Number (e.g. 971551585570)</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.whatsapp}
                    onChange={(e) => setEditingBranch({ ...editingBranch, whatsapp: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Working Hours</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.workingHours}
                    onChange={(e) => setEditingBranch({ ...editingBranch, workingHours: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Friday Hours</label>
                  <input
                    type="text"
                    value={editingBranch.fridayHours || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, fridayHours: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Google Maps URL</label>
                <input
                  type="text"
                  value={editingBranch.googleMapUrl}
                  onChange={(e) => setEditingBranch({ ...editingBranch, googleMapUrl: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition"
                >
                  Save Branch Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
