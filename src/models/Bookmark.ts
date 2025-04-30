import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  linkedinUrl: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  bookmarkedAt: Date;
  userId: string;
}

const BookmarkSchema = new Schema<IBookmark>({
  linkedinUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  thumbnailUrl: { type: String },
  bookmarkedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);


