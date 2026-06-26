import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';
import BottomNav from '../components/layout/BottomNav';
import { caseService, skinService } from '../services/marketplace.service';
import { getRarityStyle, getSkinDisplayName, getWeaponGradient, getSkinImage } from '../utils/skinVisuals';

// ── Case theme palette ────────────────────────────────────────────────────────
const THEMES = [
  { grad: 'from-purple-600 to-pink-900',   glow: 'shadow-purple-900/60', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',  accent: '#a855f7' },
  { grad: 'from-blue-600 to-cyan-900',     glow: 'shadow-blue-900/60',   badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',        accent: '#3b82f6' },
  { grad: 'from-orange-500 to-red-900',    glow: 'shadow-orange-900/60', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',  accent: '#f97316' },
  { grad: 'from-emerald-600 to-green-900', glow: 'shadow-green-900/60',  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', accent: '#10b981' },
  { grad: 'from-rose-600 to-red-900',      glow: 'shadow-rose-900/60',   badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',        accent: '#f43f5e' },
  { grad: 'from-yellow-500 to-amber-900',  glow: 'shadow-yellow-900/60', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',  accent: '#eab308' },
  { grad: 'from-indigo-600 to-violet-900', glow: 'shadow-indigo-900/60', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',  accent: '#6366f1' },
  { grad: 'from-slate-500 to-slate-900',   glow: 'shadow-slate-700/60',  badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',    accent: '#94a3b8' },
  { grad: 'from-teal-600 to-teal-900',     glow: 'shadow-teal-900/60',   badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',       accent: '#14b8a6' },
  { grad: 'from-fuchsia-600 to-pink-900',  glow: 'shadow-fuchsia-900/60',badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40', accent: '#d946ef' },
];

// ── Case box illustration ─────────────────────────────────────────────────────
function CaseBox({ theme, size = 'md' }) {
  const s = size === 'lg' ? 'w-36 h-28' : 'w-24 h-20';
  return (
    <div className={`relative ${s}`}>
      <div className={`absolute inset-0 rounded-xl blur-2xl opacity-40 bg-gradient-to-b ${theme.grad}`} />
      <div className={`relative w-full h-full bg-gradient-to-b ${theme.grad} rounded-xl border border-white/15 flex flex-col items-center justify-center overflow-hidden shadow-xl`}>
        <div className="absolute top-0 inset-x-0 h-1.5 bg-white/25 rounded-t-xl" />
        <div className="absolute top-4 inset-x-3 h-px bg-white/10" />
        <div className="absolute top-6 inset-x-5 h-px bg-white/10" />
        <svg className="w-7 h-7 text-white/35" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
        <div className="absolute bottom-2 inset-x-4 h-1 bg-white/20 rounded" />
      </div>
    </div>
  );
}

// ── Skin mini-card for the "Popular Skins" section ───────────────────────────
function SkinMiniCard({ skin }) {
  const rarity = getRarityStyle(skin.rarity);
  const { weapon, skinName } = getSkinDisplayName(skin);
  const gradient = getWeaponGradient(skin.weapon);
  const image = getSkinImage(skin);

  return (
    <Link to={`/skins/${skin.id}`} className={`loot-card overflow-hidden hover:border-white/20 hover:-translate-y-0.5 transition-all duration-150 ${rarity.glow}`}>
      <div className={`relative h-28 bg-loot-surface flex items-center justify-center overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
        {image ? (
          <img src={image} alt={skin.name} className="relative z-10 w-full h-full object-contain p-3 drop-shadow-lg" />
        ) : (
          <div className="relative z-10 text-center px-2">
            <p className="text-[10px] text-loot-muted">{weapon}</p>
            <p className="text-xs font-semibold leading-tight">{skinName}</p>
          </div>
        )}
        <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${rarity.bar} text-white/90`}>
          {skin.rarity?.replace(/_/g, ' ')}
        </span>
      </div>
      <div className={`h-0.5 ${rarity.bar}`} />
      <div className="px-2 py-1.5">
        <p className="text-[10px] text-loot-muted truncate">{weapon}</p>
        <p className="text-xs font-semibold truncate leading-snug">{skinName}</p>
        <p className="text-yellow-400 text-xs font-bold mt-0.5">${parseFloat(skin.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [popularSkins, setPopularSkins] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'featured'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      caseService.getCases(),
      skinService.getPopular(),
    ]).then(([casesRes, skinsRes]) => {
      setCases(casesRes.data.data.cases || []);
      setPopularSkins(skinsRes.data.data.skins || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const displayed = filter === 'featured'
    ? cases.filter((c) => c.isFeatured)
    : cases;

  const featuredCase = cases.find((c) => c.isFeatured) || cases[0];

  return (
    <div className="min-h-screen pb-24 bg-loot-bg">
      <TopNavbar />

      {/* ── Hero banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-loot-surface via-loot-card to-loot-bg border-b border-loot-border">
        {/* background glow blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
          {/* text */}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-loot-surface border border-loot-border text-loot-muted text-xs font-medium px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              ОДОО НЭЭЛТТЭЙ
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
              CS2 Кейс нээж<br />
              <span className="text-yellow-400">онцгой skin</span> хожоорой
            </h1>
            <p className="text-loot-muted text-sm md:text-base mb-6 leading-relaxed max-w-md">
              {cases.length} кейс нээлттэй байна. Дансаа цэнэглээд хүссэн кейсээ сонгоорой.
            </p>
            <div className="flex gap-3 flex-wrap">
              {featuredCase && (
                <Link to={`/cases/${featuredCase.slug}`} className="btn-loot-primary text-sm px-6">
                  Одоо нээх →
                </Link>
              )}
              <Link to="/deposit" className="btn-loot-secondary text-sm px-6">
                Данс цэнэглэх
              </Link>
            </div>
          </div>

          {/* floating case showcase */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {cases.slice(0, 3).map((c, i) => {
              const t = THEMES[i % THEMES.length];
              const scale = i === 1 ? 'scale-110 z-10' : 'scale-90 opacity-70';
              return (
                <Link key={c.id} to={`/cases/${c.slug}`}
                  className={`transition-all duration-200 hover:opacity-100 hover:scale-105 ${scale}`}>
                  <CaseBox theme={t} size="lg" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">

        {/* ── Cases section ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">Бүх кейс</h2>
              <p className="text-loot-muted text-xs mt-0.5">Кейс сонгоод нээж эхлэ</p>
            </div>
            {/* filter tabs */}
            <div className="flex bg-loot-surface border border-loot-border rounded-xl p-1 gap-1">
              {[['all', 'Бүгд'], ['featured', 'Онцлох']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === val
                      ? 'bg-loot-card text-white shadow'
                      : 'text-loot-muted hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-loot-border border-t-white rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20 text-loot-muted">
              <p className="text-4xl mb-3">📦</p>
              <p>Кейс олдсонгүй</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayed.map((c, i) => {
                const t = THEMES[i % THEMES.length];
                return (
                  <Link
                    key={c.id}
                    to={`/cases/${c.slug}`}
                    className="group loot-card overflow-hidden hover:border-white/25 hover:-translate-y-1 transition-all duration-200"
                  >
                    {/* image area */}
                    <div className="relative flex items-center justify-center py-7 bg-black/15">
                      {c.isFeatured && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                          ★ ХОТ
                        </span>
                      )}
                      <div className="group-hover:scale-105 transition-transform duration-200">
                        <CaseBox theme={t} />
                      </div>
                      <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${t.badge}`}>
                        {c._count?.caseItems || 0} зүйл
                      </div>
                    </div>

                    {/* info */}
                    <div className={`h-0.5 bg-gradient-to-r ${t.grad} opacity-60`} />
                    <div className="p-3">
                      <p className="font-semibold text-sm leading-snug line-clamp-1 mb-1">{c.name}</p>
                      <p className="text-loot-muted text-[10px] line-clamp-1 mb-2">{c.description || 'CS2 case'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 font-bold text-sm">
                          ${parseFloat(c.price).toFixed(2)}
                        </span>
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
        </section>

        {/* ── Popular skins section ───────────────────────────────────────── */}
        {popularSkins.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold">Эрэлттэй skinүүд</h2>
                <p className="text-loot-muted text-xs mt-0.5">Хамгийн их худалдан авсан skinүүд</p>
              </div>
              <Link to="/marketplace" className="text-xs text-loot-muted hover:text-white transition-colors">
                Бүгдийг үзэх →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {popularSkins.slice(0, 16).map((skin) => (
                <SkinMiniCard key={skin.id} skin={skin} />
              ))}
            </div>
          </section>
        )}

        {/* ── How it works ───────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold mb-5">Яаж ажилладаг вэ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '01', icon: '💳', title: 'Данс цэнэглэ', desc: 'Карт эсвэл криптогоор дансаа цэнэглэ.' },
              { step: '02', icon: '📦', title: 'Кейс сонго', desc: 'Хүссэн кейсээ сонгоод нээх товч дарна.' },
              { step: '03', icon: '🎮', title: 'Skin хүлээн ав', desc: 'Хожсон skin агуулахад автоматаар нэмэгдэнэ.' },
            ].map((item) => (
              <div key={item.step} className="loot-card p-5 flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-loot-surface border border-loot-border flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-loot-muted font-mono mb-0.5">АЛХАМ {item.step}</p>
                  <p className="font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-loot-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      <BottomNav />
    </div>
  );
}
