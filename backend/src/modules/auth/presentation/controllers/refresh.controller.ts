import type { NextFunction, Request, Response } from 'express';
import { RefreshTokenService } from '../../application/refreshToken.service';
import { PrismaAuthRepository } from '../../infra/prisma/prisma-auth.repository';
import { TokenService } from '../../infra/tokens/token.service';
import { refreshSchema } from '../schemas/refresh.schema';

export async function refreshController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = refreshSchema.parse(req.body);

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
    const service = new RefreshTokenService(repo, tokens);

    const result = await service.execute({
      refreshToken: input.refreshToken,
    });

    res.status(200).json({ data: result });
  } catch (err: unknown) {
    next(err);
  }
}
