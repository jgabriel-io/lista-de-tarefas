import type { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../schemas/login.schema';
import { LoginUserService } from '../../application/loginUser.service';
import { PrismaAuthRepository } from '../../infra/prisma/prisma-auth.repository';
import { TokenService } from '../../infra/tokens/token.service';

export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const repo = new PrismaAuthRepository();
    const tokens = new TokenService({
      jwtSecret,
      accessTokenTtl: '15m',
      refreshTokenTtlSeconds: 7 * 24 * 60 * 60,
    });
    const service = new LoginUserService(repo, tokens);

    const result = await service.execute({
      email: input.email,
      password: input.password,
      ipAddress: req.ip ?? null,
    });

    res.status(200).json(result);
  } catch (err: unknown) {
    next(err);
  }
}

