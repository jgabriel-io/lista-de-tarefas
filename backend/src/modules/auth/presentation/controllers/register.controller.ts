import type { NextFunction, Request, Response } from 'express';
import { RegisterUserService } from '../../application/registerUser.service';
import { PrismaAuthRepository } from '../../infra/prisma/prisma-auth.repository';
import { registerSchema } from '../schemas/register.schema';

export async function registerController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);

    const repo = new PrismaAuthRepository();
    const service = new RegisterUserService(repo);

    const result = await service.execute({
      email: input.email,
      password: input.password,
    });

    res.status(201).json({ data: result });
  } catch (err: unknown) {
    next(err);
  }
}
