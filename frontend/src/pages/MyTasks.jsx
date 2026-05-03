import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const MyTasks = () => {
  const { api } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, [api]);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get(`/tasks?assignedTo=me`);
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchMyTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const columns = ['To Do', 'In Progress', 'Done', 'Overdue'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Done': return 'bg-emerald-100 text-emerald-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">Manage all tasks assigned to you across all projects.</p>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(status => (
          <div key={status} className="bg-gray-50/50 rounded-2xl p-4 min-w-[300px] flex-1 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span>{status}</span>
              <span className="bg-white text-gray-500 text-xs px-2 py-1 rounded-full shadow-sm">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                  
                  {task.project && (
                    <div className="text-xs font-medium text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-md mb-3">
                      {task.project.name}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                    </div>
                    
                    <select
                      className={`text-xs font-medium px-2 py-1 rounded-full border-none cursor-pointer outline-none ${getStatusColor(task.status)}`}
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                 <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
