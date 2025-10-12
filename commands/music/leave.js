const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Make the bot leave the voice channel'),

    async execute(interaction, client) {
        const result = await client.music.leaveChannel(interaction.guild.id);

        const embed = new EmbedBuilder()
            .setTitle('👋 Left Voice Channel')
            .setDescription(result.message)
            .setColor(result.success ? '#00ff00' : '#ff0000')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
