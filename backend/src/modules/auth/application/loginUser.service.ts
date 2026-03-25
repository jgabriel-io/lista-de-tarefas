import bcrypt from 'bcryptjs';
import { UnauthorizedError, ForbiddenError } from '../domain/errors';
import type { AuthRepository } from '../domain/repositories';
import type { LoginResult } from '../domain/types';
import { TokenService } from '../infra/tokens/token.service';

export type LoginUserInput = {
  email: string;
  password: string;
  ipAddress: string | null;
};

const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha incorretos';

export class LoginUserService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginResult> {
    const user = await this.repo.findUserForAuthByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
    }

    // Status da conta (ativo/bloqueado)
    if (user.status === 'BLOCKED') {
      throw new ForbiddenError('Conta bloqueada');
    }

    // Expiração de senha (campo previsto no schema)
    if (user.passwordExpiresAt && user.passwordExpiresAt.getTime() <= Date.now()) {
      throw new ForbiddenError('Senha expirada');
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
    }

    const now = new Date();

    const accessToken = this.tokens.signAccessToken({ userId: user.id });
    const { token: refreshToken, tokenHash } = this.tokens.createRefreshToken();
    const refreshExpiresAt = this.tokens.refreshExpiresAt(now);

    await this.repo.createRefreshToken({
      userId: user.id,
      tokenHash,
      ipAddress: input.ipAddress,
      expiresAt: refreshExpiresAt,
    });

    await this.repo.updateLoginAudit(user.id, { lastLoginAt: now, lastLoginIp: input.ipAddress });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    };
  }
}

