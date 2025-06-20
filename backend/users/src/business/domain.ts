interface UserData {
  id: string;
  username: string;
  email: string;
  googleId: string;
  createdAt: Date;
}

export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly googleId: string;
  public readonly createdAt: Date;

  constructor(data: UserData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.googleId = data.googleId;
    this.createdAt = data.createdAt;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      googleId: this.googleId,
      createdAt: this.createdAt,
    };
  }
}
