const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
    console.log('🤖 K2Blox Discord Bot Setup');
    console.log('============================\n');

    try {
        // Check if .env already exists
        if (fs.existsSync('.env')) {
            const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
            if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
                console.log('❌ Setup cancelled.');
                rl.close();
                return;
            }
        }

        console.log('📝 Please provide the following information:\n');

        const discordToken = await question('Discord Bot Token: ');
        const clientId = await question('Discord Client ID: ');
        const guildId = await question('Discord Guild ID (optional): ');
        const spotifyClientId = await question('Spotify Client ID (optional): ');
        const spotifyClientSecret = await question('Spotify Client Secret (optional): ');
        const ownerId = await question('Owner User ID (optional): ');

        // Create .env file
        const envContent = `# Discord Bot Configuration
DISCORD_TOKEN=${discordToken}
CLIENT_ID=${clientId}
GUILD_ID=${guildId || ''}

# Spotify API Configuration
SPOTIFY_CLIENT_ID=${spotifyClientId || ''}
SPOTIFY_CLIENT_SECRET=${spotifyClientSecret || ''}

# Database Configuration
DATABASE_PATH=./database.sqlite

# Bot Configuration
PREFIX=!
OWNER_ID=${ownerId || ''}
`;

        fs.writeFileSync('.env', envContent);

        console.log('\n✅ Setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Run "npm install" to install dependencies');
        console.log('2. Run "npm start" to start the bot');
        console.log('3. Use "/config" command in Discord to configure your server');
        console.log('\n📖 For more information, check the README.md file');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

setup();
