import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag, Calendar, ExternalLink, ChevronRight, SlidersHorizontal, Grid, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function Browse({ navigate }: { navigate: (path: string) => void }) {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (platform) params.append('platform', platform);
      
      const res = await fetch(`/api/coupons?${params.toString()}`);
      const actualData = await res.json();
      setCoupons(actualData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [platform]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCoupons();
  };

  const handleBuy = async (couponId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPurchasing(couponId);
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer_id: user.id, coupon_id: couponId }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(`Purchase successful! Your code is: ${data.code}. You can also find it in your History.`);
        fetchCoupons();
      }
    } catch (e) {
      alert('Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const platforms = ['PhonePe', 'GPay', 'Paytm', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy', 'Other'];

  return (
    <div className="pb-20 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">
            <Tag size={16} />
            <span>Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Discover Best Deals</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
            Browse through thousands of verified coupons and save up to 90% on your favorite platforms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-400'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button className="btn-modern-secondary flex items-center gap-2 py-2.5">
            <SlidersHorizontal size={18} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-modern p-4 mb-12">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, platform, or description..." 
              className="input-modern pl-12 border-none bg-slate-50 dark:bg-slate-800/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-modern-primary px-10">Search Deals</button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="lg:w-72 space-y-10">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
              <Filter size={20} className="text-brand-600" /> Categories
            </h3>
            <div className="space-y-1">
              <button 
                onClick={() => setPlatform('')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  platform === '' 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Platforms</span>
                <ChevronRight size={16} className={platform === '' ? 'opacity-100' : 'opacity-0'} />
              </button>
              {platforms.map(p => (
                <button 
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    platform === p 
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{p}</span>
                  <ChevronRight size={16} className={platform === p ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-brand-600 rounded-[2rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-xl mb-3">Sell your coupons</h4>
              <p className="text-brand-100 text-sm mb-6">Have unused rewards? Turn them into cash instantly.</p>
              <button onClick={() => navigate('/list-coupon')} className="w-full py-3 bg-white text-brand-600 rounded-xl font-bold hover:bg-brand-50 transition-colors">
                List Now
              </button>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        </aside>

        {/* Coupon Grid */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="card-modern h-80 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
                ))}
              </motion.div>
            ) : coupons.length > 0 ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={viewMode === 'grid' ? "grid md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}
              >
                {coupons.map(coupon => (
                  <div 
                    key={coupon.id} 
                    className={`card-modern group flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center p-4'}`}
                  >
                    <div className={`p-8 flex-grow ${viewMode === 'list' ? 'py-2' : ''}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-[10px] font-bold rounded-xl uppercase tracking-widest border border-brand-100 dark:border-brand-900/30">
                          {coupon.platform}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{coupon.price}</div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 transition-colors line-clamp-1">
                        {coupon.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed">
                        {coupon.description}
                      </p>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <Tag size={14} className="text-brand-600" />
                          <span>{coupon.discount_type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <Calendar size={14} className="text-brand-600" />
                          <span>Exp: {new Date(coupon.expiry_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${viewMode === 'grid' ? 'p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800' : 'pl-8 border-l border-slate-100 dark:border-slate-800'}`}>
                      <button 
                        onClick={() => handleBuy(coupon.id)}
                        disabled={purchasing === coupon.id}
                        className="btn-modern-primary w-full flex items-center justify-center gap-2 py-3"
                      >
                        {purchasing === coupon.id ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Buy Now <ExternalLink size={18} /></>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 card-modern border-dashed"
              >
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300 dark:text-slate-600">
                  <Search size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No deals found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={() => { setSearch(''); setPlatform(''); }} className="mt-8 btn-modern-secondary">Clear all filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
