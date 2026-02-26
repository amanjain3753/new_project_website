import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Tag, Clock, CheckCircle2, Copy, ExternalLink, ShieldCheck, AlertCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function History({ navigate }: { navigate: (path: string) => void }) {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/users/${user?.id}/transactions`);
        const data = await res.json();
        setPurchases(data.filter((t: any) => t.buyer_id === user?.id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto px-4">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">
          <ShoppingBag size={16} />
          <span>Purchases</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Purchase History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Access your purchased coupon codes and track your savings.</p>
      </div>

      <div className="grid gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="card-modern h-40 animate-pulse bg-slate-100 dark:bg-slate-800/50" />)
        ) : purchases.length > 0 ? (
          purchases.map((p, i) => (
            <motion.div 
              key={p.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-modern group p-8 flex flex-col md:flex-row md:items-center justify-between gap-10"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-[2rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300">
                  <ShoppingBag size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{p.coupon_title}</h3>
                  <div className="flex flex-wrap items-center gap-6 mt-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <Clock size={16} className="text-brand-600" />
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <Tag size={16} className="text-brand-600" />
                      <span>₹{p.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <ShieldCheck size={16} />
                      <span>Verified Purchase</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group/code w-full sm:w-auto">
                  <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 px-6 py-3.5 rounded-2xl font-mono text-brand-600 dark:text-brand-400 font-bold flex items-center gap-4 w-full justify-between shadow-inner">
                    <span className="text-lg tracking-wider">{p.code || '••••••••'}</span>
                    <button 
                      onClick={() => copyToClipboard(p.code, p.id)}
                      className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-brand-600 shadow-sm"
                    >
                      <AnimatePresence mode="wait">
                        {copiedId === p.id ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <CheckCircle2 size={20} className="text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Copy size={20} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                  {copiedId === p.id && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl">
                      Copied!
                    </div>
                  )}
                </div>
                <button className="btn-modern-secondary py-3.5 px-6 text-sm flex items-center gap-2 w-full sm:w-auto justify-center">
                  Report <AlertCircle size={18} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-32 card-modern border-dashed">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300 dark:text-slate-600">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No purchases yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg max-w-md mx-auto">
              You haven't purchased any coupons yet. Start browsing to find incredible deals on your favorite platforms.
            </p>
            <button onClick={() => navigate('/browse')} className="mt-10 btn-modern-primary px-10">Browse Deals</button>
          </div>
        )}
      </div>
    </div>
  );
}
