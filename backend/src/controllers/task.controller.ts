import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as taskService from '../services/task.service';

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tasks = await taskService.getTasksByUser(req.userId!);
    res.json(tasks);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ message });
  }
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const task = await taskService.createTask(req.userId!, req.body);
    res.status(201).json(task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ message });
  }
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.userId!, req.body);
    res.json(task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ message });
  }
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    await taskService.deleteTask(Number(req.params.id), req.userId!);
    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ message });
  }
}
