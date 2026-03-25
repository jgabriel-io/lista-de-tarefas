import prisma from '../../../../lib/prisma';
import type { AuthRepository, RefreshTokenRecord } from '../../domain/repositories';
import type { UserAuthView } from '../../domain/types';

export class PrismaAuthRepository implements AuthRepository {
  async findUserForAuthByEmail(email: string): Promise<(UserAuthView & { passwordHash: string }) | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        status: true,
        passwordExpiresAt: true,
        password: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      status: user.status as UserAuthView['status'],
      passwordExpiresAt: user.passwordExpiresAt,
      passwordHash: user.password,
    };
  }

  async updateLoginAudit(userId: number, data: { lastLoginAt: Date; lastLoginIp: string | null }): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: data.lastLoginAt, lastLoginIp: data.lastLoginIp },
    });
  }

  async createRefreshToken(data: {
    userId: number;
    tokenHash: string;
    ipAddress: string | null;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord> {
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        ipAddress: data.ipAddress,
        expiresAt: data.expiresAt,
      },
    });
  }
}

