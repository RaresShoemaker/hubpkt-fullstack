import { Request, Response, NextFunction } from "express";
import {StatusCodes} from "http-status-codes";
import { config } from "../config/environment";
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export const verifyAuth = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.token;
    const token = authHeader?.split(' ')[1] || cookieToken;

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'No token provided' 
      });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    
    if (!decoded.userId || !decoded.email || !decoded.name) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Invalid token payload' 
      });
      return;
    }

    req.body.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Token expired' 
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Invalid token' 
      });
      return;
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Authentication failed' 
    });
    return;
  }
};