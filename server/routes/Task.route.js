import express from 'express';
import { 
    HandleGetAllTasks,
    HandleGetEmployeeTasks,
    HandleGetTaskById,
    HandleCreateTask,
    HandleUpdateTask,
    HandleDeleteTask,
    HandleAddTaskComment,
    HandleGetTaskStatistics
} from '../controllers/Task.controller.js';
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js';

const router = express.Router();

router.use(VerifyhHRToken);

router.get('/all', HandleGetAllTasks);

router.get('/statistics', HandleGetTaskStatistics);

router.get('/employee/:employeeId', HandleGetEmployeeTasks);

router.get('/:taskId', HandleGetTaskById);

router.post('/create', HandleCreateTask);

router.patch('/:taskId', HandleUpdateTask);

router.delete('/:taskId', HandleDeleteTask);

router.post('/:taskId/comment', HandleAddTaskComment);

export default router;