import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSkinStore from '../store/skinStore';
import SkinCard from '../components/skin/SkinCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { collectionService, caseService } from '../services/marketplace.service';

const RARITIES = ['CONSUMER', 'INDUSTRIAL', 'MIL_SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', 'CONTRABAND'];
const EXTERIORS = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED'];
const RARITY_LABELS = {
  CONSUMER: 'Consumer', INDUSTRIAL: 'Industrial', MIL_SPEC: 'Mil-Spec',
  RESTRICTED: 'Restricted', CLASSIFIED: 'Classified', COVERT: 'Covert', CONTRABAND: 'Contraband',
};
const EXTERIOR_LABELS = {
  FACTORY_NEW: 'Factory New', MINIMAL_WEAR: 'Minimal Wear', FIELD_TESTED: 'Field-Tested',
  WELL_WORN: 'Well-Worn', BATTLE_SCARRED: 'Battle-Scarred',
};
const CASE_THEMES = [
  'from-purple-600 to-pink-900', 'from-blue-600 to-cyan-900',
  'from-orange-500 to-red-900',  'from-emerald-600 to-green-900',
  'from-rose-600 to-red-900',    'from-yellow-500 to-amber-900',
  'from-indigo-600 to-violet-900','from-teal-600 to-teal-900',
];
const EMPTY_FILTERS = {
  search: '', weapon: '', rarity: '', exterior: '', categoryId: '', collectionId: '',
  minPrice: '', maxPrice: '', minFloat: '', maxFloat: '', isStatTrak: '', isSouvenir: '',
  sellerName: '', sortBy: 'createdAt', sortOrder: 'desc',
};

export default function MarketplacePage() {
  const { skins, pagination, categories, fetchSkins, fetchCategories, isLoading } = useSkinStore();
  const [collections, setCollections] = useState([]);
  const [cases, setCases]             = useState([]);
  const [filters, setFilters]         = useState(EMPTY_FILTERS);
  const [page, setPage]               = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab]     = useState('skins'); // 'skins' | 'cases'

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v !== '' && !['sortBy', 'sortOrder', 'search'].includes(k)
  ).length;

  useEffect(() => {
    fetchCategories();
    collectionService.getAll()
      .then((r) => setCollections(r.data.data.collections || []))
      .catch(() => {});
    caseService.getCases()
      .then((r) => setCases(r?.data?.data?.cases || r?.data?.cases || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = {
      page, limit: 20,
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
    };
    fetchSkins(params);
  }, [page, filters]);

  const handleFilter = (key, val) => { setFilters((f) => ({ ...f, [key]: val })); setPage(1); };
  const handleSearch = (e) => {
    e.preventDefault(); setPage(1);
    fetchSkins({ page: 1, limit: 20, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) });
  };
  const clearFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Дэлгүүр</h1>
        <p className="text-loot-muted text-sm mt-1">CS2 Skin болон Кейсүүд</p>
      </div>

      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div className="flex bg-loot-surface border border-loot-border rounded-xl p-1 gap-1 mb-6 w-fit">
        {[
          { id: 'skins', label: '🔫 Skinүүд' },
          { id: 'cases', label: `📦 Кейсүүд${cases.length > 0 ? ` (${cases.length})` : ''}` },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === id ? 'bg-loot-card text-white shadow' : 'text-loot-muted hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CASES TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cases' && (
        <>
          {cases.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-loot-muted">Кейс олдсонгүй</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cases.map((c, i) => {
                const grad = CASE_THEMES[i % CASE_THEMES.length];
                return (
                  <Link
                    key={c.id}
                    to={`/cases/${c.slug}`}
                    className="group loot-card overflow-hidden hover:border-white/25 hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="relative flex items-center justify-center py-7 bg-black/15">
                      {c.isFeatured && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                          ★ ХОТ
                        </span>
                      )}
                      <div className="group-hover:scale-105 transition-transform duration-200">
                        <div className="relative w-24 h-20">
                          <div className={`absolute inset-0 rounded-xl blur-2xl opacity-40 bg-gradient-to-b ${grad}`} />
                          <div className={`relative w-full h-full bg-gradient-to-b ${grad} rounded-xl border border-white/15 flex flex-col items-center justify-center overflow-hidden shadow-xl`}>
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-white/25 rounded-t-xl" />
                            <svg className="w-7 h-7 text-white/35" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                            <div className="absolute bottom-2 inset-x-4 h-1 bg-white/20 rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 text-white/60 bg-black/30">
                        {c._count?.caseItems || 0} зүйл
                      </div>
                    </div>
                    <div className={`h-0.5 bg-gradient-to-r ${grad} opacity-60`} />
                    <div className="p-3">
                      <p className="font-semibold text-sm leading-snug line-clamp-1 mb-1">{c.name}</p>
                      <p className="text-loot-muted text-[10px] line-clamp-1 mb-2">{c.description || 'CS2 case'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 font-bold text-sm">${parseFloat(c.price).toFixed(2)}</span>
                        <span className="text-[10px] bg-loot-surface border border-loot-border text-loot-muted group-hover:text-white group-hover:border-white/30 px-2 py-0.5 rounded-lg transition-colors">
                          Нээх
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SKINS TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'skins' && (
        <>
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-loot-muted">🔍</span>
              <input
                className="loot-input pl-10"
                placeholder="Skin нэр, зэвсэг, тайлбараар хайх..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn-loot-primary px-5">Хайх</button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${
                showFilters || activeFilterCount > 0
                  ? 'border-white text-white bg-loot-surface'
                  : 'border-loot-border text-loot-muted hover:border-loot-muted'
              }`}
            >
              <FunnelIcon className="w-4 h-4" />
              Шүүлтүүр
              {activeFilterCount > 0 && (
                <span className="bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>

          {/* Filters panel */}
          {showFilters && (
            <div className="loot-card p-4 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Дэлгэрэнгүй шүүлтүүр</h3>
                <div className="flex gap-2">
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-loot-muted hover:text-white flex items-center gap-1">
                      ✕ Арилгах
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="text-loot-muted hover:text-white">
                    ✕
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Зэвсэг</label>
                  <input className="loot-input text-sm" placeholder="AK-47, AWP..." value={filters.weapon} onChange={(e) => handleFilter('weapon', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Ховор зэрэг</label>
                  <select className="loot-input text-sm" value={filters.rarity} onChange={(e) => handleFilter('rarity', e.target.value)}>
                    <option value="">Бүгд</option>
                    {RARITIES.map((r) => <option key={r} value={r}>{RARITY_LABELS[r]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Гадна байдал</label>
                  <select className="loot-input text-sm" value={filters.exterior} onChange={(e) => handleFilter('exterior', e.target.value)}>
                    <option value="">Бүгд</option>
                    {EXTERIORS.map((ex) => <option key={ex} value={ex}>{EXTERIOR_LABELS[ex]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Ангилал</label>
                  <select className="loot-input text-sm" value={filters.categoryId} onChange={(e) => handleFilter('categoryId', e.target.value)}>
                    <option value="">Бүгд</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Цуглуулга</label>
                  <select className="loot-input text-sm" value={filters.collectionId} onChange={(e) => handleFilter('collectionId', e.target.value)}>
                    <option value="">Бүгд</option>
                    {collections.map((col) => <option key={col.id} value={col.id}>{col.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Min үнэ ($)</label>
                  <input className="loot-input text-sm" type="number" min="0" placeholder="0" value={filters.minPrice} onChange={(e) => handleFilter('minPrice', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Max үнэ ($)</label>
                  <input className="loot-input text-sm" type="number" min="0" placeholder="9999" value={filters.maxPrice} onChange={(e) => handleFilter('maxPrice', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Min float</label>
                  <input className="loot-input text-sm" type="number" step="0.0001" min="0" max="1" placeholder="0.00" value={filters.minFloat} onChange={(e) => handleFilter('minFloat', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Max float</label>
                  <input className="loot-input text-sm" type="number" step="0.0001" min="0" max="1" placeholder="1.00" value={filters.maxFloat} onChange={(e) => handleFilter('maxFloat', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">StatTrak</label>
                  <select className="loot-input text-sm" value={filters.isStatTrak} onChange={(e) => handleFilter('isStatTrak', e.target.value)}>
                    <option value="">Бүгд</option>
                    <option value="true">StatTrak™ Only</option>
                    <option value="false">StatTrak™ биш</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Souvenir</label>
                  <select className="loot-input text-sm" value={filters.isSouvenir} onChange={(e) => handleFilter('isSouvenir', e.target.value)}>
                    <option value="">Бүгд</option>
                    <option value="true">Souvenir Only</option>
                    <option value="false">Souvenir биш</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-loot-muted block mb-1">Эрэмбэлэх</label>
                  <select
                    className="loot-input text-sm"
                    value={`${filters.sortBy}:${filters.sortOrder}`}
                    onChange={(e) => {
                      const [s, o] = e.target.value.split(':');
                      setFilters((f) => ({ ...f, sortBy: s, sortOrder: o }));
                      setPage(1);
                    }}
                  >
                    <option value="createdAt:desc">Шинэ эхлээд</option>
                    <option value="popularity:desc">Хамгийн алдартай</option>
                    <option value="price:desc">Үнэ: Өндөрөөс доош</option>
                    <option value="price:asc">Үнэ: Доороос өндөрт</option>
                    <option value="name:asc">Нэр A–Z</option>
                    <option value="float:asc">Float: Доороос өндөрт</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick sort + result count */}
          {!showFilters && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-loot-muted text-sm">
                {isLoading ? 'Хайж байна...' : `${pagination?.total || 0} skin олдлоо`}
              </p>
              <select
                className="loot-input text-sm w-auto py-2"
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split(':');
                  setFilters((f) => ({ ...f, sortBy: s, sortOrder: o }));
                  setPage(1);
                }}
              >
                <option value="createdAt:desc">Шинэ</option>
                <option value="popularity:desc">Алдартай</option>
                <option value="price:desc">Үнэ ↓</option>
                <option value="price:asc">Үнэ ↑</option>
              </select>
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : skins.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-loot-muted text-lg mb-2">Skin олдсонгүй</p>
              <p className="text-loot-muted text-sm mb-4">Шүүлтүүрээ өөрчлөөд дахин үзээрэй</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="btn-loot-secondary text-sm">Шүүлтүүр арилгах</button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {skins.map((skin) => <SkinCard key={skin.id} skin={skin} />)}
              </div>
              <Pagination pagination={pagination} onPage={(p) => { setPage(p); window.scrollTo(0, 0); }} />
            </>
          )}
        </>
      )}
    </div>
  );
}
