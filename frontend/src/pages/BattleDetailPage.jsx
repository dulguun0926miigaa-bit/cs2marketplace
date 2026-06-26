import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';
import { battleService } from '../services/marketplace.service';

export default function BattleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { fetchBalance } = useWalletStore();
  const [battle, setBattle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMsg, setChatMsg] = useState('');
  const [countdown, setCountdown] = useState(null);

  const loadBattle = async () => {
    try {
      const { data } = await battleService.getById(id);
      setBattle(data.data.battle);
      if (data.data.battle.status === 'COMPLETED') fetchBalance();
    } catch {
      setBattle(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBattle();
    const interval = setInterval(loadBattle, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (battle?.status === 'COUNTDOWN' && battle.countdownAt) {
      const tick = () => {
        const remaining = Math.max(0, Math.ceil((new Date(battle.countdownAt).getTime() + 5000 - Date.now()) / 1000));
        setCountdown(remaining);
      };
      tick();
      const t = setInterval(tick, 500);
      return () => clearInterval(t);
    }
    return undefined;
  }, [battle?.status, battle?.countdownAt]);

  const handleJoin = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      await battleService.join(id, {});
      loadBattle();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join');
    }
  };

  const sendChat = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    try {
      await battleService.sendMessage(id, chatMsg);
      setChatMsg('');
      loadBattle();
    } catch { /* ignore */ }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <Header showBack backTo="/battles" />
        <LoadingSpinner size="lg" className="py-40" />
        <BottomNav />
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen pb-20">
        <Header showBack backTo="/battles" />
        <div className="text-center py-20 text-loot-muted">Battle not found</div>
        <BottomNav />
      </div>
    );
  }

  const isParticipant = battle.participants?.some((p) => p.userId === user?.id);
  const winner = battle.participants?.find((p) => p.isWinner);

  return (
    <div className="min-h-screen pb-20">
      <Header showBack backTo="/battles" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="loot-card p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold">{battle.case?.name} Battle</h1>
              <p className="text-loot-muted text-sm">{battle.mode.replace(/_/g, ' ')} · {battle.caseCount} case(s)</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full border ${
              battle.status === 'COMPLETED' ? 'border-green-700 text-green-400' :
              battle.status === 'COUNTDOWN' ? 'border-yellow-700 text-yellow-400' :
              'border-loot-border text-loot-muted'
            }`}>{battle.status}</span>
          </div>

          {battle.status === 'COUNTDOWN' && countdown !== null && (
            <div className="text-center py-8">
              <p className="text-6xl font-black text-loot-gold">{countdown}</p>
              <p className="text-loot-muted text-sm mt-2">Battle starting...</p>
            </div>
          )}

          {battle.status === 'WAITING' && (
            <div className="text-center py-6">
              <p className="text-loot-muted mb-4">{battle.participants?.length}/{battle.maxPlayers} players joined</p>
              {!isParticipant && (
                <button onClick={handleJoin} className="btn-loot-primary">Join Battle</button>
              )}
              {battle.isPrivate && battle.inviteCode && isParticipant && (
                <p className="text-sm mt-4">Invite code: <span className="font-mono text-loot-gold">{battle.inviteCode}</span></p>
              )}
            </div>
          )}

          {battle.status === 'COMPLETED' && (
            <div className="text-center py-6">
              <p className="text-2xl font-bold text-loot-gold mb-2">Winner: {winner?.username || `User ${battle.winnerId}`}</p>
              <p className="text-loot-muted">Total value: ${parseFloat(battle.totalValue || 0).toFixed(2)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {battle.participants?.map((p) => (
              <div key={p.id} className={`rounded-xl p-3 border ${p.isWinner ? 'border-loot-gold bg-loot-gold/10' : 'border-loot-border'}`}>
                <p className="font-semibold text-sm">{p.username}</p>
                <p className="text-xs text-loot-muted">${parseFloat(p.totalValue || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {battle.rounds?.length > 0 && (
          <div className="loot-card p-5 mb-6">
            <h2 className="font-bold mb-4">Round Results</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {battle.rounds.map((r) => (
                <div key={r.id} className="flex justify-between text-sm border-b border-loot-border pb-2">
                  <span>Round {r.roundNumber} · User {r.userId}</span>
                  <span>{r.skin?.name} · ${parseFloat(r.skinValue).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="loot-card p-5">
          <h2 className="font-bold mb-4">Battle Chat</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
            {battle.messages?.map((m) => (
              <p key={m.id} className="text-sm"><span className="text-loot-gold">{m.username}:</span> {m.message}</p>
            ))}
          </div>
          {isAuthenticated() && isParticipant && battle.status !== 'COMPLETED' && (
            <form onSubmit={sendChat} className="flex gap-2">
              <input className="loot-input flex-1" value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} placeholder="Type a message..." />
              <button type="submit" className="btn-loot-primary">Send</button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/battles" className="text-sm text-loot-muted hover:text-white">← Back to battles</Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
