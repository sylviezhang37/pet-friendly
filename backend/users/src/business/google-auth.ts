import { OAuth2Client } from "google-auth-library";
import { payload as samplePayload } from "../payload";

export interface GoogleUserInfo {
  sub: string; // Google ID
  email: string;
  name: string;
  picture?: string;
}

export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyToken(idToken: string): Promise<GoogleUserInfo> {
    // const ticket = await this.client.verifyIdToken({
    //   idToken,
    //   audience: process.env.GOOGLE_CLIENT_ID,
    // });

    // const payload = ticket.getPayload();
    // if (!payload) {
    //   throw new Error("Invalid token payload");
    // }

    const payload = samplePayload;

    return {
      sub: payload.sub,
      email: payload.email!,
      name: payload.name!,
    };
  }
}
