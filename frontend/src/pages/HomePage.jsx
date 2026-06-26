import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';
import RecentDropsTicker from '../components/layout/RecentDropsTicker';
import BottomNav from '../components/layout/BottomNav';
import { caseService } from '../services/marketplace.service';

const CASE_GRADIENTS = [
  'from-purple-900/40 via-pink-900/20 to-loot-card',
  'from-gray-800/40 via-gray-900/20 to-loot-card',
  'from-blue-900/40 via-cyan-900/20 to-loot-card',
  'from-orange-900/40 via-red-900/20 to-loot-card',
];

export default function HomePage() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    caseService.getCases({ featured: true }).then(({ data }) => {
      setCases(data.data.cases || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      <RecentDropsTicker />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Daily Loot Box Hero */}
        <section className="loot-card p-6 md:p-8 mb-8 bg-gradient-to-br from-loot-surface via-loot-card to-loot-bg overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-loot-cyan/20 to-transparent" />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 rounded-2xl bg-loot-card border border-loot-cyan/30 flex items-center justify-center">
              <div className="w-32 h-24 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border border-loot-cyan/50 relative">
                <div className="absolute inset-x-2 top-3 h-0.5 bg-loot-cyan/80 rounded" />
                <div className="absolute inset-x-4 top-6 h-0.5 bg-loot-cyan/60 rounded" />
                <div className="absolute inset-x-3 bottom-3 h-0.5 bg-loot-cyan/40 rounded" />
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <span className="inline-block bg-loot-surface border border-loot-border text-loot-muted text-xs font-medium px-3 py-1 rounded-full mb-4">
              ОДОО НЭЭЛТТЭЙ
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Өдрийн CS2 кейс</h1>
            <p className="text-loot-muted text-sm md:text-base mb-6 leading-relaxed">
              24 цаг тутам агуулахаа нэмэгдүүлж, онцгой skin авах боломжоо туршаарай.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/cases/dreams-nightmares" className="btn-loot-primary text-sm">
                Кейс нээх
              </Link>
              <Link to="/cases" className="btn-loot-secondary text-sm">
                Дэлгэрэнгүй
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Cases */}
        <section>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold">Онцлох кейсүүд</h2>
              <p className="text-loot-muted text-sm">Дэлгүүрийн хамгийн эрэлттэй уналтууд.</p>
            </div>
            <Link to="/cases" className="text-sm text-loot-muted hover:text-white transition-colors mt-1">
              Бүгдийг үзэх
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {cases.slice(0, 4).map((caseItem, i) => (
              <Link
                key={caseItem.id}
                to={`/cases/${caseItem.slug}`}
                className="loot-card overflow-hidden group hover:border-loot-muted transition-all"
              >
                <div className={`aspect-square bg-gradient-to-b ${CASE_GRADIENTS[i % CASE_GRADIENTS.length]} flex items-center justify-center p-4 group-hover:scale-[1.02] transition-transform`}>
                  <div className="w-20 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg border border-loot-border relative shadow-lg">
                    <div className="absolute inset-x-2 top-2 h-0.5 bg-white/20 rounded" />
                    <div className="absolute inset-x-3 top-4 h-0.5 bg-white/10 rounded" />
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-loot-gold/30 rounded" />
                  </div>
                </div>
                <div className="p-3 border-t border-loot-border">
                  <p className="font-semibold text-sm truncate">{caseItem.name}</p>
                  <p className="text-loot-gold text-sm font-bold mt-0.5">${parseFloat(caseItem.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
            {cases.length === 0 && (
              <>
                {['Dreams & Nightmares', 'Revolution', 'Recoil', 'Kilowatt'].map((name, i) => (
                  <Link key={name} to="/cases" className="loot-card overflow-hidden">
                    <div className={`aspect-square bg-gradient-to-b ${CASE_GRADIENTS[i]} flex items-center justify-center`}>
                      <div className="w-20 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg border border-loot-border" />
                    </div>
                    <div className="p-3 border-t border-loot-border">
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-loot-gold text-sm font-bold">$2.49</p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
