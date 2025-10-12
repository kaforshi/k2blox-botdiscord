const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

console.log('🧪 Testing bot connection...');

// Test minimal intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log('✅ Bot connected successfully!');
    console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
    console.log('🎯 Minimal intents working - no privileged intents needed');
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Bot connection error:', error.message);
    process.exit(1);
});

// Test login
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Login failed:', error.message);
    process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('⏰ Test timeout - stopping...');
    process.exit(0);
}, 10000);
