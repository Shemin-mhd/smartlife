import React, { useState, useEffect } from 'react';
import { Building2, Edit2, Phone, MapPin, Clock, ExternalLink, RefreshCw, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Branch } from '../types';
import { fetchBranches, saveBranch, deleteBranch, subscribeBranches } from '../firebase/dbServices';

export const BranchesManager: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isNewBranch, setIsNewBranch] = useState(false);

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

  const handleCreateBranch = () => {
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      name: 'Smart Life Typing Services (New Branch)',
      isMain: false,
      address: 'Shop No. 1, Building Name, Street Name',
      area: 'Sharjah City',
      city: 'Sharjah',
      emirate: 'Sharjah',
      landmark: 'Near Landmark',
      phoneDisplay: '+971 6 500 0000',
      phoneRaw: '97165000000',
      whatsapp: '971551585570',
      googleMapUrl: 'https://maps.google.com',
      workingHours: '9:00 AM – 11:00 PM',
      workingDays: 'Saturday to Thursday',
      fridayHours: '9:00 AM – 12:00 PM & 4:00 PM – 11:00 PM',
      rating: 4.9,
      reviewCount: 50
    };
    setIsNewBranch(true);
    setEditingBranch(newBranch);
  };

  const handleEditBranch = (branch: Branch) => {
    setIsNewBranch(false);
    setEditingBranch({ ...branch });
  };

  const handleDeleteBranch = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete branch "${name}"?`)) {
      await deleteBranch(id);
    }
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    await saveBranch(editingBranch);
    setEditingBranch(null);
  };

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Physical Branch & Contact Manager</h2>
            <p className="text-xs text-slate-500">Add new physical locations, update working hours, phone numbers, WhatsApp, & map URLs</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCreateBranch}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Branch</span>
          </button>
          <button 
            onClick={loadBranchesData} 
            disabled={loading}
            className="p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{branch.name}</h3>
                    {branch.isMain && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                        Main Headquarter
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{branch.landmark}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 text-slate-500" />
                    <span>Edit</span>
                  </button>
                  {!branch.isMain && (
                    <button
                      onClick={() => handleDeleteBranch(branch.id, branch.name)}
                      className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition cursor-pointer"
                      title="Delete Branch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Rating: <strong>{branch.rating || 4.9} ⭐</strong> ({branch.reviewCount || 100}+ Google Reviews)</span>
              <a href={branch.googleMapUrl} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold hover:underline flex items-center gap-1">
                Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white p-4 px-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">
                  {isNewBranch ? 'Add New Physical Branch' : `Edit Branch: ${editingBranch.name}`}
                </h3>
              </div>
              <button 
                onClick={() => setEditingBranch(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Life Typing Services (Al Khan Branch)"
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 pb-1">
                <input
                  type="checkbox"
                  id="isMainBranch"
                  checked={editingBranch.isMain}
                  onChange={(e) => setEditingBranch({ ...editingBranch, isMain: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="isMainBranch" className="text-slate-800 font-bold cursor-pointer">
                  Mark as Main Headquarter Branch
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Shop No. / Building Name / Street Address"
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium mb-2"
                />
                <input
                  type="text"
                  placeholder="Landmark e.g. Next to Orient Exchange, Opposite Abu Shagara Park"
                  value={editingBranch.landmark}
                  onChange={(e) => setEditingBranch({ ...editingBranch, landmark: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abu Shagara, Al Majaz, Al Qasimia"
                    value={editingBranch.area}
                    onChange={(e) => setEditingBranch({ ...editingBranch, area: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Emirate</label>
                  <select
                    value={editingBranch.emirate}
                    onChange={(e) => setEditingBranch({ ...editingBranch, emirate: e.target.value, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="Sharjah">Sharjah</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Display</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +971 6 555 5570"
                    value={editingBranch.phoneDisplay}
                    onChange={(e) => setEditingBranch({ 
                      ...editingBranch, 
                      phoneDisplay: e.target.value, 
                      phoneRaw: e.target.value.replace(/[^0-9+]/g, '') 
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Number (e.g. 971551585570)</label>
                  <input
                    type="text"
                    required
                    placeholder="971551585570"
                    value={editingBranch.whatsapp}
                    onChange={(e) => setEditingBranch({ ...editingBranch, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Working Hours</label>
                  <input
                    type="text"
                    required
                    placeholder="9:00 AM – 11:00 PM"
                    value={editingBranch.workingHours}
                    onChange={(e) => setEditingBranch({ ...editingBranch, workingHours: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Friday Hours (Optional)</label>
                  <input
                    type="text"
                    placeholder="4:00 PM – 11:00 PM"
                    value={editingBranch.fridayHours || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, fridayHours: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Google Maps URL</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/..."
                  value={editingBranch.googleMapUrl}
                  onChange={(e) => setEditingBranch({ ...editingBranch, googleMapUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                >
                  {isNewBranch ? 'Create Branch' : 'Save Branch Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
