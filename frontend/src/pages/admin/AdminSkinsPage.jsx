import { useEffect, useState } from 'react';
import { adminService, categoryService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const RARITIES = ['CONSUMER', 'INDUSTRIAL', 'MIL_SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', 'CONTRABAND'];
const EXTERIORS = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED'];

const EMPTY = {
  name: '', weapon: '', rarity: 'CONSUMER', exterior: 'FACTORY_NEW',
  float: '0', price: '', stock: '0', description: '', categoryId: '',
  isAvailable: true, isStatTrak: false, isSouvenir: false, lore: '',
};

export default function AdminSkinsPage() {
  const [skins, setSkins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const [skinsRes, catRes] = await Promise.all([
        adminService.getAdminSkins({ page: p, limit: 15, search }),
        categoryService.getAll(),
      ]);
      setSkins(skinsRes.data.data);
      setPagination(skinsRes.data.pagination);
      setCategories(catRes.data.data.categories);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page, search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (skin) => {
    setEditing(skin);
    setForm({
      name: skin.name, weapon: skin.weapon, rarity: skin.rarity, exterior: skin.exterior,
      float: String(skin.float), price: String(skin.price), stock: String(skin.stock),
      description: skin.description || '', categoryId: String(skin.categoryId),
      isAvailable: skin.isAvailable, isStatTrak: skin.isStatTrak, isSouvenir: skin.isSouvenir,
      lore: skin.lore || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (editing) await adminService.updateSkin(editing.id, fd);
      else await adminService.createSkin(fd);
      setShowModal(false);
      load(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Энэ skin-г устгах уу?')) return;
    try { await adminService.deleteSkin(id); load(page); } catch { /* ignore */ }
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skin Удирдах</h1>
        <button onClick={openCreate} className="btn-loot-primary flex items-center gap-2 text-sm">
          <PlusIcon className="w-4 h-4" /> Skin нэмэх
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          className="loot-input max-w-sm"
          placeholder="Skin нэрээр хайх..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <>
          <div className="loot-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  {['ID', 'Нэр', 'Зэвсэг', 'Ховор зэрэг', 'Гадна', 'Үнэ', 'Нөөц', 'StatTrak', 'Боломжтой', ''].map((h) => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skins.map((skin) => (
                  <tr key={skin.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                    <td className="py-2.5 pr-4 text-loot-muted">#{skin.id}</td>
                    <td className="py-2.5 pr-4 font-medium max-w-[160px] truncate">{skin.name}</td>
                    <td className="py-2.5 pr-4 text-loot-muted">{skin.weapon}</td>
                    <td className="py-2.5 pr-4 text-xs">{skin.rarity?.replace('_', ' ')}</td>
                    <td className="py-2.5 pr-4 text-xs text-loot-muted">{skin.exterior?.replace(/_/g, ' ')}</td>
                    <td className="py-2.5 pr-4 text-loot-gold font-bold">${parseFloat(skin.price).toFixed(2)}</td>
                    <td className="py-2.5 pr-4">{skin.stock}</td>
                    <td className="py-2.5 pr-4">
                      <span className={skin.isStatTrak ? 'text-orange-400 text-xs' : 'text-loot-muted text-xs'}>
                        {skin.isStatTrak ? 'ST™' : '—'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${skin.isAvailable ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {skin.isAvailable ? 'Тийм' : 'Үгүй'}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(skin)} className="p-1.5 hover:text-white text-loot-muted transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(skin.id)} className="p-1.5 hover:text-red-400 text-loot-muted transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {skins.length === 0 && (
                  <tr><td colSpan="10" className="text-center text-loot-muted py-10">Skin олдсонгүй</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-loot-card border border-loot-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">{editing ? 'Skin засах' : 'Шинэ Skin нэмэх'}</h2>
                <button onClick={() => setShowModal(false)} className="text-loot-muted hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-xl p-3 mb-4 text-sm">{error}</div>
              )}

              <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-loot-muted block mb-1">Нэр *</label>
                  <input className="loot-input" value={form.name} onChange={(e) => f('name', e.target.value)} required />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Зэвсэг *</label>
                  <input className="loot-input" placeholder="AK-47" value={form.weapon} onChange={(e) => f('weapon', e.target.value)} required />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Ангилал *</label>
                  <select className="loot-input" value={form.categoryId} onChange={(e) => f('categoryId', e.target.value)} required>
                    <option value="">Сонгох</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Ховор зэрэг</label>
                  <select className="loot-input" value={form.rarity} onChange={(e) => f('rarity', e.target.value)}>
                    {RARITIES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Гадна байдал</label>
                  <select className="loot-input" value={form.exterior} onChange={(e) => f('exterior', e.target.value)}>
                    {EXTERIORS.map((e) => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Үнэ ($) *</label>
                  <input className="loot-input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => f('price', e.target.value)} required />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Нөөц</label>
                  <input className="loot-input" type="number" min="0" value={form.stock} onChange={(e) => f('stock', e.target.value)} />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Float (0–1)</label>
                  <input className="loot-input" type="number" step="0.0001" min="0" max="1" value={form.float} onChange={(e) => f('float', e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-loot-muted block mb-1">Тайлбар</label>
                  <textarea className="loot-input resize-none" rows={2} value={form.description} onChange={(e) => f('description', e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-loot-muted block mb-1">Lore</label>
                  <textarea className="loot-input resize-none" rows={2} value={form.lore} onChange={(e) => f('lore', e.target.value)} />
                </div>

                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-white w-4 h-4" checked={form.isAvailable} onChange={(e) => f('isAvailable', e.target.checked)} />
                    <span>Боломжтой</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-white w-4 h-4" checked={form.isStatTrak} onChange={(e) => f('isStatTrak', e.target.checked)} />
                    <span>StatTrak™</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-white w-4 h-4" checked={form.isSouvenir} onChange={(e) => f('isSouvenir', e.target.checked)} />
                    <span>Souvenir</span>
                  </label>
                </div>

                <div className="col-span-2 flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-loot-primary flex-1 text-sm">
                    {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-loot-secondary flex-1 text-sm">
                    Болих
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
