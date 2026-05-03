import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, FolderKanban, Activity } from 'lucide-react';

const Dashboard = () => {
  const { api, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [api]);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Projects', value: stats?.totalProjects || 0, icon: <FolderKanban size={24} />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: <Activity size={24} />, color: 'bg-purple-50 text-purple-600' },
    { title: 'Pending Tasks', value: stats?.pendingTasks || 0, icon: <Clock size={24} />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: <CheckCircle2 size={24} />, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: <AlertCircle size={24} />, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-gray-500">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center h-64">
         <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900">Ready to dive in?</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">Head over to the Projects tab to manage your active work, create new projects, and track team progress.</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
