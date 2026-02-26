import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ListCoupon } from './pages/ListCoupon';
import { AdminPanel } from './pages/AdminPanel';
import { Wallet } from './pages/Wallet';
import { History } from './pages/History';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const renderPage = () => {
    switch (currentPath) {
      case '/': return <Home navigate={navigate} />;
      case '/browse': return <Browse navigate={navigate} />;
      case '/login': return <Login navigate={navigate} />;
      case '/register': return <Register navigate={navigate} />;
      case '/dashboard': return user ? <Dashboard navigate={navigate} /> : <Login navigate={navigate} />;
      case '/list-coupon': return user ? <ListCoupon navigate={navigate} /> : <Login navigate={navigate} />;
      case '/admin': return user?.role === 'admin' ? <AdminPanel navigate={navigate} /> : <Home navigate={navigate} />;
      case '/wallet': return user ? <Wallet navigate={navigate} /> : <Login navigate={navigate} />;
      case '/history': return user ? <History navigate={navigate} /> : <Login navigate={navigate} />;
      default: return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar navigate={navigate} currentPath={currentPath} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="flex-grow pt-20">
        {renderPage()}
      </main>
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CouponSwap</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                The most trusted marketplace for unused digital coupons. Save money on every purchase or earn cash from your unused rewards.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><button onClick={() => navigate('/browse')} className="hover:text-brand-600 transition-colors">Browse Coupons</button></li>
                <li><button onClick={() => navigate('/list-coupon')} className="hover:text-brand-600 transition-colors">Sell Coupons</button></li>
                <li><button onClick={() => navigate('/history')} className="hover:text-brand-600 transition-colors">Transaction History</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><button className="hover:text-brand-600 transition-colors">Help Center</button></li>
                <li><button className="hover:text-brand-600 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-brand-600 transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} CouponSwap. Crafted for the modern saver.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
