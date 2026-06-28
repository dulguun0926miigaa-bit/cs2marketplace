import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';
import BottomNav from '../components/layout/BottomNav';
import { caseService } from '../services/marketplace.service';

// ── Per-case gradient themes ──────────────────────────────────────────────────
const THEMES = [
  { grad: 'from-purple-700 via-pink-800 to-purple-950',   glow: '#a855f7', border: '#a855f740' },
  { grad: 'from-yellow-600 via-orange-700 to-yellow-950', glow: '#eab308', border: '#eab30840' },
  { grad: 'from-blue-600 via-cyan-700 to-blue-950',       glow: '#3b82f6', border: '#3b82f640' },
  { grad: 'from-rose-600 via-red-700 to-rose-950',        glow: '#f43f5e', border: '#f43f5e40' },
  { grad: 'from-emerald-600 via-green-700 to-emerald-950',glow: '#10b981', border: '#10b98140' },
  { grad: 'from-indigo-600 via-violet-700 to-indigo-950', glow: '#6366f1', border: '#6366f140' },
  { grad: 'from-orange-500 via-amber-600 to-orange-950',  glow: '#f97316', border: '#f9731640' },
  { grad: 'from-teal-600 via-cyan-600 to-teal-950',       glow: '#14b8a6', border: '#14b8a640' },
  { grad: 'from-fuchsia-600 via-pink-600 to-fuchsia-950', glow: '#d946ef', border: '#d946ef40' },
  { grad: 'from-slate-500 via-zinc-700 to-slate-950',     glow: '#94a3b8', border: '#94a3b840' },
];

// ── SVG Case illustration ─────────────────────────────────────────────────────
function CaseIllustration({ theme, name, size = 'md' }) {
  const sz = size === 'lg' ? 'w-28 h-22' : size === 'sm' ? 'w-16 h-13' : 'w-22 h-18';
  const initials = name
    .replace(/ Case$/, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className={`relative w-full aspect-[4/3]`}>
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-xl blur-xl opacity-30"
        style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }}
      />
      {/* Case body */}
      <div
        className={`relative w-full h-full rounded-xl border flex flex-col items-center justify-center overflow-hidden`}
        style={{
          background: `linear-gradient(145deg, ${theme.glow}22 0%, #0d111800 100%)`,
          borderColor: theme.border,
          boxShadow: `0 0 20px ${theme.glow}18`,
        }}
      >
        {/* Top stripe */}
        <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${theme.glow}, transparent)` }} />
        {/* Inner detail lines */}
        <div className="absolute top-4 inset-x-6 h-px opacity-20 rounded" style={{ backgroundColor: theme.glow }} />
        <div className="absolute top-6 inset-x-8 h-px opacity-10 rounded" style={{ backgroundColor: theme.glow }} />

        {/* Lock icon */}
        <svg className="w-8 h-8 mb-1" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke={theme.glow} strokeWidth="1.5" fill={`${theme.glow}18`} />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke={theme.glow} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.5" fill={theme.glow} />
        </svg>

        {/* Case name abbreviation */}
        <p className="text-xs font-bold tracking-wider opacity-80 px-2 text-center leading-tight"
          style={{ color: theme.glow }}>
          {initials}
        </p>

        {/* Bottom stripe */}
        <div className="absolute bottom-3 inset-x-4 h-1.5 rounded opacity-30" style={{ backgroundColor: theme.glow }} />
      </div>
    </div>
  );
}

// ── Featured banner case ──────────────────────────────────────────────────────
function FeaturedCaseBanner({ cs2case, theme }) {
  return (
    <Link
      to={`/cases/${cs2case.slug}`}
      className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
      style={{ borderColor: theme.border, boxShadow: `0 0 30px ${theme.glow}15` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.grad} opacity-20`} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d111780] to-transparent" />

      <div className="relative flex items-center gap-8 p-6">
        <div className="w-40 shrink-0">
          <CaseIllustration theme={theme} name={cs2case.name} size="lg" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border mb-3 uppercase tracking-wider"
            style={{ color: theme.glow, borderColor: `${theme.glow}44`, backgroundColor: `${theme.glow}11` }}>
            ★ ОНЦЛОХ КЕЙС
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 group-hover:text-yellow-400 transition-colors">
            {cs2case.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{cs2case.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-extrabold" style={{ color: theme.glow }}>
              ${parseFloat(cs2case.price).toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">{cs2case._count?.caseItems || 0} арьс</span>
            <span className="ml-auto text-sm font-bold text-black px-5 py-2 rounded-xl transition-all"
              style={{ backgroundColor: theme.glow }}>
              Нээх →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CasesPage() {
  const [cases,   setCases]   = useState([]);
  const [filter,  setFilter]  = useState('all');
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    caseService.getCases()
      .then((r) => {
        const list = r?.data?.data?.cases || r?.data?.cases || [];
        setCases(list);
      })
      .catch((err) => console.error('getCases error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter((c) => {
    if (filter === 'featured' && !c.isFeatured) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = cases.filter((c) => c.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen pb-24 bg-[#080c10]">
      <TopNavbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[#1e2530]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-600/8 blur-3xl" />
          <div className="absolute -bottom-16 left-1/4 w-80 h-80 rounded-full bg-yellow-500/8 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Шууд нээлттэй</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                CS2 Кейсүүд
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {cases.length} кейс нээлттэй — дансаа цэнэглэж хүссэн кейсийг нэг дороос нээ
              </p>
            </div>
            <Link to="/deposit" className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Данс цэнэглэх
            </Link>
          </div>

          {/* Featured cases */}
          {!loading && featured.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4 mb-2">
              {featured.map((c, i) => (
                <FeaturedCaseBanner key={c.id} cs2case={c} theme={THEMES[i % THEMES.length]} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Cases grid ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full bg-[#141921] border border-[#1e2530] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
              placeholder="Кейс хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Filter tabs */}
          <div className="flex bg-[#141921] border border-[#1e2530] rounded-xl p-1 gap-1">
            {[['all', 'Бүгд'], ['featured', '★ Онцлох']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === v ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {/* Sort: price */}
          <select
            className="bg-[#141921] border border-[#1e2530] rounded-xl px-3 py-2 text-xs text-gray-400 focus:outline-none"
            defaultValue="default"
            onChange={(e) => {
              const val = e.target.value;
              setCases((prev) => [...prev].sort((a, b) =>
                val === 'price-asc'  ? a.price - b.price :
                val === 'price-desc' ? b.price - a.price :
                val === 'name'       ? a.name.localeCompare(b.name) :
                (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
              ));
            }}
          >
            <option value="default">Онцлох эхлээд</option>
            <option value="price-asc">Үнэ: бага → их</option>
            <option value="price-desc">Үнэ: их → бага</option>
            <option value="name">Нэр A–Z</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            {filter === 'featured' ? 'Онцлох кейсүүд' : 'Бүх кейс'}
          </h2>
          <span className="text-xs text-gray-500">{filtered.length} кейс</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#141921] border border-[#1e2530] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[#1e2530]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#1e2530] rounded w-3/4" />
                  <div className="h-3 bg-[#1e2530] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-300 font-semibold text-lg mb-1">Кейс олдсонгүй</p>
            <p className="text-gray-500 text-sm">
              {search ? `"${search}" хайлтанд тохирох кейс алга` : 'Шүүлтүүрийг өөрчилнэ үү'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-4 text-xs text-yellow-400 hover:underline">
                Хайлт арилгах
              </button>
            )}
          </div>
        )}

        {/* Case grid - SkinsMonkey style */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filtered.map((c, i) => {
              const t = THEMES[i % THEMES.length];
              return (
                <Link
                  key={c.id}
                  to={`/cases/${c.slug}`}
                  className="group rounded-2xl overflow-hidden border border-[#1e2530] bg-[#141921] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{ boxShadow: `0 0 20px ${t.glow}10` }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 12px 40px ${t.glow}25`}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${t.glow}10`}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#1a1f26] to-[#141921] p-4 border-b border-[#1e2530]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors truncate leading-tight">
                          {c.name}
                        </h3>
                        {c.isFeatured && (
                          <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                            ★ FEATURED
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-xl font-bold text-yellow-400">
                          ${parseFloat(c.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{c.description}</p>
                  </div>

                  {/* Case Preview */}
                  <div className="relative h-32 overflow-hidden p-0">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-400 via-purple-400 to-blue-400" />
                    <img
                      src={c.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80'}
                      alt={c.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2">
                      <p className="text-[10px] text-gray-200 font-semibold uppercase tracking-widest">
                        {c._count?.caseItems || '30+'} skins
                      </p>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="p-4 border-t border-[#1e2530] bg-gradient-to-r from-[#0d1117] to-[#141921]">
                    <button className="w-full py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95">
                      OPEN FOR ${parseFloat(c.price).toFixed(2)}
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-2">
                      {c.isFeatured ? '★ Featured' : 'Limited Supply'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      {!loading && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="border-t border-[#1e2530] pt-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Яаж ажилладаг вэ?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '01', icon: '💳', title: 'Данс цэнэглэ', desc: 'Карт эсвэл банкны шилжүүлгээр дансаа цэнэглэ.', link: '/deposit', linkText: 'Цэнэглэх →' },
                { step: '02', icon: '📦', title: 'Кейс сонго', desc: 'Хүссэн кейсээ сонгоод "Нээх" товч дарна уу.', link: null },
                { step: '03', icon: '🎮', title: 'Skin хүлээн ав', desc: 'Хожсон skin агуулахад автоматаар нэмэгдэнэ.', link: '/inventory', linkText: 'Агуулах →' },
              ].map((item) => (
                <div key={item.step} className="bg-[#141921] border border-[#1e2530] rounded-xl p-5 flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1e2530] flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono mb-0.5">АЛХАМ {item.step}</p>
                    <p className="font-bold text-sm text-white mb-1">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    {item.link && (
                      <Link to={item.link} className="text-xs text-yellow-400 hover:underline mt-1 inline-block">
                        {item.linkText}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
