import { Prisma } from '@prisma/client';

export interface CreateCardInput {
	title: string;
	description: string;
	genre: string;
	order?: number;
	expiration?: Date;
	isAvailable?: boolean;
	isHot?: boolean;
	isDiscover?: boolean;
	isPreview?: boolean;
	userId: string;
	categoryId: string;
	isSquare: boolean;
	href: string;
}

export type UpdateCardInput = Partial<
	Omit<Prisma.CardUpdateInput, 'userId' | 'imageMetadata' | 'category' | 'createdBy'>
> & {
	categoryId?: string;
};

export interface CardFilterOptions {
	isAvailable?: boolean;
	isHot?: boolean;
	isDiscover?: boolean;
	isPreview?: boolean;
	categoryId?: string | string[];
	genre?: string | string[];
	expirationBefore?: Date;
	expirationAfter?: Date;
	searchTerm?: string;
	skip?: number;
	take?: number;
	orderBy?: 'title' | 'createdAt' | 'order' | 'expiration';
	sortDirection?: 'asc' | 'desc';
}
