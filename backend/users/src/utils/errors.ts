export class UsernameAlreadyExistsError extends Error {
  constructor(username: string) {
    super(`Username ${username} already exists`);
    this.name = "UsernameAlreadyExistsError";
  }
}

export class UsernameInvalidError extends Error {
  constructor(username: string) {
    super(`Username ${username} is invalid`);
    this.name = "UsernameInvalidError";
  }
}
