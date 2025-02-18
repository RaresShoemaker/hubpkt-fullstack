export enum UploadMediaBucket {
  MAIN_BUCKET = 'hubpkt',
}

export enum UploadMediaFolders {
  CATEGORIES = 'categories',
  CARDS = 'cards',
}

export interface StorageMedia {
  bucketName: UploadMediaBucket;
  folder: UploadMediaFolders;
}

