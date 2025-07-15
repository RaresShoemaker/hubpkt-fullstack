import { Prisma } from "@prisma/client";
import { Request } from "express";

export type RegisterUserInput = Pick<Prisma.UserCreateInput, "email" | "password" | "name"> & {
  registrationCode: string; // Add this
};

export type LoginUserInput = Pick<Prisma.UserCreateInput, "email" | "password">;

export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  deletedAt: Date | null;
};

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}