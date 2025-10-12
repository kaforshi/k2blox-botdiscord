const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = async (interaction, client) => {
    const customId = interaction.customId;

    if (customId === 'config_welcome') {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        const embed = client.config.createWelcomeConfigEmbed(config);
        const buttons = client.config.createWelcomeConfigButtons();
        
        await interaction.update({ embeds: [embed], components: buttons });

    } else if (customId === 'config_moderation') {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        const embed = client.config.createModerationConfigEmbed(config);
        const buttons = client.config.createModerationConfigButtons();
        
        await interaction.update({ embeds: [embed], components: buttons });

    } else if (customId === 'config_music') {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        const embed = client.config.createMusicConfigEmbed(config);
        const buttons = client.config.createMusicConfigButtons();
        
        await interaction.update({ embeds: [embed], components: buttons });

    } else if (customId === 'config_back') {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        const embed = client.config.createConfigEmbed(interaction.guild.id, config);
        const buttons = client.config.createConfigButtons();
        
        await interaction.update({ embeds: [embed], components: buttons });

    } else if (customId === 'config_welcome_channel') {
        const modal = new ModalBuilder()
            .setCustomId('modal_welcome_channel')
            .setTitle('Set Welcome Channel');

        const channelInput = new TextInputBuilder()
            .setCustomId('welcome_channel_input')
            .setLabel('Channel ID or mention')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter channel ID or mention the channel')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(channelInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId === 'config_welcome_message') {
        const modal = new ModalBuilder()
            .setCustomId('modal_welcome_message')
            .setTitle('Set Welcome Message');

        const messageInput = new TextInputBuilder()
            .setCustomId('welcome_message_input')
            .setLabel('Welcome Message')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Welcome {user} to {guild}!')
            .setValue('Welcome {user} to {guild}!')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId === 'config_log_channel') {
        const modal = new ModalBuilder()
            .setCustomId('modal_log_channel')
            .setTitle('Set Log Channel');

        const channelInput = new TextInputBuilder()
            .setCustomId('log_channel_input')
            .setLabel('Channel ID or mention')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter channel ID or mention the channel')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(channelInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId === 'config_warn_threshold') {
        const modal = new ModalBuilder()
            .setCustomId('modal_warn_threshold')
            .setTitle('Set Auto-Warn Threshold');

        const thresholdInput = new TextInputBuilder()
            .setCustomId('warn_threshold_input')
            .setLabel('Warning Threshold')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('3')
            .setValue('3')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(thresholdInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId === 'config_ban_threshold') {
        const modal = new ModalBuilder()
            .setCustomId('modal_ban_threshold')
            .setTitle('Set Auto-Ban Threshold');

        const thresholdInput = new TextInputBuilder()
            .setCustomId('ban_threshold_input')
            .setLabel('Ban Threshold')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('5')
            .setValue('5')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(thresholdInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId === 'config_music_channel') {
        const modal = new ModalBuilder()
            .setCustomId('modal_music_channel')
            .setTitle('Set Music Channel');

        const channelInput = new TextInputBuilder()
            .setCustomId('music_channel_input')
            .setLabel('Channel ID or mention')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter channel ID or mention the channel')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(channelInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId === 'config_spotify_toggle') {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        await client.config.updateGuildConfig(interaction.guild.id, { spotify_enabled: !config.spotify_enabled }, client.database);
        
        const embed = client.config.createMusicConfigEmbed(await client.config.getGuildConfig(interaction.guild.id, client.database));
        const buttons = client.config.createMusicConfigButtons();
        
        await interaction.update({ embeds: [embed], components: buttons });

    } else if (customId === 'config_youtube_toggle') {
        const config = await client.config.getGuildConfig(interaction.guild.id, client.database);
        await client.config.updateGuildConfig(interaction.guild.id, { youtube_enabled: !config.youtube_enabled }, client.database);
        
        const embed = client.config.createMusicConfigEmbed(await client.config.getGuildConfig(interaction.guild.id, client.database));
        const buttons = client.config.createMusicConfigButtons();
        
        await interaction.update({ embeds: [embed], components: buttons });

    } else if (customId === 'config_reset') {
        const embed = new EmbedBuilder()
            .setTitle('🔄 Reset Configuration')
            .setDescription('Are you sure you want to reset all server configuration? This action cannot be undone!')
            .setColor('#ff0000')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_reset_confirm')
                    .setLabel('Yes, Reset All')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('config_back')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.update({ embeds: [embed], components: [row] });

    } else if (customId === 'config_reset_confirm') {
        // Reset all configuration to defaults
        await client.config.updateGuildConfig(interaction.guild.id, {
            welcome_channel_id: null,
            welcome_message: 'Welcome {user} to {guild}!',
            log_channel_id: null,
            auto_warn_threshold: 3,
            auto_ban_threshold: 5,
            music_channel_id: null,
            spotify_enabled: 1,
            youtube_enabled: 1
        }, client.database);

        const embed = new EmbedBuilder()
            .setTitle('✅ Configuration Reset')
            .setDescription('All server configuration has been reset to default values.')
            .setColor('#00ff00')
            .setTimestamp();

        await interaction.update({ embeds: [embed], components: [] });
    }
};
