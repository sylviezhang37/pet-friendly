import { Request, Response } from "express";
import { PostgresReviewsRepo } from "../repo";

export class Handler {
  constructor(private readonly reviewsRepo: PostgresReviewsRepo) {}
}
