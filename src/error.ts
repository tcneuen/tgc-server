import { PrismaClientValidationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export function errorHandler(
  err:
    | PrismaClientValidationError
    | PrismaClientKnownRequestError
    | ZodError
    | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void | Promise<void> {
  console.log("better error");
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(400).json({
        errorType: "prisma-client-unique-constraint",
        errors: [
          "There is a unique constraint violation, a new user cannot be created with this email",
        ],
      });
    } else {
      console.log(err);
      res.status(400).json({
        errorType: "prisma-client",
        error: `Error ${err.code}`,
      });
    }
  } else if (err instanceof ZodError) {
    res.status(400).json({
      errorType: "zod-validation",
      errors: err.issues,
    });
  } else if (err instanceof PrismaClientValidationError) {
    console.log(err);
    res.status(400).json({
      errorType: "prisma-validation",
      errors: ["Unknown Validation Error"],
    });
  } else {
    res.status(500).json({
      errorType: "unknown",
      errors: [err.message],
    });
  }
}

export function zodValidateSchema<T>(
  schema: ZodSchema<T>,
  req: Request<T>,
  next: NextFunction,
): T | void {
  try {
    return schema.parse(req.body);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      next(error);
    }
    next(error);
  }
}
