import { useEffect, useState } from 'react';
import useSkinStore from '../store/skinStore';
import SkinCard from '../components/skin/SkinCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { collectionService } from '../services/marketplace.service';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

const EMPTY_FILTERS = {
  search: '', weapon: '', rarity: '', exterior: '', categoryId: '', collectionId: '',
  minPrice: '', maxPrice: '', minFloat: '', maxFloat: '', isStatTrak: '', isSouvenir: '',
  sellerName: '', sortBy: 'createdAt', sortOrder: 'desc',
};

export default function MarketplacePage() {
  const { skins, pagination, categories, fetchSkins, fetchCategories, isLoading } = useSkinStore();
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    v !== '' && !['sortBy', 'sortOrder', 'search'].includes(k)
  ).length;

  useEffect(() => {
    fetchCategories();
    collectionService.getAll()
      .then((r) => setCollections(r.data.data.collections || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = {
      page,
      limit: 20,
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
    };
    fetchSkins(params);
  }, [page, filters]);

  const handleFilter = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = { page: 1, limit: 20, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) };
    fetchSkins(params);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-loot-muted text-sm mt-1">CS2 Skin-үүдийг хайж олоорой</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-loot-muted" />
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

      {/* Filters Panel */}
      {showFilters && (
        <div className="loot-card p-4 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">Дэлгэрэнгүй шүүлтүүр</h3>
            <div className="flex gap-2">
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-loot-muted hover:text-white flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" /> Арилгах
                </button>
              )}
              <button onClick={() => setShowFilters(false)} className="text-loot-muted hover:text-white">
                <XMarkIcon className="w-4 h-4" />
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
                {EXTERIORS.map((e) => <option key={e} value={e}>{EXTERIOR_LABELS[e]}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-1">Ангилал</label>
              <select className="loot-input text-sm" value={filters.categoryId} onChange={(e) => handleFilter('categoryId', e.target.value)}>
                <option value="">Бүгд</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-1">Цуглуулга</label>
              <select className="loot-input text-sm" value={filters.collectionId} onChange={(e) => handleFilter('collectionId', e.target.value)}>
                <option value="">Бүгд</option>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-1">Мin үнэ ($)</label>
              <input className="loot-input text-sm" type="number" min="0" placeholder="0" value={filters.minPrice} onChange={(e) => handleFilter('minPrice', e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-1">Max үнэ ($)</label>
              <input className="loot-input text-sm" type="number" min="0" placeholder="9999" value={filters.maxPrice} onChange={(e) => handleFilter('maxPrice', e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-1">Min float</label>
              <input className="loot-input text-sm" type="number" step="0.0001" min="0" max="1" placeholder="0.0" value={filters.minFloat} onChange={(e) => handleFilter('minFloat', e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-loot-muted block mb-1">Max float</label>
              <input className="loot-input text-sm" type="number" step="0.0001" min="0" max="1" placeholder="1.0" value={filters.maxFloat} onChange={(e) => handleFilter('maxFloat', e.target.value)} />
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

      {/* Results count + quick sort (when filters hidden) */}
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

      {/* Results Grid */}
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
    </div>
  );
}
