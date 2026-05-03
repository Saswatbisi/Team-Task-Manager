import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Clock, CheckCircle2, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetails = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
    assignedTo: '',
    assignedEmail: '',
  });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id, api]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTask };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.assignedEmail) delete payload.assignedEmail;

      await api.post(`/projects/${id}/tasks`, payload);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', status: 'To Do', dueDate: '', assignedTo: '', assignedEmail: '' });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete task');
    }
  };

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">{project.description}</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        )}
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
                <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    {(user?.role === 'Admin' || task.createdBy === user?._id) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                    </div>
                    {(task.assignedTo || task.assignedEmail) && (
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate max-w-[100px]" title={task.assignedTo ? task.assignedTo.name : task.assignedEmail}>
                        {task.assignedTo ? task.assignedTo.name : task.assignedEmail}
                      </div>
                    )}
                    
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
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Assign To Member (Optional)</label>
                <select
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {project.members?.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Assign To Email (Optional)</label>
                <input
                  type="email"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={newTask.assignedEmail}
                  onChange={(e) => setNewTask({ ...newTask, assignedEmail: e.target.value })}
                  placeholder="member@example.com"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
