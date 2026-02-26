import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tag, Calendar, CreditCard, FileText, ArrowLeft, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { motion } from 'motion/react';

export function ListCoupon({ navigate }: { navigate: (path: string) => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    platform: 'PhonePe',
    discount_type: 'Flat ₹',
    code: '',
    expiry_date: '',
    price: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          seller_id: user?.id,
          price: Number(formData.price)
        }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (e) {
      alert('Failed to list coupon');
    } finally {
      setLoading(false);
    }
  };

  const platforms = ['PhonePe', 'GPay', 'Paytm', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy', 'Other'];

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200/50 dark:shadow-none"
          >
            <CheckCircle2 size={56} />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Coupon Listed Successfully!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Your coupon is now live and waiting for buyers.</p>
          <div className="mt-10 flex items-center justify-center gap-3 text-slate-400 font-medium">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-4xl mx-auto px-4">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 font-bold mb-10 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span>Back to Dashboard</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">
              <Sparkles size={16} />
              <span>Create Listing</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Sell Your Coupon</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">Reach thousands of potential buyers instantly.</p>
          </div>

          <div className="card-modern p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Coupon Title</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 50% Off on Zomato Orders"
                      className="input-modern pl-12"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Platform Source</label>
                  <select 
                    className="input-modern appearance-none bg-slate-50 dark:bg-slate-800"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  >
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Discount Type</label>
                  <select 
                    className="input-modern appearance-none bg-slate-50 dark:bg-slate-800"
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                  >
                    <option value="Flat ₹">Flat ₹ Discount</option>
                    <option value="Percentage %">Percentage % Off</option>
                    <option value="Cashback">Cashback Offer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Coupon Code</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      required
                      placeholder="Enter the actual code"
                      className="input-modern pl-12"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
                    <Info size={12} />
                    Encrypted and hidden until purchase.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="date" 
                      required
                      className="input-modern pl-12"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Selling Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="0.00"
                      className="input-modern pl-10 text-xl font-bold"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="mt-3 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/30">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Platform Fee (1%)</span>
                      <span className="font-bold text-brand-600">-₹{(Number(formData.price) * 0.01).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>You Receive</span>
                      <span className="text-green-600">₹{(Number(formData.price) * 0.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Description & Terms</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-400" size={20} />
                    <textarea 
                      required
                      rows={5}
                      placeholder="Mention minimum order value, specific brands, or any other terms..."
                      className="input-modern pl-12 pt-3.5"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-modern-primary w-full py-5 text-xl shadow-xl shadow-brand-500/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Listing Coupon...</span>
                  </div>
                ) : 'List Coupon for Sale'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-modern p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Listing Guidelines</h3>
            <ul className="space-y-5">
              {[
                { title: 'Be Accurate', desc: 'Ensure the discount amount and expiry date are 100% correct.' },
                { title: 'Clear Terms', desc: 'Specify if the coupon is valid for new users or specific categories.' },
                { title: 'Fair Pricing', desc: 'Price your coupons competitively to sell them faster.' },
                { title: 'One-time Use', desc: 'Only list coupons that haven\'t been used yet.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-modern p-8 bg-slate-900 text-white">
            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Our support team is available 24/7 to help you with your listings or any questions you might have.
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors border border-white/10">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
