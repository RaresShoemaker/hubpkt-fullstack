import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserTypes } from '../types/index';
import  ApiError  from '../utils/ApiError';
import {StatusCodes} from 'http-status-codes';
import { config } from '../config/environment';

const BCRYPT_ROUNDS = 10;

type TokenPayload = Pick<UserTypes.User, 'email' | 'name' | 'id'>;

const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required for hashing');
  }
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to secure password');
  }
};

const checkPassword = async (password: string, userPassword: string): Promise<boolean> => {
  if (!password || !userPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Both password and hashed password are required for comparison');
  }
  try {
    const isValid = await bcrypt.compare(password, userPassword);
    return isValid;
  } catch (error) {
    console.error('Password comparison failed:', error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Password verification failed');
  }
};

const generateToken = ({ email, name, id }: TokenPayload): string => {
  const jwtSecret = config.JWT_SECRET;
  if (!jwtSecret) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'JWT_SECRET environment variable is not configured');
  }

  try {
    return jwt.sign(
      { 
        userId: id,
        email: email, 
        name: name 
      }, 
      jwtSecret, 
      { expiresIn: '4h' }
    );
  } catch (error) {
    console.error('Token generation failed:', error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate authentication token');
  }
};

export { hashPassword, checkPassword, generateToken };