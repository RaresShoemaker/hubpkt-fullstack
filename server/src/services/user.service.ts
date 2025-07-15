import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db/prisma-client';
import ApiError from '../utils/ApiError';
import { UserTypes } from '../types/index';
import { checkPassword, generateToken, hashPassword } from '../utils/auth';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

interface TokenPayload {
	userId: string;
	email: string;
	name: string;
}

export const userRegister = async (data: UserTypes.RegisterUserInput) => {
	if (config.NODE_ENV === 'production') {
		if (!data.registrationCode || data.registrationCode !== config.REGISTRATION_CODE) {
			throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid registration code');
		}
	}

	const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
	if (existingUser) {
		throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists');
	}

	const userPassword = await hashPassword(data.password);
	const user = await prisma.user.create({
		data: {
			...data,
			password: userPassword,
			deletedAt: null
		}
	});

	return user;
};

export const userLogin = async (data: UserTypes.LoginUserInput) => {
	const user = await prisma.user.findUnique({ where: { email: data.email } });
	if (!user) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
	}

	const isValid = await checkPassword(data.password, user.password);
	if (!isValid) {
		throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password');
	}
	const token = generateToken({ email: user.email, name: user.name, id: user.id });

	return { user, token };
};

export const findUserById = async (id: string) => {
	const user = await prisma.user.findUnique({ where: { id } });
	if (!user) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
	}

	return user;
};

export const fetchCurrentUser = async (token: string) => {
	const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
	const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
	if (!user) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
	}

	return user;
};
