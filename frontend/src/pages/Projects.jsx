import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Projects = () => {
  const { api, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, [api]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="mt-1 text-gray-500">Manage and track your active projects</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {project.name}
              </h3>
              {(user?.role === 'Admin' || project.createdBy === user?._id) && (
                <button
                  onClick={(e) => handleDeleteProject(e, project._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
              {project.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>{project.members?.length || 0} members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No projects found. {user?.role === 'Admin' ? 'Create one to get started.' : 'Wait for an admin to invite you to a project.'}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
