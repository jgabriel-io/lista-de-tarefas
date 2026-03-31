import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ConflictError, ForbiddenError, UnauthorizedError } from '../modules/auth/domain/errors';
import { TaskNotFoundError, TaskValidationError } from '../modules/tasks/domain/errors';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
    return;
  }

  if (err instanceof TaskNotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
    return;
  }

  if (err instanceof TaskValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}

