import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().trim().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
