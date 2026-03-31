import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../../../middlewares/auth.middleware';
import { DeleteTaskService } from '../../application/deleteTask.service';
import { PrismaTaskRepository } from '../../infra/prisma/task.repository';

export async function deleteTaskController(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const repo = new PrismaTaskRepository();
    const service = new DeleteTaskService(repo);

    await service.execute({
      taskId: Number(req.params.id),
      userId: req.userId!,
    });

    res.status(204).send();
  } catch (err: unknown) {
    next(err);
  }
}
