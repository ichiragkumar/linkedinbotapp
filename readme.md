# LinkedIn to Discord Bot

This bot automatically syncs your LinkedIn bookmarks to a Discord channel and provides commands to view your bookmarks by different time periods.

## Features

- Automatically posts LinkedIn bookmarks to a Discord channel
- Discord slash commands to view bookmarks from different time periods
- MongoDB database to store bookmark history

## Setup Instructions

1. Clone this repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies with `npm install`
4. Build the application with `npm run build`
5. Start the server with `npm start`

## Available Commands

- `/help` - Display help information
- `/weekly` - Get LinkedIn bookmarks from the past week
- `/monthly` - Get LinkedIn bookmarks from the past month
- `/3months` - Get LinkedIn bookmarks from the past 3 months
- `/months [count]` - Get LinkedIn bookmarks from a specific number of months
- `/enter-your-month [month] [year]` - Get LinkedIn bookmarks from a specific month

## LinkedIn Integration

To integrate with LinkedIn, you'll need to:

1. Create a LinkedIn Developer app
2. Set up webhooks to notify your server when a user bookmarks content
3. Configure the webhook URL to point to `/api/linkedin/bookmark` on your server

## Discord Integration

1. Create a Discord bot at the Discord Developer Portal
2. Invite the bot to your server with appropriate permissions
3. Add your bot token to the `.env` file
4. Specify the channel ID where bookmarks should be posted