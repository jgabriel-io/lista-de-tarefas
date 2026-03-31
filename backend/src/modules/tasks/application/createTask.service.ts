import { TaskValidationError } from '../domain/errors';
import type { TaskRepository } from '../domain/repositories';
import type { Task } from '../domain/types';

export type CreateTaskInput = {
  title: string;
  description?: string;
  userId: number;
};

export class CreateTaskService {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    if (!input.title || input.title.trim().length === 0) {
      throw new TaskValidationError('Título é obrigatório');
    }

    return this.repo.create({
      title: input.title.trim(),
      description: input.description?.trim(),
      userId: input.userId,
    });
  }
}
