const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { protect, authorize } = require('../middleware/auth');

// MergeParams to allow accessing params from other routers (e.g. project router)
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Admin'), createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

module.exports = router;
