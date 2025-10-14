const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Bot ${client.user.tag} berhasil login!`);
        console.log(`📊 Bot aktif di ${client.guilds.cache.size} server`);
        console.log(`👥 Melayani ${client.users.cache.size} pengguna`);
        
        // Set status bot
        client.user.setActivity('K2BLOX Bot | /help', { type: 'WATCHING' });
    },
};
