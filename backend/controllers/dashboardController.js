const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    let tasks;
    let projectCount;

    if (req.user.role === 'Admin') {
      tasks = await Task.find();
      projectCount = await Project.countDocuments();
    } else {
      const userProjects = await Project.find({ members: req.user.id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      
      tasks = await Task.find({
        $or: [
          { project: { $in: projectIds } },
          { assignedTo: req.user.id },
          { assignedEmail: req.user.email }
        ]
      });

      const projectIdsString = projectIds.map(id => id.toString());
      const taskProjectIds = tasks.map(t => t.project.toString());
      const allProjectIds = new Set([...projectIdsString, ...taskProjectIds]);
      
      projectCount = allProjectIds.size;
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
    const overdueTasks = tasks.filter(t => t.status === 'Overdue' || (new Date(t.dueDate) < new Date() && t.status !== 'Done')).length;

    res.status(200).json({
      success: true,
      data: {
        totalProjects: projectCount,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
