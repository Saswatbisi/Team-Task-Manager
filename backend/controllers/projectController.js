const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects (Members see their projects, Admins see all or their created ones)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let query;

    // If Admin, they can see all projects or projects they created.
    // For simplicity, let's say anyone can see projects they are a member of or created.
    if (req.user.role === 'Admin') {
      query = Project.find().populate('members', 'name email role');
    } else {
      const assignedTasks = await Task.find({
        $or: [
          { assignedTo: req.user.id },
          { assignedEmail: req.user.email }
        ]
      }).select('project');
      const taskProjectIds = assignedTasks.map(t => t.project);

      query = Project.find({
        $or: [
          { members: req.user.id },
          { _id: { $in: taskProjectIds } }
        ]
      }).populate('members', 'name email role');
    }

    const projects = await query;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Access check: Admin or Member of the project, or assigned a task in the project
    if (req.user.role !== 'Admin' && !project.members.map(m => m._id.toString()).includes(req.user.id)) {
      const assignedTask = await Task.findOne({
        project: project._id,
        $or: [
          { assignedTo: req.user.id },
          { assignedEmail: req.user.email }
        ]
      });

      if (!assignedTask) {
        return res.status(403).json({ success: false, error: 'Not authorized to access this project' });
      }
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    // Add creator to members if not already
    if (!req.body.members) req.body.members = [];
    if (!req.body.members.includes(req.user.id)) {
      req.body.members.push(req.user.id);
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Make sure user is project owner or admin
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
