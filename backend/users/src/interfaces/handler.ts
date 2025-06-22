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
}
