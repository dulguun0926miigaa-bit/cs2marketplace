import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import SteamConnectButton from '../components/common/SteamConnectButton';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white mb-1">Бүртгүүлэх</h1>
          <p className="text-gray-500 text-sm">Хурдан бүртгүүлж эхлэ</p>
        </div>

        {/* Steam — primary */}
        <div className="mb-4">
          <SteamConnectButton className="w-full py-3 text-base" label="Steam-ээр бүртгүүлэх" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-[#1e2530]" />
          <span className="text-[11px] uppercase tracking-widest text-gray-600">эсвэл имэйлээр</span>
          <div className="h-px flex-1 bg-[#1e2530]" />
        </div>

        <div className="bg-[#141921] border border-[#1e2530] rounded-2xl p-6">
          <RegisterForm onSuccess={() => navigate('/')} />
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Бүртгэлтэй юу?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline font-semibold">Нэвтрэх</Link>
        </p>
      </div>
    </div>
  );
}
