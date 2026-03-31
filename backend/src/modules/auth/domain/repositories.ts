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

export type CreateUserData = {
  email: string;
  passwordHash: string;
};

export interface AuthRepository {
  findUserForAuthByEmail(email: string): Promise<(UserAuthView & { passwordHash: string }) | null>;
  findUserByEmail(email: string): Promise<{ id: number; email: string } | null>;
  createUser(data: CreateUserData): Promise<{ id: number; email: string }>;
  updateLoginAudit(userId: number, data: { lastLoginAt: Date; lastLoginIp: string | null }): Promise<void>;
  createRefreshToken(data: { userId: number; tokenHash: string; ipAddress: string | null; expiresAt: Date }): Promise<RefreshTokenRecord>;
  findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null>;
  revokeRefreshToken(tokenHash: string): Promise<void>;
}

