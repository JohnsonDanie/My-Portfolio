import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, Code2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../../lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/admin';

  if (user) {
    return <Navigate to={from} replace />;
  }

  useEffect(() => {
    if (auth && isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      if (emailForSignIn) {
        setLoading(true);
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            navigate(from, { replace: true });
          })
          .catch((err) => {
            setError(err.message || 'Error signing in with link');
            setLoading(false);
          });
      }
    }
  }, [navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050c1a] flex flex-col items-center justify-center p-6 mesh-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 flex flex-col items-center">
           <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Code2 size={24} style={{ color: 'white' }} />
            </div>
          <h1 className="text-3xl font-bold text-white mb-2">CMS Login</h1>
          <p className="text-slate-400">Manage your portfolio content</p>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {sent ? (
             <div className="text-center py-6">
              <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
              <p className="text-slate-400 mb-6 text-sm">
                We've sent a magic link to <strong>{email}</strong>. Click the link to log in.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 text-rose-400 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center"
              >
                <span className="flex items-center gap-2 relative z-10 w-full justify-center">
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight size={18} />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
        </div>
        
        <div className="text-center mt-8">
           <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-semibold">
              ← Back to Portfolio
           </button>
        </div>
      </motion.div>
    </div>
  );
}
