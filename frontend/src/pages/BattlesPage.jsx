import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';
import { battleService, caseService } from '../services/marketplace.service';

const MODES = [
  { value: 'ONE_V_ONE', label: '1 vs 1', players: 2 },
  { value: 'TWO_V_TWO', label: '2 vs 2', players: 4 },
  { value: 'GROUP', label: 'Group Battle', players: 4 },
];

export default function BattlesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [battles, setBattles] = useState([]);
  const [cases, setCases] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ mode: 'ONE_V_ONE', caseId: '', caseCount: 1, isPrivate: false });
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [battlesRes, casesRes, rankingsRes] = await Promise.all([
        battleService.list({ status: 'WAITING' }),
        caseService.getCases(),
        battleService.getRankings(),
      ]);
      setBattles(battlesRes.data.data || []);
      setCases(casesRes.data.data.cases || []);
      setRankings(rankingsRes.data.data.rankings || []);
      if (!form.caseId && casesRes.data.data.cases?.[0]) {
        setForm((f) => ({ ...f, caseId: String(casesRes.data.data.cases[0].id) }));
      }
    } catch {
      setMessage('Failed to load battles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }
    setCreating(true);
    setMessage('');
    try {
      const { data } = await battleService.create({
        ...form,
        caseId: parseInt(form.caseId, 10),
        caseCount: parseInt(form.caseCount, 10),
      });
      navigate(`/battles/${data.data.battle.id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create battle');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (battleId) => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      const { data } = await battleService.join(battleId, { inviteCode: inviteCode || undefined });
      navigate(`/battles/${data.data.battle.id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to join battle');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Case Battles</h1>
            <p className="text-loot-muted text-sm">Compete in real-time case openings. Winner takes all skins.</p>
          </div>
          {isAuthenticated() && (
            <Link to="/battles/history" className="btn-secondary text-sm">Battle History</Link>
          )}
        </div>

        {message && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 rounded-xl p-3 text-sm mb-6">{message}</div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="loot-card p-5">
              <h2 className="font-bold mb-4">Public Battles</h2>
              {isLoading ? (
                <LoadingSpinner className="py-12" />
              ) : battles.length === 0 ? (
                <p className="text-loot-muted text-sm py-8 text-center">No open battles. Create one below!</p>
              ) : (
                <div className="space-y-3">
                  {battles.map((battle) => (
                    <div key={battle.id} className="flex items-center justify-between bg-loot-bg border border-loot-border rounded-xl p-4">
                      <div>
                        <p className="font-semibold">{battle.case?.name}</p>
                        <p className="text-xs text-loot-muted">
                          {MODES.find((m) => m.value === battle.mode)?.label || battle.mode}
                          {' · '}{battle.participants?.length || 0}/{battle.maxPlayers} players
                          {' · '}${parseFloat(battle.case?.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/battles/${battle.id}`} className="btn-secondary text-sm py-2">View</Link>
                        <button onClick={() => handleJoin(battle.id)} className="btn-loot-primary text-sm py-2">Join</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated() && (
              <form onSubmit={handleCreate} className="loot-card p-5">
                <h2 className="font-bold mb-4">Create Battle</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-loot-muted block mb-1">Game Mode</label>
                    <select className="loot-input" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                      {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-loot-muted block mb-1">Case</label>
                    <select className="loot-input" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })} required>
                      {cases.map((c) => <option key={c.id} value={c.id}>{c.name} (${c.price})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-loot-muted block mb-1">Cases per player</label>
                    <input type="number" min="1" max="5" className="loot-input" value={form.caseCount} onChange={(e) => setForm({ ...form, caseCount: e.target.value })} />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.isPrivate} onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })} />
                      Private battle (invite code)
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={creating} className="btn-loot-primary mt-4 w-full md:w-auto">
                  {creating ? 'Creating...' : 'Create Battle'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="loot-card p-5">
              <h2 className="font-bold mb-4">Player Rankings</h2>
              {rankings.length === 0 ? (
                <p className="text-loot-muted text-sm">No rankings yet</p>
              ) : (
                <div className="space-y-2">
                  {rankings.map((r) => (
                    <div key={r.userId} className="flex justify-between text-sm border-b border-loot-border pb-2">
                      <span>#{r.rank} User {r.userId}</span>
                      <span className="text-loot-gold">{r.wins} wins</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="loot-card p-5">
              <h2 className="font-bold mb-2">Join Private Battle</h2>
              <input className="loot-input mb-3" placeholder="Invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} />
              <p className="text-xs text-loot-muted">Enter an invite code when joining a private battle.</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
