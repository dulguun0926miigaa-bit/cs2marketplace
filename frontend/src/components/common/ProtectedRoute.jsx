import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// While Zustand persist is rehydrating from localStorage, show a minimal
// loading screen instead of a blank black page.
function HydrationLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c10]">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isHydrated } = useAuthStore();

  // Still loading from localStorage — don't redirect yet
  if (!isHydrated) return <HydrationLoader />;

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isHydrated } = useAuthStore();

  if (!isHydrated) return <HydrationLoader />;

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin())          return <Navigate to="/" replace />;
  return children;
}
