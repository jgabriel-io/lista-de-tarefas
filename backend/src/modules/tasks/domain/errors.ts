export class TaskNotFoundError extends Error {
  readonly name = 'TaskNotFoundError';
  constructor(message = 'Tarefa não encontrada') {
    super(message);
  }
}

export class TaskValidationError extends Error {
  readonly name = 'TaskValidationError';
  constructor(message: string) {
    super(message);
  }
}
