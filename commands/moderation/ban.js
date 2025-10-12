const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('delete_messages')
                .setDescription('Number of days of messages to delete (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('delete_messages') || 0;

        // Check if user is trying to ban themselves
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: 'You cannot ban yourself!',
                ephemeral: true
            });
        }

        // Check if user is trying to ban the bot
        if (targetUser.id === client.user.id) {
            return interaction.reply({
                content: 'You cannot ban me!',
                ephemeral: true
            });
        }

        // Check if target user is in the server
        const member = interaction.guild.members.cache.get(targetUser.id);
        if (member) {
            // Check if target user has higher permissions
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({
                    content: 'You cannot ban someone with equal or higher permissions!',
                    ephemeral: true
                });
            }

            // Check if bot can ban the user
            if (!member.bannable) {
                return interaction.reply({
                    content: 'I cannot ban this user! They may have higher permissions than me.',
                    ephemeral: true
                });
            }
        }

        const result = await client.moderation.banUser(interaction, targetUser, reason, client.database);

        const embed = new EmbedBuilder()
            .setTitle('🔨 User Banned')
            .setColor(result.success ? '#ff0000' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        if (deleteDays > 0) {
            embed.addFields({ name: 'Messages Deleted', value: `${deleteDays} days`, inline: true });
        }

        await interaction.reply({ embeds: [embed] });

        // Send DM to banned user
        if (result.success) {
            const dmEmbed = new EmbedBuilder()
                .setTitle('🔨 You have been banned')
                .setDescription(`You have been banned from **${interaction.guild.name}**`)
                .setColor('#ff0000')
                .addFields(
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            try {
                await targetUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log('Could not send DM to banned user');
            }
        }
    },
};
