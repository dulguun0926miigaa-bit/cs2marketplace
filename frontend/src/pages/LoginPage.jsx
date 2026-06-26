import LoginForm from '../components/auth/LoginForm';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="loot-card w-full max-w-md p-6">
        <LoginForm onSuccess={() => navigate('/')} />
        <p className="text-center text-loot-muted text-sm mt-4">
          <Link to="/register" className="text-white hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
