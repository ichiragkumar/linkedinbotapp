import { Bookmark, IBookmark } from '../models/Bookmark';

export async function fetchBookmarks(userId: string, startDate: Date, endDate: Date): Promise<IBookmark[]> {
  try {
    const bookmarks = await Bookmark.find({
      userId,
      bookmarkedAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ bookmarkedAt: -1 });
    
    return bookmarks;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}
