import type { TaskRepository } from '../domain/repositories';
import type { Task } from '../domain/types';

export type ListTasksInput = {
  userId: number;
};

export class ListTasksService {
  constructor(private readonly repo: TaskRepository) {}

  async execute(input: ListTasksInput): Promise<Task[]> {
    return this.repo.findAllByUser(input.userId);
  }
}
