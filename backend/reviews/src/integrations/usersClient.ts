import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface UsersClient {
  getUsername(userId: string): Promise<string>;
}

export class UsersClient implements UsersClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.USERS_SERVICE_URL || `http://${process.env.TEST_HOST}:3000`;
  }

  async getUsername(userId: string): Promise<string> {
    const response = await axios.get(`${this.baseUrl}/api/v0/users/${userId}`);
    return response.data.username;
  }
}
