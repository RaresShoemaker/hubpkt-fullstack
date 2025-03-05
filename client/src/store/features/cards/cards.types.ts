import { ImageMetadata } from "../categories/categories.types";

export interface Card {
  id: string;
  title: string;
  description: string;
  genre: string;
  image: string;
  imageMetadata?: ImageMetadata;
  imageMetadataId?: string;
  order: number;
  expiration?: Date;
  isAvailable: boolean;
  userId: string;
  href: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDiscover: boolean;
  isHot: boolean;
  isPreview: boolean;
  isSquare: boolean;
}

export interface AffectedCard {
  id: string;
  oldOrder: number;
  newOrder: number;
}

export interface CategoryData {
  categoryId: string;
  previewTitle: string;
  hasSquareContent: boolean;
  data: Card[];
}

export interface HomeCards {
  [category: string]: CategoryData;
}

export interface InitialState {
  cards: Card[],
  homeCards: HomeCards
  total: number,
  currentCard: Card | null,
  operations: {
    create: {
      isLoading: boolean;
      error: string | null;
    };
    update: {
      isLoading: boolean;
      error: string | null;
    };
    delete: {
      isLoading: boolean;
      error: string | null;
    };
    reorder: {
      isLoading: boolean;
      error: string | null;
    };
    fetchCards: {
      isLoading: boolean;
      error: string | null;
    },
    fetchFilteredCards: {
      isLoading: boolean;
      error: string | null;
    },
    fetchHomeCards: {
      isLoading: boolean;
      error: string | null;
    },
    fetchCardsByCategory: {
      isLoading: boolean;
      error: string | null;
    },
    fetchAvailableCards: {
      isLoading: boolean;
      error: string | null;
    },
    updateCardOrder: {
      isLoading: boolean;
      error: string | null;
    };
  };
}

export interface CardResponse {
  total: number;
  cards: Card[];
}

export interface CardFilterParams {
  isAvailable?: boolean;
  isHot?: boolean;
  isDiscover?: boolean;
  isPreview?: boolean;
  categoryId?: string | string[];
  genre?: string | string[];
  expirationBefore?: Date | string;
  expirationAfter?: Date | string;
  searchTerm?: string;
  skip?: number;
  take?: number;
  orderBy?: 'title' | 'createdAt' | 'order' | 'expiration';
  sortDirection?: 'asc' | 'desc';
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  image: File;
  href: string;
  isSquare: boolean;
  isAvailable?: boolean;
  isHot?: boolean;
  isDiscover?: boolean;
  isPreview?: boolean;
  categoryId: string;
  genre?: string;
  expiration?: Date | string;
  order?: number;
}

export interface UpdateCardRequest {
  id: string;
  title?: string;
  description?: string;
  image?: File;
  isAvailable?: boolean;
  isHot?: boolean;
  isDiscover?: boolean;
  isPreview?: boolean;
  categoryId?: string;
  genre?: string;
  expiration?: Date | string;
  order?: number;
  href?: string;
  isSquare?: boolean;
}

export interface UpdateCardOrderPayload {
  cardId: string;
  newOrder: number;
  categoryId: string;
}

export interface ReorderCardsPayload {
  categoryId: string;
  orderedCardIds: string[];
}