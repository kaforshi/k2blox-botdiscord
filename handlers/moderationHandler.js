const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction, client) => {
    const customId = interaction.customId;

    if (customId.startsWith('mod_warn_')) {
        const userId = customId.replace('mod_warn_', '');
        const member = interaction.guild.members.cache.get(userId);
        
        if (!member) {
            return interaction.reply({
                content: 'User not found!',
                ephemeral: true
            });
        }

        const result = await client.moderation.warnUser(interaction, member, 'Warned via button interaction', client.database);

        const embed = new EmbedBuilder()
            .setTitle('⚠️ User Warned')
            .setColor(result.success ? '#ffaa00' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true }
            )
            .setTimestamp();

        if (result.warningCount) {
            embed.addFields({ name: 'Warning Count', value: result.warningCount.toString(), inline: true });
        }

        await interaction.update({ embeds: [embed] });

    } else if (customId.startsWith('mod_ban_')) {
        const userId = customId.replace('mod_ban_', '');
        const member = interaction.guild.members.cache.get(userId);
        
        if (!member) {
            return interaction.reply({
                content: 'User not found!',
                ephemeral: true
            });
        }

        const result = await client.moderation.banUser(interaction, member.user, 'Banned via button interaction', client.database);

        const embed = new EmbedBuilder()
            .setTitle('🔨 User Banned')
            .setColor(result.success ? '#ff0000' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true }
            )
            .setTimestamp();

        await interaction.update({ embeds: [embed] });

    } else if (customId.startsWith('mod_kick_')) {
        const userId = customId.replace('mod_kick_', '');
        const member = interaction.guild.members.cache.get(userId);
        
        if (!member) {
            return interaction.reply({
                content: 'User not found!',
                ephemeral: true
            });
        }

        const result = await client.moderation.kickUser(interaction, member, 'Kicked via button interaction', client.database);

        const embed = new EmbedBuilder()
            .setTitle('👢 User Kicked')
            .setColor(result.success ? '#ff8800' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true }
            )
            .setTimestamp();

        await interaction.update({ embeds: [embed] });
    }
};
