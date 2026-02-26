import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Register({ navigate }: { navigate: (path: string) => void }) {
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-bold mb-8 border border-brand-100 dark:border-brand-900/30">
              <Sparkles size={16} />
              <span>Join 50,000+ smart savers</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Start your journey with <br />
              <span className="text-brand-600">CouponSwap</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-6 leading-relaxed max-w-md">
              Create an account to start selling your unused coupons or discover exclusive deals from trusted sellers.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { title: 'Free to Join', desc: 'No hidden fees or monthly subscriptions.' },
              { title: 'Secure Payments', desc: 'Industry-standard encryption for all transactions.' },
              { title: 'Instant Access', desc: 'Get your coupon codes immediately after purchase.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-6 h-6 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle2 size={16} />
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Join CouponSwap today</p>
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
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="input-modern pl-12"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <input type="checkbox" required className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <span>
                I agree to the <button type="button" className="text-brand-600 font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-brand-600 font-bold hover:underline">Privacy Policy</button>.
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-modern-primary w-full py-4 text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Free Account <UserPlus size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-brand-600 font-bold hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
