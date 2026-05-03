const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks
// @route   GET /api/tasks
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.params.projectId) {
      // Get tasks for a specific project
      filter.project = req.params.projectId;
    } else {
      // Get all tasks user has access to
      if (req.user.role !== 'Admin') {
        // Members see tasks assigned to them or in their projects
        const userProjects = await Project.find({ members: req.user.id }).select('_id');
        const projectIds = userProjects.map(p => p._id);
        filter.$or = [
          { project: { $in: projectIds } },
          { assignedTo: req.user.id },
          { assignedEmail: req.user.email }
        ];
      }
    }

    if (req.query.assignedTo === 'me') {
      if (filter.$or) delete filter.$or;
      filter.$or = [
        { assignedTo: req.user.id },
        { assignedEmail: req.user.email }
      ];
    }

    let query = Task.find(filter).populate({
      path: 'project',
      select: 'name description',
    }).populate({
      path: 'assignedTo',
      select: 'name email',
    });

    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name description members')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Access check
    if (req.user.role !== 'Admin') {
      const isMember = task.project.members.includes(req.user.id);
      const isAssigned = task.assignedTo?._id.toString() === req.user.id || task.assignedEmail === req.user.email;
      if (!isMember && !isAssigned) {
        return res.status(403).json({ success: false, error: 'Not authorized to access this task' });
      }
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    req.body.project = req.params.projectId;
    req.body.createdBy = req.user.id;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to add a task to this project' });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Admins can update anything. Members can update status of tasks assigned to them or in their project
    if (req.user.role !== 'Admin') {
      const project = await Project.findById(task.project);
      const isAssigned = task.assignedTo?.toString() === req.user.id || task.assignedEmail === req.user.email;
      if (!project.members.includes(req.user.id) && !isAssigned) {
        return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
      }
      
      // If member, restrict what they can update (e.g. only status)
      // To simplify, we'll allow them to update the task if they are in the project or assigned
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
