export class UnauthorizedError extends Error {
  readonly name = 'UnauthorizedError';
}

export class ForbiddenError extends Error {
  readonly name = 'ForbiddenError';
}

export class ConflictError extends Error {
  readonly name = 'ConflictError';
}
