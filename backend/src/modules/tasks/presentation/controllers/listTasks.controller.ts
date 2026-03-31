import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../../../middlewares/auth.middleware';
import { ListTasksService } from '../../application/listTasks.service';
import { PrismaTaskRepository } from '../../infra/prisma/task.repository';

export async function listTasksController(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const repo = new PrismaTaskRepository();
    const service = new ListTasksService(repo);

    const tasks = await service.execute({ userId: req.userId! });

    res.status(200).json({ data: tasks });
  } catch (err: unknown) {
    next(err);
  }
}
