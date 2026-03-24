import prisma from '../lib/prisma';

export async function getTasksByUser(userId: number) {
  return prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

export async function createTask(userId: number, data: { title: string; description?: string }) {
  return prisma.task.create({ data: { ...data, userId } });
}

export async function updateTask(id: number, userId: number, data: Partial<{ title: string; description: string; completed: boolean }>) {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error('Task not found');
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: number, userId: number) {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new Error('Task not found');
  return prisma.task.delete({ where: { id } });
}
