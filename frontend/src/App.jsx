import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// SkinsLoot pages
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import CaseOpeningPage from './pages/CaseOpeningPage';
import InventoryPage from './pages/InventoryPage';
import BattlesPage from './pages/BattlesPage';
import BattleDetailPage from './pages/BattleDetailPage';
import TradesPage from './pages/TradesPage';
import DepositPage from './pages/DepositPage';
import FAQPage from './pages/FAQPage';

// Market pages
import MarketplacePage from './pages/MarketplacePage';
import SkinDetailPage from './pages/SkinDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SteamCallbackPage from './pages/SteamCallbackPage';

// Protected pages
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import WalletPage from './pages/WalletPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSkinsPage from './pages/admin/AdminSkinsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCasesPage from './pages/admin/AdminCasesPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import AdminCaseHistoryPage from './pages/admin/AdminCaseHistoryPage';
import AdminBattlesPage from './pages/admin/AdminBattlesPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* SkinsLoot */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:slug" element={<CaseOpeningPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/battles" element={<BattlesPage />} />
        <Route path="/battles/:id" element={<BattleDetailPage />} />
        <Route path="/trades" element={<ProtectedRoute><TradesPage /></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Market */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/skins/:id" element={<SkinDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/steam/callback" element={<SteamCallbackPage />} />

        {/* Protected */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/skins" element={<AdminRoute><AdminSkinsPage /></AdminRoute>} />
        <Route path="/admin/cases" element={<AdminRoute><AdminCasesPage /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><AdminTransactionsPage /></AdminRoute>} />
        <Route path="/admin/case-history" element={<AdminRoute><AdminCaseHistoryPage /></AdminRoute>} />
        <Route path="/admin/battles" element={<AdminRoute><AdminBattlesPage /></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><AdminNotificationsPage /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <p className="text-8xl font-black text-loot-muted mb-4">404</p>
            <p className="text-2xl font-bold mb-2">Page not found</p>
            <p className="text-loot-muted mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-loot-primary">Go Home</a>
          </div>
        } />
      </Route>
    </Routes>
  );
}
