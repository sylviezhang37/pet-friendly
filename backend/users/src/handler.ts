import { Request, Response } from "express";
import { UsersService } from "./service";

export class Handler {
  constructor(private readonly usersService: UsersService) {}
}
