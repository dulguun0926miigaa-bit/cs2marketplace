import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const EMPTY = { name: '', slug: '', description: '', price: '', isFeatured: false, isActive: true };

export default function AdminCasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getAdminCases();
      setCases(data.data.cases || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', price: String(c.price), isFeatured: c.isFeatured, isActive: c.isActive });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await adminService.updateCase(editing.id, form);
      else await adminService.createCase(form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Кейс Удирдах</h1>
        <button onClick={openCreate} className="btn-loot-primary flex items-center gap-2 text-sm">
          <PlusIcon className="w-4 h-4" /> Кейс нэмэх
        </button>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <div className="loot-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                {['ID', 'Нэр', 'Slug', 'Үнэ', 'Онцгой', 'Идэвхтэй', ''].map((h) => (
                  <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-loot-border/40 hover:bg-loot-surface">
                  <td className="py-2.5 pr-4 text-loot-muted">#{c.id}</td>
                  <td className="py-2.5 pr-4 font-medium">{c.name}</td>
                  <td className="py-2.5 pr-4 text-loot-muted text-xs font-mono">{c.slug}</td>
                  <td className="py-2.5 pr-4 text-loot-gold font-bold">${parseFloat(c.price).toFixed(2)}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs ${c.isFeatured ? 'text-loot-gold' : 'text-loot-muted'}`}>{c.isFeatured ? '⭐' : '—'}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${c.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {c.isActive ? 'Тийм' : 'Үгүй'}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button onClick={() => openEdit(c)} className="p-1.5 hover:text-white text-loot-muted">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-loot-card border border-loot-border rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">{editing ? 'Кейс засах' : 'Шинэ Кейс'}</h2>
                <button onClick={() => setShowModal(false)} className="text-loot-muted hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              {error && <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-xl p-3 mb-4 text-sm">{error}</div>}
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Нэр *</label>
                  <input className="loot-input" value={form.name} onChange={(e) => f('name', e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Slug *</label>
                  <input className="loot-input font-mono" placeholder="my-case-slug" value={form.slug} onChange={(e) => f('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} required />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Үнэ ($) *</label>
                  <input className="loot-input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => f('price', e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Тайлбар</label>
                  <textarea className="loot-input resize-none" rows={2} value={form.description} onChange={(e) => f('description', e.target.value)} />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-white w-4 h-4" checked={form.isFeatured} onChange={(e) => f('isFeatured', e.target.checked)} />
                    <span>Онцгой</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-white w-4 h-4" checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)} />
                    <span>Идэвхтэй</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={saving} className="btn-loot-primary flex-1 text-sm">{saving ? 'Хадгалж байна...' : 'Хадгалах'}</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-loot-secondary flex-1 text-sm">Болих</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
