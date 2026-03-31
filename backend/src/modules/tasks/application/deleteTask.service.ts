import { TaskNotFoundError } from '../domain/errors';
import type { TaskRepository } from '../domain/repositories';

export type DeleteTaskInput = {
  taskId: number;
  userId: number;
};

export class DeleteTaskService {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    const task = await this.repo.findByIdAndUser(input.taskId, input.userId);

    if (!task) {
      throw new TaskNotFoundError();
    }

    await this.repo.delete(input.taskId);
  }
}
