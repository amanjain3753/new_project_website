import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Login({ navigate }: { navigate: (path: string) => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <div className="hidden lg:block space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold mb-6 shadow-lg shadow-brand-500/20">
              C
            </div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Welcome back to <br />
              <span className="text-brand-600">CouponSwap</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-6 leading-relaxed max-w-md">
              Log in to manage your listings, track your earnings, and discover the best deals on the marketplace.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { icon: ShieldCheck, title: 'Secure Access', desc: 'Your account is protected with industry-standard security.' },
              { icon: Zap, title: 'Instant Updates', desc: 'Get real-time notifications on your sales and purchases.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-10 h-10 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-xl flex items-center justify-center">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-modern p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="mb-10 lg:hidden">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold border border-red-100 dark:border-red-900/20"
              >
                {error}
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  className="input-modern pl-12"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" className="text-xs font-bold text-brand-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="input-modern pl-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-modern-primary w-full py-4 text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Login to Account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              New to CouponSwap?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-brand-600 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
