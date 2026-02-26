import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Users, Tag, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function AdminPanel({ navigate }: { navigate: (path: string) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users')
      ]);
      setStats(await statsRes.json());
      setUsers(await usersRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuspend = async (userId: number, currentStatus: number) => {
    try {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_suspended: !currentStatus }),
      });
      fetchData();
    } catch (e) {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Shield className="text-indigo-600" /> Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Platform overview and user management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Users, label: 'Total Users', value: stats?.totalUsers, color: 'blue' },
          { icon: Tag, label: 'Total Coupons', value: stats?.totalCoupons, color: 'green' },
          { icon: CreditCard, label: 'Transactions', value: stats?.totalTransactions, color: 'purple' },
          { icon: Shield, label: 'Commission', value: `₹${stats?.totalCommission.toFixed(2)}`, color: 'indigo' },
        ].map((s, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-xl flex items-center justify-center`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value ?? '...'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Wallet</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16 bg-slate-50/50"></tr>)
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{u.email}</p>
                    <p className="text-xs text-slate-500">Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{u.wallet_balance.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.is_suspended ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {u.is_suspended ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                      {u.is_suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.id !== user?.id && (
                      <button 
                        onClick={() => handleSuspend(u.id, u.is_suspended)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          u.is_suspended ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {u.is_suspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
