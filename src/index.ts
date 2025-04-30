import express from 'express';
import dotenv from 'dotenv';
import { Client, IntentsBitField, TextChannel } from 'discord.js';
import mongoose from 'mongoose';
import cors from 'cors'; // Add this import
import { setupRoutes } from './routes';
import { registerCommands } from './discord/commands';
import { setupLinkedInWebhook } from './linkedin/webhook';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Add CORS middleware before other middleware
app.use(cors({
  origin: '*', // During development, allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

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
  console.log(`Test the API at: http://localhost:${PORT}/api/health`);
});

// Login Discord bot

// Login Discord bot
client.login(process.env.DISCORD_TOKEN)

