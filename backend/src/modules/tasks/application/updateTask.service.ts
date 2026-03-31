import { TaskNotFoundError, TaskValidationError } from '../domain/errors';
import type { TaskRepository } from '../domain/repositories';
import type { Task } from '../domain/types';

export type UpdateTaskInput = {
  taskId: number;
  userId: number;
  title?: string;
  description?: string;
  completed?: boolean;
};

export class UpdateTaskService {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const task = await this.repo.findByIdAndUser(input.taskId, input.userId);

    if (!task) {
      throw new TaskNotFoundError();
    }

    if (input.title !== undefined && input.title.trim().length === 0) {
      throw new TaskValidationError('Título não pode ser vazio');
    }

    return this.repo.update(input.taskId, {
      title: input.title?.trim(),
      description: input.description?.trim(),
      completed: input.completed,
    });
  }
}
