import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  ExternalLink,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { InquiryItem, InquiryStatus } from '../types';
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from '../firebase/dbServices';

export const InquiriesInbox: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  const loadInquiries = async () => {
    setLoading(true);
    const data = await fetchInquiries();
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    await updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, editingNotes);
    setInquiries(prev => prev.map(item => item.id === selectedInquiry.id ? { ...item, notes: editingNotes } : item));
    setSelectedInquiry(prev => prev ? { ...prev, notes: editingNotes } : null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry record?')) {
      await deleteInquiry(id);
      setInquiries(prev => prev.filter(item => item.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const getWhatsAppLinkForClient = (inquiry: InquiryItem) => {
    const rawPhone = inquiry.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${inquiry.clientName}, greeting from Smart Life Typing Services Sharjah. Regarding your inquiry for ${inquiry.serviceTitle || inquiry.serviceCategory}, how can we assist you today?`
    );
    return `https://wa.me/${rawPhone}?text=${text}`;
  };

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      (item.serviceTitle && item.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">New Request</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">In Progress</span>;
      case 'contacted':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-800 border border-purple-200">Contacted</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Resolved</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Centralized Customer Inquiry Inbox</h2>
            <p className="text-[11px] text-slate-500">Live database of client messages & visa helper requests</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={loadInquiries}
            disabled={loading}
            className="p-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition flex items-center gap-1"
            title="Refresh Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, phone, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded w-48 sm:w-64 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400 text-slate-700"
          >
            <option value="all">All Statuses ({inquiries.length})</option>
            <option value="new">New ({inquiries.filter(i => i.status === 'new').length})</option>
            <option value="in_progress">In Progress</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Date & Time</th>
                <th className="px-4 py-2.5">Client Details</th>
                <th className="px-4 py-2.5">Service Requested</th>
                <th className="px-4 py-2.5">Message Snippet</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Direct Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Loading customer inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                    No inquiry records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{inquiry.clientName}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{inquiry.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="font-medium text-slate-900">{inquiry.serviceTitle || inquiry.serviceCategory}</div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{inquiry.source.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={inquiry.message}>
                      {inquiry.message}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {/* WhatsApp Direct Action Button */}
                      <a
                        href={getWhatsAppLinkForClient(inquiry)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium hover:bg-emerald-100 transition"
                        title="Chat with client on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        WhatsApp
                      </a>

                      {/* View / Edit Notes */}
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setEditingNotes(inquiry.notes || '');
                        }}
                        className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-200 transition"
                      >
                        Details & Notes
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete record"
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

      {/* Inquiry Detail & Status Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Inquiry Record #{selectedInquiry.id}</h3>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Client Name</span>
                  <div className="font-semibold text-slate-900 text-sm">{selectedInquiry.clientName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Contact Phone</span>
                  <div className="font-medium text-slate-800">{selectedInquiry.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Service Request</span>
                  <div className="font-medium text-slate-800">{selectedInquiry.serviceTitle || selectedInquiry.serviceCategory}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Submission Source</span>
                  <div className="capitalize text-slate-700">{selectedInquiry.source.replace('_', ' ')}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Full Message</span>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-800 font-sans leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Update Status</label>
                <div className="flex items-center gap-2">
                  {(['new', 'in_progress', 'contacted', 'resolved'] as InquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedInquiry.id, st)}
                      className={`px-2.5 py-1 rounded text-xs capitalize border font-medium transition ${selectedInquiry.status === st
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes Editor */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Staff Internal Notes</label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add internal PRO notes e.g., 'Called client, waiting for original passport scan'..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <a
                  href={getWhatsAppLinkForClient(selectedInquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp Client
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
