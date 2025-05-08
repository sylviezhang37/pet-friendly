interface UserData {
  id: string;
  username: string;
  anonymous?: boolean;
  createdAt: Date;
}

export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly createdAt: Date;
  public readonly anonymous: boolean;

  constructor(data: UserData) {
    this.id = data.id;
    this.username = data.username;
    this.createdAt = data.createdAt;
    this.anonymous = data.anonymous ?? true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      anonymous: this.anonymous,
      createdAt: this.createdAt,
    };
  }
}
