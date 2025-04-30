import { Application } from 'express';
import { Client } from 'discord.js';
import { Bookmark } from './models/Bookmark';

export function setupRoutes(app: Application, client: Client) {
  // API route to manually add a bookmark (for testing or alternative integrations)
  app.post('/api/bookmarks', async (req, res) => {
    try {
      const { userId, linkedinUrl, title, description, thumbnailUrl } = req.body;
      
      if (!userId || !linkedinUrl || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const bookmark = new Bookmark({
        userId,
        linkedinUrl,
        title,
        description,
        thumbnailUrl,
        bookmarkedAt: new Date()
      });
      
      await bookmark.save();
      
      res.status(201).json({ success: true, bookmark });
    } catch (error) {
      console.error('Error creating bookmark:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // API route to get all bookmarks
  app.get('/api/bookmarks', async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      const bookmarks = await Bookmark.find({ userId }).sort({ bookmarkedAt: -1 });
      
      res.json({ bookmarks });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
