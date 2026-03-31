import crypto from 'crypto';
import { UnauthorizedError } from '../domain/errors';
import type { AuthRepository } from '../domain/repositories';
import type { RefreshResult } from '../domain/types';
import { TokenService } from '../infra/tokens/token.service';

export type RefreshTokenInput = {
  refreshToken: string;
};

export class RefreshTokenService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshResult> {
    const tokenHash = crypto.createHash('sha256').update(input.refreshToken).digest('hex');

    const token = await this.repo.findRefreshToken(tokenHash);

    if (!token) {
      throw new UnauthorizedError('Token inválido');
    }

    if (token.revokedAt) {
      throw new UnauthorizedError('Token foi revogado');
    }

    if (token.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError('Token expirado');
    }

    const accessToken = this.tokens.signAccessToken({ userId: token.userId });

    return { accessToken };
  }
}
