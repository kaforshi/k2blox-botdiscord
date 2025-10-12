const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show help information for the bot'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 K2Blox Discord Bot')
            .setDescription('Advanced Discord bot with moderation, music, and customization features')
            .setColor('#0099ff')
            .addFields(
                {
                    name: '🛡️ Moderation Commands',
                    value: '`/warn` - Warn a user\n`/ban` - Ban a user\n`/kick` - Kick a user\n`/warnings` - View user warnings\n`/clearwarnings` - Clear user warnings',
                    inline: true
                },
                {
                    name: '🎵 Music Commands',
                    value: '`/play` - Play music from YouTube/Spotify\n`/queue` - View music queue\n`/leave` - Make bot leave voice channel',
                    inline: true
                },
                {
                    name: '⚙️ Configuration',
                    value: '`/config` - Configure server settings\n`/embed` - Create and manage embed templates',
                    inline: true
                },
                {
                    name: '🎉 Features',
                    value: '• Auto-warn and auto-ban system\n• Welcome messages\n• Music player (YouTube & Spotify)\n• Custom embed templates\n• Configurable through Discord\n• Logging system',
                    inline: false
                },
                {
                    name: '📝 Variables',
                    value: 'Welcome messages support:\n`{user}` - User mention\n`{username}` - Username\n`{guild}` - Server name\n`{memberCount}` - Total members',
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'K2Blox Bot | Made with ❤️' });

        await interaction.reply({ embeds: [embed] });
    },
};
