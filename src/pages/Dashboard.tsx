import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutGrid, PlusCircle, Tag, Clock, CheckCircle2, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard({ navigate }: { navigate: (path: string) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ active: 0, sold: 0, earnings: 0 });
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponsRes, walletRes] = await Promise.all([
          fetch(`/api/users/${user?.id}/coupons`),
          fetch(`/api/users/${user?.id}/wallet`)
        ]);
        
        const couponsData = await couponsRes.json();
        const walletData = await walletRes.json();
        
        setCoupons(couponsData);
        setStats({
          active: couponsData.filter((c: any) => c.status === 'available').length,
          sold: couponsData.filter((c: any) => c.status === 'sold').length,
          earnings: walletData.wallet_balance
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  return (
    <div className="pb-20 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Seller Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Welcome back! Here's how your listings are performing.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/wallet')} className="btn-modern-secondary flex items-center gap-2">
            View Wallet
          </button>
          <button onClick={() => navigate('/list-coupon')} className="btn-modern-primary flex items-center gap-2">
            <PlusCircle size={20} /> List New Coupon
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Active Listings', value: stats.active, icon: Tag, color: 'blue', trend: '+12%' },
          { label: 'Total Sold', value: stats.sold, icon: CheckCircle2, color: 'green', trend: '+5%' },
          { label: 'Total Earnings', value: `₹${stats.earnings.toFixed(2)}`, icon: TrendingUp, color: 'brand', trend: '+24%' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-modern p-8 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 bg-${stat.color === 'brand' ? 'brand-50 dark:bg-brand-900/20' : stat.color + '-50 dark:bg-' + stat.color + '-900/20'} text-${stat.color === 'brand' ? 'brand-600' : stat.color + '-600'} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={28} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
            
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${stat.color === 'brand' ? 'brand-500' : stat.color + '-500'} opacity-[0.03] rounded-full blur-2xl`} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Listings Table */}
        <div className="lg:col-span-2">
          <div className="card-modern overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Listings</h2>
              <button onClick={() => navigate('/browse')} className="text-brand-600 font-bold hover:underline text-sm">View Public Store</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-8 py-5">Coupon Details</th>
                    <th className="px-8 py-5">Platform</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    [1, 2, 3, 4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/30 dark:bg-slate-800/20"></td>
                      </tr>
                    ))
                  ) : coupons.length > 0 ? (
                    coupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{coupon.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Exp: {new Date(coupon.expiry_date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                            {coupon.platform}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">₹{coupon.price}</td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            coupon.status === 'available' 
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${coupon.status === 'available' ? 'bg-green-600' : 'bg-slate-400'}`} />
                            {coupon.status === 'available' ? 'Active' : 'Sold'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                          <AlertCircle size={32} />
                        </div>
                        <p className="text-lg font-medium">No listings yet</p>
                        <button onClick={() => navigate('/list-coupon')} className="text-brand-600 font-bold mt-2 hover:underline">Create your first listing</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="card-modern p-8 bg-brand-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Quick Tip</h3>
              <p className="text-brand-100 leading-relaxed mb-8">
                Coupons with clear descriptions and competitive prices sell 3x faster. Make sure to include all terms and conditions.
              </p>
              <button onClick={() => navigate('/list-coupon')} className="w-full py-4 bg-white text-brand-600 rounded-2xl font-bold hover:bg-brand-50 transition-colors shadow-xl shadow-brand-900/20">
                List New Coupon
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="card-modern p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {coupons.filter(c => c.status === 'sold').slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Sold: {c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Earned ₹{(c.price * 0.99).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {coupons.filter(c => c.status === 'sold').length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No recent sales activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
