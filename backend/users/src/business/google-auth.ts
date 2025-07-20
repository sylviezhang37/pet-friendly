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
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid token payload");
      }

      return {
        sub: payload.sub,
        email: payload.email!,
        name: payload.name!,
      };
    } catch (error) {
      console.error("Google token verification failed:", error);
      throw error;
    }
  }
}
