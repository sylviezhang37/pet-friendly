import axios from "axios";

export interface UsersClient {
  getUsername(userId: string): Promise<string>;
}

export class UsersClient implements UsersClient {
  constructor() {}

  async getUsername(userId: string): Promise<string> {
    const response = await axios.get(
      `http://localhost:3000/api/v0/users/${userId}`
    );
    return response.data.username;
  }
}
