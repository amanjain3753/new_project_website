import { ArrowRight, Shield, Zap, Wallet, Search, CheckCircle, Star, TrendingUp, Users, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export function Home({ navigate }: { navigate: (path: string) => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pb-20 md:pt-16 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-bold mb-8 border border-brand-100 dark:border-brand-900/30">
                <TrendingUp size={16} />
                <span>Trusted by 50,000+ users worldwide</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8">
                The Smart Way to <span className="text-brand-600 italic">Trade</span> Coupons.
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                Don't let your rewards expire. Sell unused digital coupons for cash or buy them at massive discounts. Secure, instant, and transparent.
              </p>
              <div className="flex flex-wrap gap-5">
                <button onClick={() => navigate('/browse')} className="btn-modern-primary flex items-center gap-3 text-lg px-8 py-4">
                  Start Saving Now <ArrowRight size={20} />
                </button>
                <button onClick={() => navigate('/list-coupon')} className="btn-modern-secondary text-lg px-8 py-4">
                  Sell Your Coupons
                </button>
              </div>
              
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">4.9/5 from 2,000+ reviews</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 animate-float">
                <div className="card-modern p-8 max-w-sm ml-auto relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Zap className="text-brand-600" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">₹499</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Amazon Prime Voucher</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">1 Year membership at 40% off. Limited time offer.</p>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-brand-600 w-3/4" />
                  </div>
                  <button className="w-full btn-modern-primary py-3">Buy Now</button>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] -z-10" />
              <div className="absolute -bottom-10 -left-10 card-modern p-6 shadow-2xl animate-float [animation-delay:1s]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">Payment Verified</p>
                    <p className="text-xs text-slate-500">Instant code delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Listings', value: '12,000+', icon: Tag },
            { label: 'Total Users', value: '50k+', icon: Users },
            { label: 'Saved by Users', value: '₹2.5M+', icon: Wallet },
            { label: 'Success Rate', value: '99.9%', icon: CheckCircle },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">How CouponSwap Works</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Trading coupons has never been easier. Follow these simple steps to start saving or earning today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: 'List or Browse', desc: 'Sellers list unused codes. Buyers browse for the best deals across platforms.', icon: Search },
            { title: 'Secure Payment', desc: 'Buyers pay through our secure gateway. Funds are held safely in escrow.', icon: Shield },
            { title: 'Instant Access', desc: 'Code is revealed instantly. Seller gets paid after 1% platform fee.', icon: Zap },
          ].map((step, i) => (
            <div key={i} className="relative group">
              <div className="mb-8 relative">
                <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon size={32} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center font-bold text-slate-400">
                  0{i + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-900 dark:bg-slate-900/50 py-32 rounded-[3rem] mx-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Why choose CouponSwap?</h2>
              <div className="space-y-8">
                {[
                  { title: 'Verified Sellers', desc: 'Every seller is verified to ensure code authenticity and reliability.' },
                  { title: 'Escrow Protection', desc: 'Your money is safe. We only release funds to the seller once you get your code.' },
                  { title: '24/7 Support', desc: 'Our dedicated support team is always here to help you with any issues.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="card-modern bg-white/5 border-white/10 p-8 h-64 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white mb-2">Safe</h4>
                  <p className="text-slate-400 text-sm">End-to-end encryption</p>
                </div>
                <div className="card-modern bg-brand-600 p-8 h-64 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white mb-2">Fast</h4>
                  <p className="text-brand-100 text-sm">Instant delivery</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="card-modern bg-white/5 border-white/10 p-8 h-64 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white mb-2">Global</h4>
                  <p className="text-slate-400 text-sm">All major platforms</p>
                </div>
                <div className="card-modern bg-white/5 border-white/10 p-8 h-64 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white mb-2">Fair</h4>
                  <p className="text-slate-400 text-sm">Low 1% commission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-[3rem] overflow-hidden">
          <img 
            src="https://picsum.photos/seed/coupons/1920/1080?blur=2" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-900/90 mix-blend-multiply" />
          <div className="relative z-10 py-24 px-8 md:px-20 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to join the revolution?</h2>
            <p className="text-brand-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop wasting money on full-price purchases. Join 50,000+ smart savers on CouponSwap today.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => navigate('/register')} className="btn-modern-primary bg-white text-brand-600 hover:bg-brand-50 px-10 py-4 text-lg">
                Create Free Account
              </button>
              <button onClick={() => navigate('/browse')} className="btn-modern-secondary bg-transparent border-white text-white hover:bg-white/10 px-10 py-4 text-lg">
                Browse Deals
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
