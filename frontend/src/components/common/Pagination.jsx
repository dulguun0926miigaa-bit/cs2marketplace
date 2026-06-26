export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;

  const pages = [];
  const maxVisible = 7;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-xl text-sm border border-loot-border text-loot-muted hover:border-loot-muted hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ←
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPage(1)} className="px-3 py-1.5 rounded-xl text-sm border border-loot-border text-loot-muted hover:text-white">1</button>
          {start > 2 && <span className="text-loot-muted px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            p === page
              ? 'bg-white text-black border border-white'
              : 'border border-loot-border text-loot-muted hover:border-loot-muted hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-loot-muted px-1">…</span>}
          <button onClick={() => onPage(totalPages)} className="px-3 py-1.5 rounded-xl text-sm border border-loot-border text-loot-muted hover:text-white">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-xl text-sm border border-loot-border text-loot-muted hover:border-loot-muted hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
}
