import express from 'express';
import dotenv from 'dotenv';
import { Client, IntentsBitField, TextChannel } from 'discord.js';
import mongoose from 'mongoose';
import { setupRoutes } from './routes';
import { registerCommands } from './discord/commands';
import { setupLinkedInWebhook } from './linkedin/webhook';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Discord client setup
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-discord-bot')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Discord bot ready event
client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user?.tag}`);
  
  // Register slash commands
  await registerCommands(client);
  
  // Setup LinkedIn webhook route
  setupLinkedInWebhook(app, client);
  
  // Setup API routes
  setupRoutes(app, client);
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Login Discord bot
client.login(process.env.DISCORD_TOKEN)