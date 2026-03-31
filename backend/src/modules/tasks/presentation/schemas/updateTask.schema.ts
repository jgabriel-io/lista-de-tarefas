import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Título não pode ser vazio').optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
