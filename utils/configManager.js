const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

class ConfigManager {
    constructor() {
        this.configs = new Map();
    }

    async getGuildConfig(guildId, database) {
        if (!this.configs.has(guildId)) {
            const config = await database.getGuildConfig(guildId);
            this.configs.set(guildId, config);
        }
        return this.configs.get(guildId);
    }

    async updateGuildConfig(guildId, updates, database) {
        await database.updateGuildConfig(guildId, updates);
        const config = await database.getGuildConfig(guildId);
        this.configs.set(guildId, config);
        return config;
    }

    createConfigEmbed(guildId, config) {
        const embed = new EmbedBuilder()
            .setTitle('⚙️ Server Configuration')
            .setDescription('Configure your server settings using the buttons below.')
            .setColor('#0099ff')
            .addFields(
                {
                    name: '📝 Welcome Settings',
                    value: `Channel: ${config.welcome_channel_id ? `<#${config.welcome_channel_id}>` : 'Not set'}\nMessage: ${config.welcome_message || 'Default message'}`,
                    inline: true
                },
                {
                    name: '📊 Moderation Settings',
                    value: `Log Channel: ${config.log_channel_id ? `<#${config.log_channel_id}>` : 'Not set'}\nAuto Warn: ${config.auto_warn_threshold} warnings\nAuto Ban: ${config.auto_ban_threshold} warnings`,
                    inline: true
                },
                {
                    name: '🎵 Music Settings',
                    value: `Music Channel: ${config.music_channel_id ? `<#${config.music_channel_id}>` : 'Not set'}\nSpotify: ${config.spotify_enabled ? '✅' : '❌'}\nYouTube: ${config.youtube_enabled ? '✅' : '❌'}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({ text: `Guild ID: ${guildId}` });

        return embed;
    }

    createConfigButtons() {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_welcome')
                    .setLabel('Welcome Settings')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📝'),
                new ButtonBuilder()
                    .setCustomId('config_moderation')
                    .setLabel('Moderation')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🛡️'),
                new ButtonBuilder()
                    .setCustomId('config_music')
                    .setLabel('Music Settings')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎵')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_embeds')
                    .setLabel('Embed Templates')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋'),
                new ButtonBuilder()
                    .setCustomId('config_reset')
                    .setLabel('Reset All')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔄')
            );

        return [row1, row2];
    }

    createWelcomeConfigEmbed(config) {
        const embed = new EmbedBuilder()
            .setTitle('📝 Welcome Configuration')
            .setDescription('Configure welcome messages and channels.')
            .setColor('#00ff00')
            .addFields(
                {
                    name: 'Current Settings',
                    value: `Channel: ${config.welcome_channel_id ? `<#${config.welcome_channel_id}>` : 'Not set'}\nMessage: \`${config.welcome_message}\``,
                    inline: false
                },
                {
                    name: 'Available Variables',
                    value: '`{user}` - User mention\n`{username}` - Username\n`{guild}` - Server name\n`{memberCount}` - Total members',
                    inline: false
                }
            );

        return embed;
    }

    createWelcomeConfigButtons() {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_welcome_channel')
                    .setLabel('Set Welcome Channel')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('config_welcome_message')
                    .setLabel('Set Welcome Message')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('config_back')
                    .setLabel('Back to Main')
                    .setStyle(ButtonStyle.Secondary)
            );

        return [row];
    }

    createModerationConfigEmbed(config) {
        const embed = new EmbedBuilder()
            .setTitle('🛡️ Moderation Configuration')
            .setDescription('Configure moderation settings and thresholds.')
            .setColor('#ff0000')
            .addFields(
                {
                    name: 'Current Settings',
                    value: `Log Channel: ${config.log_channel_id ? `<#${config.log_channel_id}>` : 'Not set'}\nAuto Warn Threshold: ${config.auto_warn_threshold}\nAuto Ban Threshold: ${config.auto_ban_threshold}`,
                    inline: false
                },
                {
                    name: 'How it works',
                    value: 'When a user reaches the warn threshold, they will be automatically warned. When they reach the ban threshold, they will be automatically banned.',
                    inline: false
                }
            );

        return embed;
    }

    createModerationConfigButtons() {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_log_channel')
                    .setLabel('Set Log Channel')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('config_warn_threshold')
                    .setLabel('Warn Threshold')
                    .setStyle(ButtonStyle.Secondary)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_ban_threshold')
                    .setLabel('Ban Threshold')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('config_back')
                    .setLabel('Back to Main')
                    .setStyle(ButtonStyle.Secondary)
            );

        return [row1, row2];
    }

    createMusicConfigEmbed(config) {
        const embed = new EmbedBuilder()
            .setTitle('🎵 Music Configuration')
            .setDescription('Configure music settings and features.')
            .setColor('#00ff00')
            .addFields(
                {
                    name: 'Current Settings',
                    value: `Music Channel: ${config.music_channel_id ? `<#${config.music_channel_id}>` : 'Not set'}\nSpotify: ${config.spotify_enabled ? '✅ Enabled' : '❌ Disabled'}\nYouTube: ${config.youtube_enabled ? '✅ Enabled' : '❌ Disabled'}`,
                    inline: false
                }
            );

        return embed;
    }

    createMusicConfigButtons() {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_music_channel')
                    .setLabel('Set Music Channel')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('config_spotify_toggle')
                    .setLabel('Toggle Spotify')
                    .setStyle(ButtonStyle.Success)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_youtube_toggle')
                    .setLabel('Toggle YouTube')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('config_back')
                    .setLabel('Back to Main')
                    .setStyle(ButtonStyle.Secondary)
            );

        return [row1, row2];
    }
}

module.exports = ConfigManager;
