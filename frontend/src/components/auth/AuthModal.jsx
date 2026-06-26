import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-loot-card border border-loot-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-loot-muted hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-loot-surface border border-loot-border flex items-center justify-center">
            <svg className="w-4 h-4 text-loot-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
            </svg>
          </div>
          <span className="font-bold text-lg">Дөк, Ами, Чочироо 3ийн дэлгүүр</span>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-loot-accent text-black' : 'bg-loot-surface text-loot-muted hover:text-white'
            }`}
          >
            Нэвтрэх
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'register' ? 'bg-loot-accent text-black' : 'bg-loot-surface text-loot-muted hover:text-white'
            }`}
          >
            Бүртгүүлэх
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={onClose} onSwitchRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSuccess={() => setMode('login')} onSwitchLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

export function AuthGuard({ children, onAuthRequired }) {
  const { isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    if (!isAuthenticated()) {
      e.preventDefault();
      setShowModal(true);
      onAuthRequired?.();
    }
  };

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const requireAuth = (callback) => {
    if (isAuthenticated()) {
      callback?.();
      return true;
    }
    setIsOpen(true);
    return false;
  };

  const AuthModalWrapper = () => (
    <AuthModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );

  return { requireAuth, AuthModalWrapper, isOpen, setIsOpen };
}
