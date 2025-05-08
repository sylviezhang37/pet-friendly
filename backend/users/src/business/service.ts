import { v4 as uuidv4 } from "uuid";
import {
  uniqueUsernameGenerator,
  Config,
  adjectives,
  nouns,
} from "unique-username-generator";

import { UsersRepo } from "../interfaces/repo";
import { User } from "./domain";
import {
  UsernameAlreadyExistsError,
  UsernameInvalidError,
} from "../utils/errors";

const usernameConfig: Config = {
  dictionaries: [adjectives, nouns],
};

export interface UserInput {
  username?: string;
  anonymous: boolean;
}

export interface UserOutput {
  user: User | null;
}

export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  private async generateUsername(): Promise<string> {
    const username: string = uniqueUsernameGenerator(usernameConfig);

    const isUnique = await this.checkUsernameUniqueness(username);
    if (!isUnique) {
      return this.generateUsername();
    }
    return username;
  }

  private async checkUsernameUniqueness(username: string): Promise<boolean> {
    const user = await this.usersRepo.getByUsername(username);
    return user === null;
  }

  private async checkUsernameValidity(username: string): Promise<boolean> {
    // TODO: add a a more robust validity check logic
    return 0 < username.length && username.length < 25;
  }

  async create(input: UserInput): Promise<UserOutput> {
    let username: string;

    if (input.username) {
      if (!(await this.checkUsernameUniqueness(input.username))) {
        throw new UsernameAlreadyExistsError(input.username);
      }

      if (!(await this.checkUsernameValidity(input.username))) {
        throw new UsernameInvalidError(input.username);
      }

      username = input.username;
    } else {
      username = await this.generateUsername();
    }

    const user = await this.usersRepo.create(
      new User({
        id: uuidv4(),
        username: username,
        anonymous: input.anonymous,
        createdAt: new Date(),
      })
    );

    return {
      user: user,
    };
  }

  async getById(id: string): Promise<UserOutput> {
    const user = await this.usersRepo.getById(id);

    return {
      user: user,
    };
  }

  async getByUsername(username: string): Promise<UserOutput> {
    const user = await this.usersRepo.getByUsername(username);

    return {
      user: user,
    };
  }
}
