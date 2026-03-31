import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../../../middlewares/auth.middleware';
import { UpdateTaskService } from '../../application/updateTask.service';
import { PrismaTaskRepository } from '../../infra/prisma/task.repository';
import { updateTaskSchema } from '../schemas/updateTask.schema';

export async function updateTaskController(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateTaskSchema.parse(req.body);

    const repo = new PrismaTaskRepository();
    const service = new UpdateTaskService(repo);

    const task = await service.execute({
      taskId: Number(req.params.id),
      userId: req.userId!,
      title: input.title,
      description: input.description,
      completed: input.completed,
    });

    res.status(200).json({ data: task });
  } catch (err: unknown) {
    next(err);
  }
}
