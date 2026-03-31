import prisma from '../../../../lib/prisma';
import type { CreateTaskData, TaskRepository, UpdateTaskData } from '../../domain/repositories';
import type { Task } from '../../domain/types';

export class PrismaTaskRepository implements TaskRepository {
  async findById(id: number): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async findByIdAndUser(id: number, userId: number): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id, userId } });
  }

  async findAllByUser(userId: number): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateTaskData): Promise<Task> {
    return prisma.task.create({ data });
  }

  async update(id: number, data: UpdateTaskData): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }

  async toggleCompleted(id: number): Promise<Task> {
    const task = await this.findById(id);
    if (!task) throw new Error('Task not found');

    return prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });
  }
}
