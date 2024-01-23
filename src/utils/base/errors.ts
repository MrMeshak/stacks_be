export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid Credentials') {
    super(message);
  }
}

export class AlreadyExistsError extends Error {
  constructor(message: string = 'Already Exists') {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
  }
}
