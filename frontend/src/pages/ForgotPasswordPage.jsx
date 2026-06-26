import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setMsg('If that email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-gray-400 mb-8">Enter your email to receive a reset link.</p>

        {msg && <div className="bg-green-900/30 border border-cs2-green text-cs2-green rounded-lg p-3 mb-4 text-sm">{msg}</div>}
        {error && <div className="bg-red-900/30 border border-cs2-red text-cs2-red rounded-lg p-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          <Link to="/login" className="text-cs2-accent hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
