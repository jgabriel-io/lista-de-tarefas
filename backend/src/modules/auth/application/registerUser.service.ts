import bcrypt from 'bcryptjs';
import { ConflictError } from '../domain/errors';
import type { AuthRepository } from '../domain/repositories';
import type { RegisterResult } from '../domain/types';

export type RegisterUserInput = {
  email: string;
  password: string;
};

export class RegisterUserService {
  constructor(private readonly repo: AuthRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterResult> {
    const existing = await this.repo.findUserByEmail(input.email);

    if (existing) {
      throw new ConflictError('E-mail já está em uso');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await this.repo.createUser({
      email: input.email,
      passwordHash,
    });

    return { user };
  }
}
