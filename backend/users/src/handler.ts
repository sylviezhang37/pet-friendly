import { Request, Response } from "express";
import { UsersService } from "./service";

export class Handler {
  constructor(private readonly usersService: UsersService) {}

  public createUser = async (req: Request, res: Response) => {
    try {
      const { username, anonymous } = req.body;

      const result = await this.usersService.create({
        username,
        anonymous,
      });

      res.json(result);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.usersService.get(id);

      res.json(result);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
