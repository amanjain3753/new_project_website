import { useAuth } from '../contexts/AuthContext';
import { LayoutGrid, PlusCircle, Wallet, History, ShieldCheck, LogOut, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar({ 
  navigate, 
  currentPath, 
  isDarkMode, 
  setIsDarkMode 
}: { 
  navigate: (path: string) => void, 
  currentPath: string,
  isDarkMode: boolean,
  setIsDarkMode: (val: boolean) => void
}) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Browse', path: '/browse', icon: Search },
    ...(user ? [
      { label: 'Sell', path: '/list-coupon', icon: PlusCircle },
      { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
      { label: 'Wallet', path: '/wallet', icon: Wallet },
    ] : []),
    ...(user?.role === 'admin' ? [
      { label: 'Admin', path: '/admin', icon: ShieldCheck },
    ] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3 glass shadow-lg' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
            C
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Coupon<span className="text-brand-600">Swap</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-2xl">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentPath === item.path 
                    ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-500'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-8">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/history')}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <History size={20} />
                </button>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-modern-secondary py-2 px-4 text-sm border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')} 
                  className="btn-modern-primary py-2 px-6 text-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold transition-all ${
                    currentPath === item.path 
                      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <item.icon size={22} />
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
              {user ? (
                <>
                  <button 
                    onClick={() => { navigate('/history'); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold text-slate-600 dark:text-slate-400"
                  >
                    <History size={22} />
                    History
                  </button>
                  <button 
                    onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold text-red-500"
                  >
                    <LogOut size={22} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 p-2">
                  <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="btn-modern-secondary w-full">Login</button>
                  <button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="btn-modern-primary w-full">Sign Up</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
