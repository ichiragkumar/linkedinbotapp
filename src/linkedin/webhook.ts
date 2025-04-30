import { Application } from 'express';
import { Client, TextChannel } from 'discord.js';
import { Bookmark, IBookmark } from '../models/Bookmark';

export function setupLinkedInWebhook(app: Application, client: Client) {
  // This route will receive webhook notifications from LinkedIn when a user bookmarks content
  app.post('/api/linkedin/bookmark', async (req, res) => {
    try {
      const { userId, linkedinUrl, title, description, thumbnailUrl } = req.body;
      
      if (!userId || !linkedinUrl || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Create new bookmark in database
      const bookmark = new Bookmark({
        userId,
        linkedinUrl,
        title,
        description,
        thumbnailUrl,
        bookmarkedAt: new Date()
      });
      
      await bookmark.save();
      
      // Send to Discord
      const channelId = process.env.DISCORD_CHANNEL_ID;
      if (channelId) {
        const channel = client.channels.cache.get(channelId) as TextChannel;
        if (channel) {
          const date = bookmark.bookmarkedAt.toLocaleDateString();
          await channel.send(`**New LinkedIn Bookmark (${date}):**\n${title}\n${linkedinUrl}`);
        }
      }
      
      res.status(201).json({ success: true, bookmark });
    } catch (error) {
      console.error('Error processing LinkedIn bookmark webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}