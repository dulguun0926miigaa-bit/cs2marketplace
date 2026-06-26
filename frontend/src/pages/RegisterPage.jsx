import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="loot-card w-full max-w-md p-6">
        <RegisterForm onSuccess={() => navigate('/')} />
        <p className="text-center text-loot-muted text-sm mt-4">
          <Link to="/login" className="text-white hover:underline">Already have an account?</Link>
        </p>
      </div>
    </div>
  );
}
