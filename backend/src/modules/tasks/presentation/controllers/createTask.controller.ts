import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../../../middlewares/auth.middleware';
import { CreateTaskService } from '../../application/createTask.service';
import { PrismaTaskRepository } from '../../infra/prisma/task.repository';
import { createTaskSchema } from '../schemas/createTask.schema';

export async function createTaskController(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createTaskSchema.parse(req.body);

    const repo = new PrismaTaskRepository();
    const service = new CreateTaskService(repo);

    const task = await service.execute({
      title: input.title,
      description: input.description,
      userId: req.userId!,
    });

    res.status(201).json({ data: task });
  } catch (err: unknown) {
    next(err);
  }
}
