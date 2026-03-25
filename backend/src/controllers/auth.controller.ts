import { Request, Response } from 'express';
import { registerUser, loginUserLegacy } from '../services/auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await loginUserLegacy(email, password);
    res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(401).json({ message });
  }
}
