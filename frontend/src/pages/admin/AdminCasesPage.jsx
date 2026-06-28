import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/marketplace.service';

const EMPTY = { name: '', slug: '', description: '', imageUrl: '', bannerUrl: '', animationUrl: '', price: '', isFeatured: false, isActive: true };

export default function AdminCasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [animationFile, setAnimationFile] = useState(null);
  // Manage case items
  const [manageCase, setManageCase] = useState(null);
  const [caseItems, setCaseItems] = useState([]);
  const [availableSkins, setAvailableSkins] = useState([]);
  const [newItemSkinId, setNewItemSkinId] = useState('');
  const [newItemDropRate, setNewItemDropRate] = useState('1');
  const [itemsLoading, setItemsLoading] = useState(false);

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
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      imageUrl: c.imageUrl || '',
      bannerUrl: c.bannerUrl || '',
      animationUrl: c.animationUrl || '',
      price: String(c.price),
      isFeatured: c.isFeatured,
      isActive: c.isActive,
    });
    setImageFile(null);
    setBannerFile(null);
    setAnimationFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // if any files provided, send multipart/form-data
      const hasFiles = imageFile || bannerFile || animationFile;
      if (hasFiles) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (imageFile) fd.append('image', imageFile);
        if (bannerFile) fd.append('banner', bannerFile);
        if (animationFile) fd.append('animation', animationFile);
        if (editing) await adminService.updateCase(editing.id, fd);
        else await adminService.createCase(fd);
      } else {
        if (editing) await adminService.updateCase(editing.id, form);
        else await adminService.createCase(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const openManage = async (c) => {
    setManageCase(c);
    setItemsLoading(true);
    try {
      const [{ data: itemsRes }, { data: skinsRes }] = await Promise.all([
        adminService.getCaseItems(c.id),
        adminService.getAdminSkins({ page: 1, limit: 200 }),
      ]);
      setCaseItems(itemsRes.items || []);
      setAvailableSkins(skinsRes.data.data || []);
      setNewItemSkinId('');
      setNewItemDropRate('1');
    } catch (err) {
      // ignore
    }
    setItemsLoading(false);
  };

  const closeManage = () => {
    setManageCase(null);
    setCaseItems([]);
    setAvailableSkins([]);
  };

  const handleAddItem = async () => {
    if (!newItemSkinId) return;
    try {
      await adminService.addCaseItem(manageCase.id, newItemSkinId, parseFloat(newItemDropRate));
      const { data } = await adminService.getCaseItems(manageCase.id);
      setCaseItems(data.items || []);
      setNewItemSkinId('');
      setNewItemDropRate('1');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleUpdateItem = async (itemId, dropRate) => {
    try {
      await adminService.updateCaseItem(manageCase.id, itemId, parseFloat(dropRate));
      const { data } = await adminService.getCaseItems(manageCase.id);
      setCaseItems(data.items || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Энэ skin-ийг кейсээс устгах уу?')) return;
    try {
      await adminService.deleteCaseItem(manageCase.id, itemId);
      const { data } = await adminService.getCaseItems(manageCase.id);
      setCaseItems(data.items || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!confirm('Энэ кейсийг устгах уу? Энэ үйлдэл нь сэргээгдэхгүй.')) return;
    try {
      await adminService.deleteCase(caseId);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete case');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Кейс Удирдах</h1>
        <button onClick={openCreate} className="btn-loot-primary flex items-center gap-2 text-sm">
          + Кейс нэмэх
        </button>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <div className="loot-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  {['ID', 'Image', 'Case Name', 'Description', 'Price', 'Total Items', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-loot-border/40 hover:bg-loot-surface">
                    <td className="py-2.5 pr-4 text-loot-muted">#{c.id}</td>
                    <td className="py-2.5 pr-4">
                      {c.imageUrl ? <img src={c.imageUrl} alt="case" className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-loot-surface rounded" />}
                    </td>
                    <td className="py-2.5 pr-4 font-medium">{c.name}</td>
                    <td className="py-2.5 pr-4 text-loot-muted text-xs max-w-[260px] truncate">{c.description || '—'}</td>
                    <td className="py-2.5 pr-4 text-loot-gold font-bold">${parseFloat(c.price).toFixed(2)}</td>
                    <td className="py-2.5 pr-4">{c._count?.caseItems || 0}</td>
                    <td className="py-2.5 pr-4 text-loot-muted text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5">
                      <div className="flex gap-2">
                        <a href={`/cases/${c.slug}`} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs border rounded">View</a>
                        <button onClick={() => openEdit(c)} className="px-2 py-1 text-xs border rounded">Edit</button>
                        <button onClick={() => openManage(c)} className="px-2 py-1 text-xs border rounded">Manage Items</button>
                        <button onClick={() => handleDeleteCase(c.id)} className="px-2 py-1 text-xs border border-red-700 text-red-300 rounded">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr><td colSpan="8" className="text-center text-loot-muted py-10">Кейс байхгүй байна</td></tr>
                )}
              </tbody>
            </table>
        </div>
      )}

      {/* Manage Case Items Modal */}
      {manageCase && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-loot-card border border-loot-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{manageCase.name} - Skins</h3>
                  <p className="text-sm text-loot-muted">Manage skins & drop rates for this case</p>
                </div>
                <button onClick={closeManage} className="text-loot-muted hover:text-white">✕</button>
              </div>

              <div className="mb-4">
                <div className="flex gap-2 items-center">
                  <select className="loot-input flex-1" value={newItemSkinId} onChange={(e) => setNewItemSkinId(e.target.value)}>
                    <option value="">Select skin to add</option>
                    {availableSkins.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} — ${parseFloat(s.price).toFixed(2)}</option>
                    ))}
                  </select>
                  <input className="loot-input w-28" type="number" min="0" step="0.01" value={newItemDropRate} onChange={(e) => setNewItemDropRate(e.target.value)} />
                  <button onClick={handleAddItem} className="btn-loot-primary">Add</button>
                </div>
              </div>

              {itemsLoading ? (
                <div className="py-8"><LoadingSpinner /></div>
              ) : (
                <div className="loot-card overflow-x-auto">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-loot-muted">Total drop rate:</div>
                      <div className="text-sm font-medium">
                        {caseItems.reduce((s, it) => s + (parseFloat(it.dropRate) || 0), 0).toFixed(2)}%
                      </div>
                    </div>
                    {Math.abs(caseItems.reduce((s, it) => s + (parseFloat(it.dropRate) || 0), 0) - 100) > 0.001 && (
                      <div className="text-xs text-yellow-300 mb-2">Нэмэлт анхааруулга: Drop rate нийлбэр 100% байх шаардлагатай (одоогоор төстэй биш)</div>
                    )}
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                        {['ID', 'Skin', 'Price', 'Drop Rate', 'Actions'].map((h) => (
                          <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {caseItems.map((it) => (
                        <tr key={it.id} className="border-b border-loot-border/40 hover:bg-loot-surface">
                          <td className="py-2.5 pr-4 text-loot-muted">#{it.id}</td>
                          <td className="py-2.5 pr-4 font-medium">{it.skin?.name}</td>
                          <td className="py-2.5 pr-4 text-loot-gold font-bold">${parseFloat(it.skin?.price || 0).toFixed(2)}</td>
                          <td className="py-2.5 pr-4">
                            <input className="loot-input w-28" defaultValue={String(it.dropRate)} onBlur={(e) => handleUpdateItem(it.id, e.target.value)} />
                          </td>
                          <td className="py-2.5">
                            <button onClick={() => handleDeleteItem(it.id)} className="px-2 py-1 text-xs border border-red-700 text-red-300 rounded-lg">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-loot-card border border-loot-border rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">{editing ? 'Кейс засах' : 'Шинэ Кейс'}</h2>
                <button onClick={() => setShowModal(false)} className="text-loot-muted hover:text-white">✕</button>
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
                  <label className="text-xs text-loot-muted block mb-1">Зурагны URL</label>
                  <input className="loot-input" placeholder="https://..." value={form.imageUrl} onChange={(e) => f('imageUrl', e.target.value)} />
                  <div className="mt-2">
                    <label className="text-xs text-loot-muted block mb-1">Эсвэл шинэ зураг оруулах</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    {imageFile && <p className="text-xs text-loot-muted mt-1">Сонгосон файл: {imageFile.name}</p>}
                  </div>
                  {(form.imageUrl || imageFile) && (
                    <div className="mt-3 flex items-center gap-3">
                      {form.imageUrl && !imageFile && (
                        <img src={form.imageUrl} alt="case image" className="w-24 h-16 object-cover rounded" />
                      )}
                      {imageFile && (
                        <div className="w-24 h-16 rounded overflow-hidden border border-loot-border">
                          <img src={URL.createObjectURL(imageFile)} alt="selected image" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Banner URL</label>
                  <input className="loot-input" placeholder="https://..." value={form.bannerUrl} onChange={(e) => f('bannerUrl', e.target.value)} />
                  <div className="mt-2">
                    <label className="text-xs text-loot-muted block mb-1">Эсвэл шинэ banner оруулах</label>
                    <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                    {bannerFile && <p className="text-xs text-loot-muted mt-1">Сонгосон файл: {bannerFile.name}</p>}
                  </div>
                  {(form.bannerUrl || bannerFile) && (
                    <div className="mt-3 flex items-center gap-3">
                      {form.bannerUrl && !bannerFile && (
                        <img src={form.bannerUrl} alt="case banner" className="w-24 h-16 object-cover rounded" />
                      )}
                      {bannerFile && (
                        <div className="w-24 h-16 rounded overflow-hidden border border-loot-border">
                          <img src={URL.createObjectURL(bannerFile)} alt="selected banner" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Animation URL (mp4 / gif)</label>
                  <input className="loot-input" placeholder="https://..." value={form.animationUrl} onChange={(e) => f('animationUrl', e.target.value)} />
                  <div className="mt-2">
                    <label className="text-xs text-loot-muted block mb-1">Эсвэл animation файл оруулах</label>
                    <input type="file" accept="video/*,image/gif" onChange={(e) => setAnimationFile(e.target.files?.[0] || null)} />
                    {animationFile && <p className="text-xs text-loot-muted mt-1">Сонгосон файл: {animationFile.name}</p>}
                  </div>
                  {(form.animationUrl || animationFile) && (
                    <div className="mt-3">
                      {form.animationUrl && !animationFile && (
                        <video controls className="w-full max-w-xs rounded border border-loot-border">
                          <source src={form.animationUrl} />
                        </video>
                      )}
                      {animationFile && (
                        <video controls className="w-full max-w-xs rounded border border-loot-border">
                          <source src={URL.createObjectURL(animationFile)} type={animationFile.type} />
                        </video>
                      )}
                    </div>
                  )}
                </div>
                {form.imageUrl && (
                  <div className="col-span-2">
                    <label className="text-xs text-loot-muted block mb-1">Зураг урьдчилсан харах</label>
                    <img src={form.imageUrl} alt="Case preview" className="w-full max-w-sm h-48 object-cover rounded-xl border border-loot-border" />
                  </div>
                )}
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
