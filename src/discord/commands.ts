import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ChatInputCommandInteraction, Client, CommandInteraction } from 'discord.js';
import { fetchBookmarks } from '../services/bookmarkService';

const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display help information for LinkedIn Bookmark Bot'),
  
  new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Get LinkedIn bookmarks from the past week'),
  
  new SlashCommandBuilder()
    .setName('monthly')
    .setDescription('Get LinkedIn bookmarks from the past month'),
  
  new SlashCommandBuilder()
    .setName('3months')
    .setDescription('Get LinkedIn bookmarks from the past 3 months'),
  
  new SlashCommandBuilder()
    .setName('months')
    .setDescription('Get LinkedIn bookmarks from a specific number of months')
    .addIntegerOption(option => 
      option.setName('count')
        .setDescription('Number of months to look back')
        .setRequired(true)),
  
  new SlashCommandBuilder()
    .setName('enter-your-month')
    .setDescription('Get LinkedIn bookmarks from a specific month')
    .addIntegerOption(option => 
      option.setName('month')
        .setDescription('Month (1-12)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12))
    .addIntegerOption(option => 
      option.setName('year')
        .setDescription('Year (e.g., 2025)')
        .setRequired(true))
];

export async function registerCommands(client: Client) {
  try {
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN || '');
    
    console.log('Started refreshing application commands');
    
    await rest.put(
      Routes.applicationCommands(client.user?.id || ''),
      { body: commands }
    );
    
    console.log('Successfully reloaded application commands');
    
    // Set up command handlers
    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;
      
      await handleCommand(interaction as ChatInputCommandInteraction);
    });
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

async function handleCommand(interaction: ChatInputCommandInteraction) {
  try {
    const { commandName } = interaction;
    
    switch (commandName) {
      case 'help':
        await handleHelpCommand(interaction);
        break;
      case 'weekly':
        await handleTimeRangeCommand(interaction, 7); // 7 days
        break;
      case 'monthly':
        await handleTimeRangeCommand(interaction, 30); // 30 days
        break;
      case '3months':
        await handleTimeRangeCommand(interaction, 90); // 90 days
        break;
      case 'months':
        const monthCount = interaction.options.getInteger('count') || 1;
        await handleTimeRangeCommand(interaction, monthCount * 30); // approximate days
        break;
      case 'enter-your-month':
        const month = interaction.options.getInteger('month') || 1;
        const year = interaction.options.getInteger('year') || new Date().getFullYear();
        await handleSpecificMonthCommand(interaction, month, year);
        break;
      default:
        await interaction.reply('Unknown command');
    }
  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply({ content: 'An error occurred while processing your command', ephemeral: true });
  }
}

async function handleHelpCommand(interaction: CommandInteraction) {
  const helpText = `
**LinkedIn Bookmark Bot Commands**

/help - Display this help message
/weekly - Get LinkedIn bookmarks from the past week
/monthly - Get LinkedIn bookmarks from the past month
/3months - Get LinkedIn bookmarks from the past 3 months
/months [count] - Get LinkedIn bookmarks from a specific number of months
/enter-your-month [month] [year] - Get LinkedIn bookmarks from a specific month

*This bot syncs your LinkedIn bookmarks to this Discord channel automatically.*
`;

  await interaction.reply(helpText);
}

async function handleTimeRangeCommand(interaction: CommandInteraction, days: number) {
  await interaction.deferReply();
  
  const userId = interaction.user.id;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  const bookmarks = await fetchBookmarks(userId, startDate, endDate);
  
  if (bookmarks.length === 0) {
    await interaction.editReply(`No LinkedIn bookmarks found in the past ${days} days.`);
    return;
  }
  
  let response = `Found ${bookmarks.length} LinkedIn bookmark(s) from the past ${days} days:\n\n`;
  
  bookmarks.forEach((bookmark, index) => {
    const date = bookmark.bookmarkedAt.toLocaleDateString();
    response += `**${index + 1}. ${bookmark.title}** (${date})\n${bookmark.linkedinUrl}\n\n`;
  });
  
  await interaction.editReply(response);
}

async function handleSpecificMonthCommand(interaction: CommandInteraction, month: number, year: number) {
  await interaction.deferReply();
  
  const userId = interaction.user.id;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month
  
  const bookmarks = await fetchBookmarks(userId, startDate, endDate);
  
  if (bookmarks.length === 0) {
    await interaction.editReply(`No LinkedIn bookmarks found for ${getMonthName(month)} ${year}.`);
    return;
  }
  
  let response = `Found ${bookmarks.length} LinkedIn bookmark(s) from ${getMonthName(month)} ${year}:\n\n`;
  
  bookmarks.forEach((bookmark, index) => {
    const date = bookmark.bookmarkedAt.toLocaleDateString();
    response += `**${index + 1}. ${bookmark.title}** (${date})\n${bookmark.linkedinUrl}\n\n`;
  });
  
  await interaction.editReply(response);
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
}