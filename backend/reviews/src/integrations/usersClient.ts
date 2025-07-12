import { Pool } from "pg";
import { PostgresUsersRepo } from "../../../users/src/interfaces/repo";
import { UsersService } from "../../../users/src/business/service";
import { GoogleAuthService } from "../../../users/src/business/google-auth";

export interface UsersClient {
  getUsername(userId: string): Promise<string>;
}

export class UsersClient implements UsersClient {
  private readonly usersService: UsersService;

  constructor(pool: Pool) {
    const googleAuthService = new GoogleAuthService();
    const usersRepo = new PostgresUsersRepo(pool);
    this.usersService = new UsersService(usersRepo, googleAuthService);
  }

  async getUsername(userId: string): Promise<string> {
    const userResult = await this.usersService.getById(userId);
    if (!userResult.user) {
      throw new Error(`User with id ${userId} not found`);
    }
    return userResult.user.username;
  }
}
