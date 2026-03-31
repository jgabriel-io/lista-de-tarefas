export type User = {
  id: number;
  email: string;
};

export type AuthResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
};

export type RegisterResponse = {
  data: {
    user: User;
  };
};
