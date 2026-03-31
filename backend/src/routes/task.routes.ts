import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createTaskController } from '../modules/tasks/presentation/controllers/createTask.controller';
import { deleteTaskController } from '../modules/tasks/presentation/controllers/deleteTask.controller';
import { listTasksController } from '../modules/tasks/presentation/controllers/listTasks.controller';
import { toggleTaskController } from '../modules/tasks/presentation/controllers/toggleTask.controller';
import { updateTaskController } from '../modules/tasks/presentation/controllers/updateTask.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', listTasksController);
router.post('/', createTaskController);
router.put('/:id', updateTaskController);
router.patch('/:id/toggle', toggleTaskController);
router.delete('/:id', deleteTaskController);

export default router;
