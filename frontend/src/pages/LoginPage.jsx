import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SteamConnectButton from '../components/common/SteamConnectButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const steamError = params.get('error');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white mb-1">Нэвтрэх</h1>
          <p className="text-gray-500 text-sm">CS2 Дэлгүүрт тавтай морил</p>
        </div>

        {/* Steam login — primary CTA */}
        <div className="mb-4">
          <SteamConnectButton className="w-full py-3 text-base" label="Steam-ээр нэвтрэх" />
          {steamError && (
            <p className="text-red-400 text-xs text-center mt-2">
              Steam нэвтрэлт амжилтгүй болсон. Дахин оролдно уу.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#1e2530]" />
          <span className="text-[11px] uppercase tracking-widest text-gray-600">эсвэл имэйлээр</span>
          <div className="h-px flex-1 bg-[#1e2530]" />
        </div>

        <div className="bg-[#141921] border border-[#1e2530] rounded-2xl p-6">
          <LoginForm onSuccess={() => navigate('/')} />
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Бүртгэлгүй юу?{' '}
          <Link to="/register" className="text-yellow-400 hover:underline font-semibold">Бүртгүүлэх</Link>
        </p>
      </div>
    </div>
  );
}
