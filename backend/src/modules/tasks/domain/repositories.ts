import type { Task } from './types';

export type CreateTaskData = {
  title: string;
  description?: string;
  userId: number;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  completed?: boolean;
};

export interface TaskRepository {
  findById(id: number): Promise<Task | null>;
  findByIdAndUser(id: number, userId: number): Promise<Task | null>;
  findAllByUser(userId: number): Promise<Task[]>;
  create(data: CreateTaskData): Promise<Task>;
  update(id: number, data: UpdateTaskData): Promise<Task>;
  delete(id: number): Promise<void>;
  toggleCompleted(id: number): Promise<Task>;
}
