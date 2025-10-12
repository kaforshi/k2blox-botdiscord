const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction, client) {
        const targetUser = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if user is trying to kick themselves
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: 'You cannot kick yourself!',
                ephemeral: true
            });
        }

        // Check if user is trying to kick the bot
        if (targetUser.id === client.user.id) {
            return interaction.reply({
                content: 'You cannot kick me!',
                ephemeral: true
            });
        }

        // Check if target user has higher permissions
        if (targetUser.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: 'You cannot kick someone with equal or higher permissions!',
                ephemeral: true
            });
        }

        // Check if bot can kick the user
        if (!targetUser.kickable) {
            return interaction.reply({
                content: 'I cannot kick this user! They may have higher permissions than me.',
                ephemeral: true
            });
        }

        const result = await client.moderation.kickUser(interaction, targetUser, reason, client.database);

        const embed = new EmbedBuilder()
            .setTitle('👢 User Kicked')
            .setColor(result.success ? '#ff8800' : '#ff0000')
            .setDescription(result.message)
            .addFields(
                { name: 'User', value: `${targetUser.user.tag} (${targetUser.id})`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Send DM to kicked user
        if (result.success) {
            const dmEmbed = new EmbedBuilder()
                .setTitle('👢 You have been kicked')
                .setDescription(`You have been kicked from **${interaction.guild.name}**`)
                .setColor('#ff8800')
                .addFields(
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            try {
                await targetUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log('Could not send DM to kicked user');
            }
        }
    },
};
