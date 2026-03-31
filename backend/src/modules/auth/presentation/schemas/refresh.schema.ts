import { z } from 'zod';

export const refreshSchema = z.object({
  refreshToken: z.string().trim().min(1, 'Refresh token é obrigatório'),
});

export type RefreshInput = z.infer<typeof refreshSchema>;
