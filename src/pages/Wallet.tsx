import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, TrendingUp, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export function Wallet({ navigate }: { navigate: (path: string) => void }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, transRes] = await Promise.all([
          fetch(`/api/users/${user?.id}/wallet`),
          fetch(`/api/users/${user?.id}/transactions`)
        ]);
        const walletData = await walletRes.json();
        const transData = await transRes.json();
        setBalance(walletData.wallet_balance);
        setTransactions(transData.filter((t: any) => t.seller_id === user?.id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="pb-20 max-w-5xl mx-auto px-4">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">
          <CreditCard size={16} />
          <span>Financials</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">My Wallet</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your earnings, track commissions, and withdraw funds.</p>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-600 rounded-[3rem] p-10 md:p-16 text-white mb-16 relative overflow-hidden shadow-2xl shadow-brand-500/30"
      >
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-100 font-semibold text-lg mb-4 opacity-80">Available Balance</p>
            <h2 className="text-6xl md:text-8xl font-bold mb-10 tracking-tight">₹{balance.toFixed(2)}</h2>
            <div className="flex flex-wrap gap-5">
              <button className="bg-white text-brand-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-brand-50 transition-all hover:-translate-y-1 shadow-xl shadow-brand-900/20">
                Withdraw Funds
              </button>
              <button onClick={() => navigate('/list-coupon')} className="bg-brand-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-brand-400 transition-all hover:-translate-y-1 border border-brand-400/30">
                Sell More
              </button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-6">
            <div className="card-modern bg-white/10 border-white/10 p-6 backdrop-blur-md">
              <TrendingUp className="text-brand-200 mb-4" size={24} />
              <p className="text-brand-100 text-sm mb-1">Total Earned</p>
              <p className="text-2xl font-bold">₹{(balance * 1.2).toFixed(0)}</p>
            </div>
            <div className="card-modern bg-white/10 border-white/10 p-6 backdrop-blur-md">
              <ShieldCheck className="text-brand-200 mb-4" size={24} />
              <p className="text-brand-100 text-sm mb-1">Commission Paid</p>
              <p className="text-2xl font-bold">₹{(balance * 0.01).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-400/20 rounded-full blur-[80px]" />
        <WalletIcon className="absolute bottom-10 right-10 text-white/5" size={200} />
      </motion.div>

      {/* Earnings History */}
      <div className="card-modern overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Earnings History</h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Clock size={16} />
            <span>Last 30 days</span>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="p-8 animate-pulse h-24 bg-slate-50/30 dark:bg-slate-800/20"></div>)
          ) : transactions.length > 0 ? (
            transactions.map(t => (
              <div key={t.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowDownLeft size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">Sale: {t.coupon_title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">+₹{t.seller_amount.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">Net Earnings</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-slate-500 dark:text-slate-400">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
                <WalletIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No earnings yet</h3>
              <p className="mt-2">Start selling your unused coupons to see your balance grow.</p>
              <button onClick={() => navigate('/list-coupon')} className="mt-8 btn-modern-primary">List Your First Coupon</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
