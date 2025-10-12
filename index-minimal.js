const { Client, GatewayIntentBits, Collection, Events, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import custom modules
const Database = require('./utils/database');
const ConfigManager = require('./utils/configManager');
const MusicManager = require('./utils/musicManager');
const ModerationManager = require('./utils/moderationManager');

// Create Discord client with minimal intents (no privileged intents)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Initialize collections
client.commands = new Collection();
client.cooldowns = new Collection();
client.config = new ConfigManager();
client.database = new Database();
client.music = new MusicManager(client);
client.moderation = new ModerationManager(client);

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✅ Loaded event: ${event.name}`);
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Cooldown system
        const { cooldowns } = client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                    ephemeral: true
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            
            const errorMessage = {
                content: 'There was an error while executing this command!',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    } else if (interaction.isButton() || interaction.isSelectMenu()) {
        // Handle button and select menu interactions
        const customId = interaction.customId;
        
        if (customId.startsWith('config_')) {
            require('./handlers/configHandler')(interaction, client);
        } else if (customId.startsWith('mod_')) {
            require('./handlers/moderationHandler')(interaction, client);
        } else if (customId.startsWith('music_')) {
            require('./handlers/musicHandler')(interaction, client);
        } else if (customId.startsWith('embed_')) {
            require('./handlers/embedHandler')(interaction, client);
        }
    }
});

// Initialize bot
client.once(Events.ClientReady, async () => {
    console.log(`🚀 ${client.user.tag} is online!`);
    console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
    
    // Initialize database
    await client.database.init();
    
    // Set bot activity
    client.user.setActivity('K2Blox Bot | /help', { type: ActivityType.Playing });
    
    // Register slash commands
    const { REST, Routes } = require('discord.js');
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log('🔄 Started refreshing application (/) commands.');
        
        const commands = [];
        for (const [name, command] of client.commands) {
            commands.push(command.data.toJSON());
        }
        
        // Register commands globally or to specific guild
        if (process.env.GUILD_ID) {
            // Register to specific guild (instant, good for development)
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log(`✅ Commands registered to guild: ${process.env.GUILD_ID}`);
        } else {
            // Register globally (takes up to 1 hour to propagate)
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('✅ Commands registered globally (may take up to 1 hour to appear)');
        }
        
        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Error refreshing commands:', error);
    }
});

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
