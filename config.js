require('dotenv').config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    prefix: '!',
    
    // K2BLOX branding
    brand: {
        name: 'K2BLOX',
        iconURL: 'https://cdn.discordapp.com/attachments/1421549662602789105/1426530045089943633/k2blox.png?ex=68ef83a2&is=68ee3222&hm=a1a6b74dee46862d3a061edcffe5b3902f94e70e0517f3a947e3a03f5c4db578&',
        color: 0x00ff00 // Hijau
    }
};
