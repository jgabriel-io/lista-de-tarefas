export type AccountStatus = 'ACTIVE' | 'BLOCKED';

export type UserAuthView = {
  id: number;
  email: string;
  status: AccountStatus;
  passwordExpiresAt: Date | null;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string };
};

