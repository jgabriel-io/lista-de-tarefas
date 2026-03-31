import type { NextFunction, Request, Response } from 'express';
import { LogoutUserService } from '../../application/logoutUser.service';
import { PrismaAuthRepository } from '../../infra/prisma/prisma-auth.repository';
import { logoutSchema } from '../schemas/logout.schema';

export async function logoutController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = logoutSchema.parse(req.body);

    const repo = new PrismaAuthRepository();
    const service = new LogoutUserService(repo);

    await service.execute({
      refreshToken: input.refreshToken,
    });

    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (err: unknown) {
    next(err);
  }
}
