const RARITIES = ['CONSUMER', 'INDUSTRIAL', 'MIL_SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', 'CONTRABAND'];
const EXTERIORS = ['FACTORY_NEW', 'MINIMAL_WEAR', 'FIELD_TESTED', 'WELL_WORN', 'BATTLE_SCARRED'];

export default function SkinFilters({ filters, categories, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <select className="input text-sm" value={filters.rarity || ''} onChange={(e) => set('rarity', e.target.value)}>
        <option value="">All Rarities</option>
        {RARITIES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
      </select>

      <select className="input text-sm" value={filters.exterior || ''} onChange={(e) => set('exterior', e.target.value)}>
        <option value="">All Exteriors</option>
        {EXTERIORS.map((e) => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
      </select>

      <select className="input text-sm" value={filters.categoryId || ''} onChange={(e) => set('categoryId', e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <input
        className="input text-sm"
        type="number"
        placeholder="Min $"
        min="0"
        value={filters.minPrice || ''}
        onChange={(e) => set('minPrice', e.target.value)}
      />
      <input
        className="input text-sm"
        type="number"
        placeholder="Max $"
        min="0"
        value={filters.maxPrice || ''}
        onChange={(e) => set('maxPrice', e.target.value)}
      />

      <select
        className="input text-sm"
        value={`${filters.sortBy || 'createdAt'}:${filters.sortOrder || 'desc'}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(':');
          onChange({ ...filters, sortBy, sortOrder });
        }}
      >
        <option value="createdAt:desc">Newest First</option>
        <option value="price:asc">Price: Low → High</option>
        <option value="price:desc">Price: High → Low</option>
        <option value="name:asc">Name A–Z</option>
        <option value="float:asc">Float: Low → High</option>
      </select>
    </div>
  );
}
