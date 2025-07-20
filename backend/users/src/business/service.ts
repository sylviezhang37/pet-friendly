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

export interface SignInOutput {
  isNewUser: boolean;
  user: GoogleUserInfo | User;
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

  async isUsernameAvailable(username: string): Promise<boolean> {
    return await this.checkUsernameUniqueness(username);
  }

  async create(userData: UserInput): Promise<UserOutput> {
    let username: string;

    if (userData.username) {
      if (!(await this.checkUsernameUniqueness(userData.username))) {
        throw new UsernameAlreadyExistsError(userData.username);
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

  async update(id: string, username: string): Promise<UserOutput> {
    const user = await this.usersRepo.updateUsername(id, username);
    return {
      user: user,
    };
  }

  async signInWithGoogle(input: GoogleSignInInput): Promise<SignInOutput> {
    const googleUser = await this.googleAuthService.verifyToken(input.idToken);
    if (!googleUser.sub) {
      throw new Error("Google user ID is required");
    }
    console.log("Completed verification with google auth service.");

    let user: User | null = await this.usersRepo.getByGoogleId(googleUser.sub);
    if (user) return { isNewUser: false, user };

    return { isNewUser: true, user: googleUser };
  }

  async completeGoogleSignIn(input: UserInput): Promise<UserOutput> {
    const { user } = await this.create(input);
    return { user };
  }
}
