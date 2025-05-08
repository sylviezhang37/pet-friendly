import { UsersRepo } from "./repo";
import { User } from "./domain";
import { v4 as uuidv4 } from "uuid";

export interface UserInput {
  username: string;
  anonymous: boolean;
}

export interface UserOutput {
  user: User | null;
}

export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  async create(input: UserInput): Promise<UserOutput> {
    const user = await this.usersRepo.create(
      new User({
        id: uuidv4(),
        username: input.username,
        anonymous: input.anonymous,
        createdAt: new Date(),
      })
    );

    return {
      user: user,
    };
  }

  async get(id: string): Promise<UserOutput> {
    const user = await this.usersRepo.get(id);

    return {
      user: user,
    };
  }
}
