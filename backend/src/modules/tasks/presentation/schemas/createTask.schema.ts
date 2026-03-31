import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  description: z.string().trim().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
