import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../../../middlewares/auth.middleware';
import { ToggleTaskService } from '../../application/toggleTask.service';
import { PrismaTaskRepository } from '../../infra/prisma/task.repository';

export async function toggleTaskController(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const repo = new PrismaTaskRepository();
    const service = new ToggleTaskService(repo);

    const task = await service.execute({
      taskId: Number(req.params.id),
      userId: req.userId!,
    });

    res.status(200).json({ data: task });
  } catch (err: unknown) {
    next(err);
  }
}
