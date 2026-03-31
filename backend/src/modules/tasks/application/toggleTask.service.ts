import { TaskNotFoundError } from '../domain/errors';
import type { TaskRepository } from '../domain/repositories';
import type { Task } from '../domain/types';

export type ToggleTaskInput = {
  taskId: number;
  userId: number;
};

export class ToggleTaskService {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: ToggleTaskInput): Promise<Task> {
    const task = await this.repo.findByIdAndUser(input.taskId, input.userId);

    if (!task) {
      throw new TaskNotFoundError();
    }

    return this.repo.toggleCompleted(input.taskId);
  }
}
