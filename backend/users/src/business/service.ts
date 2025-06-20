import {
  uniqueUsernameGenerator,
  Config,
  adjectives,
  nouns,
} from "unique-username-generator";
import { GoogleAuthService, GoogleUserInfo } from "./google-auth";
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
  email: string;
  googleId: string;
  username: string;
}

export interface UserOutput {
  user: User | null;
}

export interface GoogleSignInInput {
  idToken: string;
}

export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly googleAuthService: GoogleAuthService
  ) {}

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

  async create(userData: UserInput): Promise<UserOutput> {
    let username: string;

    if (userData.username) {
      if (!(await this.checkUsernameUniqueness(userData.username))) {
        throw new UsernameAlreadyExistsError(userData.username);
      }

      if (!(await this.checkUsernameValidity(userData.username))) {
        throw new UsernameInvalidError(userData.username);
      }

      username = userData.username;
    } else {
      username = await this.generateUsername();
    }

    const user = await this.usersRepo.create({
      username: userData.username,
      email: userData.email,
      googleId: userData.googleId,
    });

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

  async signInWithGoogle(input: GoogleSignInInput): Promise<UserOutput> {
    const googleUser = await this.googleAuthService.verifyToken(input.idToken);
    if (!googleUser.sub) {
      throw new Error("Google user ID is required");
    }

    let user: User | null = await this.usersRepo.getByGoogleId(googleUser.sub);
    if (user) return { user };

    const { user: newUser } = await this.create({
      username: googleUser.name || (await this.generateUsername()),
      email: googleUser.email,
      googleId: googleUser.sub,
    });
    return { user: newUser };
  }
}
