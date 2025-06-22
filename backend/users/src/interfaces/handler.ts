import { Request, Response } from "express";
import { UsersService } from "../business/service";

export class Handler {
  constructor(private readonly usersService: UsersService) {}

  public getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const result = await this.usersService.getByUsername(id);

      res.json(result);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
      const result = await this.usersService.update(id, username);
      res.json(result);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public signInWithGoogle = async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      const result = await this.usersService.signInWithGoogle({ idToken });
      res.json(result);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public completeGoogleSignIn = async (req: Request, res: Response) => {
    try {
      const { username, email, googleId } = req.body;
      const result = await this.usersService.completeGoogleSignIn({
        username,
        email,
        googleId,
      });
      res.json(result);
    } catch (error) {
      console.error("Error completing Google sign in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public isUsernameAvailable = async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const result = await this.usersService.isUsernameAvailable(username);
      res.json(result);
    } catch (error) {
      console.error("Error checking username availability:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
