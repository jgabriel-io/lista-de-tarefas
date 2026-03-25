import type { UserAuthView } from './types';

export type RefreshTokenRecord = {
  id: number;
  tokenHash: string;
  userId: number;
  ipAddress: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

export interface AuthRepository {
  findUserForAuthByEmail(email: string): Promise<(UserAuthView & { passwordHash: string }) | null>;
  updateLoginAudit(userId: number, data: { lastLoginAt: Date; lastLoginIp: string | null }): Promise<void>;
  createRefreshToken(data: { userId: number; tokenHash: string; ipAddress: string | null; expiresAt: Date }): Promise<RefreshTokenRecord>;
}

