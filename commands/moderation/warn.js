const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user for breaking server rules')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const targetUser = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');

        // Check if user is trying to warn themselves
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: 'You cannot warn yourself!',
                ephemeral: true
            });
        }

        // Check if user is trying to warn the bot
        if (targetUser.id === client.user.id) {
            return interaction.reply({
                content: 'You cannot warn me!',
                ephemeral: true
            });
        }

        // Check if target user has higher permissions
        if (targetUser.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: 'You cannot warn someone with equal or higher permissions!',
                ephemeral: true
            });
        }

        const result = await client.moderation.warnUser(interaction, targetUser, reason, client.database);

        const embed = new EmbedBuilder()
            .setTitle('⚠️ User Warned')
            .setColor(result.success ? '#ffaa00' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${targetUser.user.tag} (${targetUser.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        if (result.warningCount) {
            embed.addFields({ name: 'Warning Count', value: result.warningCount.toString(), inline: true });
        }

        if (result.autoAction) {
            embed.setColor('#ff0000');
            embed.setTitle('🔨 Auto-Ban Executed');
        }

        await interaction.reply({ embeds: [embed] });

        // Send DM to warned user
        if (result.success) {
            const dmEmbed = new EmbedBuilder()
                .setTitle('⚠️ You have been warned')
                .setDescription(`You have been warned in **${interaction.guild.name}**`)
                .setColor('#ffaa00')
                .addFields(
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            try {
                await targetUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log('Could not send DM to warned user');
            }
        }
    },
};
