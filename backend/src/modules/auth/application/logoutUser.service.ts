import crypto from 'crypto';
import { UnauthorizedError } from '../domain/errors';
import type { AuthRepository } from '../domain/repositories';

export type LogoutUserInput = {
  refreshToken: string;
};

export class LogoutUserService {
  constructor(private readonly repo: AuthRepository) {}

  async execute(input: LogoutUserInput): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(input.refreshToken).digest('hex');

    const token = await this.repo.findRefreshToken(tokenHash);

    if (!token) {
      throw new UnauthorizedError('Token inválido');
    }

    if (token.revokedAt) {
      throw new UnauthorizedError('Token já foi revogado');
    }

    await this.repo.revokeRefreshToken(tokenHash);
  }
}
