import { useEffect, useState } from 'react';
import { adminService } from '../../services/marketplace.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  avatar: '',
  role: 'User',
  isActive: true,
  isVerified: false,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const load = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const { data } = await adminService.getUsers({ page: p, limit: 20, search: q });
      setUsers(data.data);
      setPagination(data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page, search); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      avatar: user.avatar || '',
      role: user.role || 'User',
      isActive: user.isActive,
      isVerified: user.isVerified,
    });
    setModalError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setModalError('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    setModalError('');
    try {
      await adminService.updateUser(editingUser.id, form);
      closeModal();
      load(page, search);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Хадгалах үед алдаа гарлаа');
    }
    setSaving(false);
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Энэ хэрэглэгчийг идэвхгүй болгох уу?')) return;
    try {
      await adminService.deleteUser(id);
      load(page, search);
    } catch (err) {
      alert(err.response?.data?.message || 'Үйлдэл амжилтгүй боллоо');
    }
  };

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Хэрэглэгч Удирдах</h1>
          <p className="text-sm text-loot-muted mt-1">Эндээс админ хэрэглэгчүүдийг засах, идэвхгүй болгох, эрхийг шинэчлэх боломжтой.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-loot-muted">🔍</span>
            <input
              className="loot-input pl-10 w-full"
              placeholder="Имэйл эсвэл нэвтрэх нэрээр хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-loot-primary text-sm">Хайх</button>
        </form>
      </div>

      {loading ? <LoadingSpinner size="lg" className="py-20" /> : (
        <>
          <div className="loot-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-loot-muted border-b border-loot-border text-xs uppercase">
                  {['ID', 'Нэвтрэх нэр', 'Имэйл', 'Нэр', 'Эрх', 'Идэвхтэй', 'Баталгаажсан', 'Огноо', 'Үйлдэл'].map((h) => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-loot-border/40 hover:bg-loot-surface transition-colors">
                    <td className="py-2.5 pr-4 text-loot-muted">#{u.id}</td>
                    <td className="py-2.5 pr-4 font-medium">{u.username}</td>
                    <td className="py-2.5 pr-4 text-loot-muted text-xs">{u.email}</td>
                    <td className="py-2.5 pr-4 text-loot-muted">{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'Admin'
                          ? 'bg-loot-gold/20 text-loot-gold border border-loot-gold/30'
                          : 'bg-loot-surface text-loot-muted border border-loot-border'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {u.isActive ? 'Тийм' : 'Үгүй'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.isVerified ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {u.isVerified ? 'Тийм' : 'Үгүй'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-loot-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="px-2 py-1 text-xs border border-loot-border rounded-lg hover:border-white transition-colors"
                        >
                          Засах
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeactivate(u.id)}
                          className="px-2 py-1 text-xs border border-red-700 text-red-300 rounded-lg hover:bg-red-900/10 transition-colors"
                        >
                          Идэвхгүй болгох
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="9" className="text-center text-loot-muted py-10">Хэрэглэгч олдсонгүй</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination pagination={pagination} onPage={setPage} />
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-loot-card border border-loot-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold">Хэрэглэгч засварлах</h2>
                  <p className="text-sm text-loot-muted">{editingUser?.email} ({editingUser?.username})</p>
                </div>
                <button type="button" onClick={closeModal} className="text-loot-muted hover:text-white">✕</button>
              </div>

              {modalError && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-xl p-3 mb-4 text-sm">{modalError}</div>
              )}

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-loot-muted block mb-1">Нэвтрэх нэр</label>
                  <input className="loot-input bg-loot-surface text-loot-muted" value={editingUser?.username || ''} readOnly />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-loot-muted block mb-1">Имэйл</label>
                  <input className="loot-input bg-loot-surface text-loot-muted" value={editingUser?.email || ''} readOnly />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Нэр</label>
                  <input className="loot-input" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Овог</label>
                  <input className="loot-input" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-loot-muted block mb-1">Avatar URL</label>
                  <input className="loot-input" value={form.avatar} onChange={(e) => updateField('avatar', e.target.value)} />
                </div>

                <div>
                  <label className="text-xs text-loot-muted block mb-1">Эрх</label>
                  <select className="loot-input" value={form.role} onChange={(e) => updateField('role', e.target.value)}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-loot-muted block mb-1">Идэвхтэй</label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => updateField('isActive', e.target.checked)} />
                    <span className="text-sm">Тийм</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-loot-muted block mb-1">Баталгаажсан</label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.isVerified} onChange={(e) => updateField('isVerified', e.target.checked)} />
                    <span className="text-sm">Тийм</span>
                  </label>
                </div>

                <div className="col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
                  <button type="submit" disabled={saving} className="btn-loot-primary flex-1 text-sm">
                    {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                  </button>
                  <button type="button" onClick={closeModal} className="btn-loot-secondary flex-1 text-sm">
                    Буцах
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
