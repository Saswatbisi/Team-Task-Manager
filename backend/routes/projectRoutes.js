const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const taskRouter = require('./taskRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/tasks', taskRouter);

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, authorize('Admin'), updateProject)
  .delete(protect, authorize('Admin'), deleteProject);

module.exports = router;
