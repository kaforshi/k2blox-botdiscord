const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure server settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        
        const embed = client.config.createConfigEmbed(interaction.guild.id, config);
        const buttons = client.config.createConfigButtons();

        await interaction.reply({ embeds: [embed], components: buttons });
    },
};
