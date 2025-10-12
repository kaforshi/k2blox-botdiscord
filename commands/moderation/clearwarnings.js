const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarnings')
        .setDescription('Clear all warnings for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to clear warnings for')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const targetUser = interaction.options.getMember('user');

        const result = await client.moderation.clearWarnings(interaction, targetUser, client.database);

        const embed = new EmbedBuilder()
            .setTitle('🧹 Warnings Cleared')
            .setColor(result.success ? '#00ff00' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${targetUser.user.tag} (${targetUser.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
