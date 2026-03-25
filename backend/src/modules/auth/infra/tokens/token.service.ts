import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

export type TokenServiceConfig = {
  jwtSecret: Secret;
  accessTokenTtl: SignOptions['expiresIn']; // e.g. "15m"
  refreshTokenTtlSeconds: number; // e.g. 7 days in seconds
};

export class TokenService {
  constructor(private readonly config: TokenServiceConfig) {}

  signAccessToken(payload: { userId: number }): string {
    return jwt.sign(payload, this.config.jwtSecret, { expiresIn: this.config.accessTokenTtl });
  }

  createRefreshToken(): { token: string; tokenHash: string } {
    const token = crypto.randomBytes(48).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, tokenHash };
  }

  refreshExpiresAt(now: Date): Date {
    return new Date(now.getTime() + this.config.refreshTokenTtlSeconds * 1000);
  }
}

