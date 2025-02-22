import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { UserServices } from "../services/index";
import  {StatusCodes} from "http-status-codes";
import { config } from "../config/environment";
import { UserTypes } from "../types/index";

const omitPassword = (user: UserTypes.User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const userRegister = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.userRegister(req.body);
  res.status(StatusCodes.OK).json({ ...omitPassword(user) });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const {user, token} = await UserServices.userLogin(req.body);
  res.cookie('token', token, { 
    httpOnly: true, 
    secure: config.NODE_ENV === 'production', // Enable this in production
    sameSite: 'strict'
  });
  res.status(StatusCodes.OK).json({ ...omitPassword(user) });
});

export const findUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.findUserById(req.params.id);
  res.status(StatusCodes.OK).json({ ...omitPassword(user) });
});

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.fetchCurrentUser(req.cookies.token);
  res.status(StatusCodes.OK).json({ ...omitPassword(user) });
});
