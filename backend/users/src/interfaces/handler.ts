import { Request, Response } from "express";
import { UsersService } from "../business/service";
import {
  UsernameAlreadyExistsError,
  UsernameInvalidError,
} from "../utils/errors";

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
      if (error instanceof UsernameAlreadyExistsError) {
        res.status(400).json({ error: error.message });
      }

      if (error instanceof UsernameInvalidError) {
        res.status(409).json({ error: error.message });
      }

      console.error("Unexpected error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.usersService.getById(id);

      res.json(result);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
