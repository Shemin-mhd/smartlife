import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { FaqItem } from '../types';
import { fetchFaqs, saveFaq, deleteFaq, subscribeFaqs } from '../firebase/dbServices';

export const FaqsManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const loadFaqsData = async () => {
    setLoading(true);
    const data = await fetchFaqs();
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeFaqs((liveFaqs) => {
      setFaqs(liveFaqs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this FAQ item?')) {
      await deleteFaq(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    await saveFaq(editingFaq);
    await loadFaqsData();
    setEditingFaq(null);
  };

  const handleOpenAddModal = () => {
    setIsNew(true);
    setEditingFaq({
      id: Date.now(),
      question: '',
      answer: '',
      category: 'Visas'
    });
  };

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">FAQ Content Manager</h2>
            <p className="text-[11px] text-slate-500">Manage frequently asked questions & customer support answers</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadFaqsData} 
            disabled={loading}
            className="p-1.5 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50"
            title="Refresh FAQs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Question</th>
                <th className="px-4 py-2.5">Answer Excerpt</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Loading FAQs...
                  </td>
                </tr>
              ) : faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs">{faq.question}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-sm truncate">{faq.answer}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingFaq(faq);
                      }}
                      className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingFaq && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{isNew ? 'Add FAQ Item' : 'Edit FAQ Item'}</h3>
              <button onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  placeholder="e.g. Visas, Attestation, General"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  placeholder="e.g. How long does visa renewal take?"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                  placeholder="Detailed support answer..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
