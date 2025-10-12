const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View warnings for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check warnings for')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const targetUser = interaction.options.getMember('user');

        const result = await client.moderation.getWarnings(interaction, targetUser, client.database);

        const embed = new EmbedBuilder()
            .setTitle('⚠️ User Warnings')
            .setColor('#ffaa00')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${targetUser.user.tag} (${targetUser.id})`, inline: true },
                { name: 'Total Warnings', value: result.warnings.length.toString(), inline: true }
            )
            .setTimestamp();

        if (result.warnings.length > 0) {
            // Split warnings into chunks if too long
            const warningChunks = [];
            let currentChunk = '';
            
            for (let i = 0; i < result.warnings.length; i++) {
                const warning = result.warnings[i];
                const date = new Date(warning.timestamp).toLocaleDateString();
                const warningText = `${i + 1}. **${warning.reason}** - <@${warning.moderator_id}> (${date})\n`;
                
                if (currentChunk.length + warningText.length > 1024) {
                    warningChunks.push(currentChunk);
                    currentChunk = warningText;
                } else {
                    currentChunk += warningText;
                }
            }
            
            if (currentChunk) {
                warningChunks.push(currentChunk);
            }

            // Add first chunk
            embed.addFields({
                name: 'Warning History',
                value: warningChunks[0] || 'No warnings found',
                inline: false
            });

            // If there are multiple chunks, add them as separate fields
            for (let i = 1; i < warningChunks.length; i++) {
                embed.addFields({
                    name: `Warning History (${i + 1})`,
                    value: warningChunks[i],
                    inline: false
                });
            }
        } else {
            embed.addFields({
                name: 'Warning History',
                value: 'No warnings found',
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
