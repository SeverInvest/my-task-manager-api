const routerTasks = require('express').Router();
const {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} = require('../controllers/tasks');

routerTasks.get('/', getTasks);
routerTasks.get('/:taskId', getTask);
routerTasks.post('/', createTask);
routerTasks.delete('/:taskId', deleteTask);
routerTasks.patch('/:taskId', updateTask);

module.exports = routerTasks;
