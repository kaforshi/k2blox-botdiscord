const { Events, ModalSubmitInteraction } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isModalSubmit()) {
            const customId = interaction.customId;

            // Handle configuration modals
            if (customId.startsWith('modal_')) {
                await handleModalSubmit(interaction, client);
            }
        }
    },
};

async function handleModalSubmit(interaction, client) {
    const customId = interaction.customId;

    try {
        if (customId === 'modal_welcome_channel') {
            const channelInput = interaction.fields.getTextInputValue('welcome_channel_input');
            let channelId = channelInput;

            // Extract channel ID if it's a mention
            if (channelInput.startsWith('<#') && channelInput.endsWith('>')) {
                channelId = channelInput.slice(2, -1);
            }

            // Validate channel
            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Invalid channel! Please provide a valid channel ID or mention.',
                    ephemeral: true
                });
            }

            await client.config.updateGuildConfig(interaction.guild.id, { welcome_channel_id: channelId }, client.database);

            const embed = new EmbedBuilder()
                .setTitle('✅ Welcome Channel Set')
                .setDescription(`Welcome channel has been set to ${channel}`)
                .setColor('#00ff00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (customId === 'modal_welcome_message') {
            const message = interaction.fields.getTextInputValue('welcome_message_input');

            await client.config.updateGuildConfig(interaction.guild.id, { welcome_message: message }, client.database);

            const embed = new EmbedBuilder()
                .setTitle('✅ Welcome Message Set')
                .setDescription(`Welcome message has been updated!`)
                .setColor('#00ff00')
                .addFields({
                    name: 'New Message',
                    value: message,
                    inline: false
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (customId === 'modal_log_channel') {
            const channelInput = interaction.fields.getTextInputValue('log_channel_input');
            let channelId = channelInput;

            // Extract channel ID if it's a mention
            if (channelInput.startsWith('<#') && channelInput.endsWith('>')) {
                channelId = channelInput.slice(2, -1);
            }

            // Validate channel
            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Invalid channel! Please provide a valid channel ID or mention.',
                    ephemeral: true
                });
            }

            await client.config.updateGuildConfig(interaction.guild.id, { log_channel_id: channelId }, client.database);

            const embed = new EmbedBuilder()
                .setTitle('✅ Log Channel Set')
                .setDescription(`Log channel has been set to ${channel}`)
                .setColor('#00ff00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (customId === 'modal_warn_threshold') {
            const threshold = parseInt(interaction.fields.getTextInputValue('warn_threshold_input'));

            if (isNaN(threshold) || threshold < 1) {
                return interaction.reply({
                    content: 'Invalid threshold! Please provide a number greater than 0.',
                    ephemeral: true
                });
            }

            await client.config.updateGuildConfig(interaction.guild.id, { auto_warn_threshold: threshold }, client.database);

            const embed = new EmbedBuilder()
                .setTitle('✅ Auto-Warn Threshold Set')
                .setDescription(`Auto-warn threshold has been set to ${threshold} warnings`)
                .setColor('#00ff00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (customId === 'modal_ban_threshold') {
            const threshold = parseInt(interaction.fields.getTextInputValue('ban_threshold_input'));

            if (isNaN(threshold) || threshold < 1) {
                return interaction.reply({
                    content: 'Invalid threshold! Please provide a number greater than 0.',
                    ephemeral: true
                });
            }

            await client.config.updateGuildConfig(interaction.guild.id, { auto_ban_threshold: threshold }, client.database);

            const embed = new EmbedBuilder()
                .setTitle('✅ Auto-Ban Threshold Set')
                .setDescription(`Auto-ban threshold has been set to ${threshold} warnings`)
                .setColor('#00ff00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (customId === 'modal_music_channel') {
            const channelInput = interaction.fields.getTextInputValue('music_channel_input');
            let channelId = channelInput;

            // Extract channel ID if it's a mention
            if (channelInput.startsWith('<#') && channelInput.endsWith('>')) {
                channelId = channelInput.slice(2, -1);
            }

            // Validate channel
            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Invalid channel! Please provide a valid channel ID or mention.',
                    ephemeral: true
                });
            }

            await client.config.updateGuildConfig(interaction.guild.id, { music_channel_id: channelId }, client.database);

            const embed = new EmbedBuilder()
                .setTitle('✅ Music Channel Set')
                .setDescription(`Music channel has been set to ${channel}`)
                .setColor('#00ff00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (customId.startsWith('modal_embed_')) {
            await handleEmbedModal(interaction, client);
        }

    } catch (error) {
        console.error('Error handling modal submit:', error);
        await interaction.reply({
            content: 'An error occurred while processing your request!',
            ephemeral: true
        });
    }
}

async function handleEmbedModal(interaction, client) {
    const customId = interaction.customId;
    
    if (customId.includes('_title_')) {
        const templateName = customId.split('_title_')[1];
        const title = interaction.fields.getTextInputValue('embed_title_input');
        
        // Get or create template
        let template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        if (!template) {
            template = { title: '', description: '', color: '#0099ff', fields: [], footer: '', thumbnail: '', image: '', timestamp: false };
        }
        
        template.title = title;
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);
        
        await interaction.reply({
            content: `Title set to: ${title}`,
            ephemeral: true
        });

    } else if (customId.includes('_description_')) {
        const templateName = customId.split('_description_')[1];
        const description = interaction.fields.getTextInputValue('embed_description_input');
        
        let template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        if (!template) {
            template = { title: '', description: '', color: '#0099ff', fields: [], footer: '', thumbnail: '', image: '', timestamp: false };
        }
        
        template.description = description;
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);
        
        await interaction.reply({
            content: `Description set to: ${description}`,
            ephemeral: true
        });

    } else if (customId.includes('_color_')) {
        const templateName = customId.split('_color_')[1];
        const color = interaction.fields.getTextInputValue('embed_color_input');
        
        let template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        if (!template) {
            template = { title: '', description: '', color: '#0099ff', fields: [], footer: '', thumbnail: '', image: '', timestamp: false };
        }
        
        template.color = color;
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);
        
        await interaction.reply({
            content: `Color set to: ${color}`,
            ephemeral: true
        });

    } else if (customId.includes('_footer_')) {
        const templateName = customId.split('_footer_')[1];
        const footer = interaction.fields.getTextInputValue('embed_footer_input');
        
        let template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        if (!template) {
            template = { title: '', description: '', color: '#0099ff', fields: [], footer: '', thumbnail: '', image: '', timestamp: false };
        }
        
        template.footer = footer;
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);
        
        await interaction.reply({
            content: `Footer set to: ${footer}`,
            ephemeral: true
        });

    } else if (customId.includes('_thumbnail_')) {
        const templateName = customId.split('_thumbnail_')[1];
        const thumbnail = interaction.fields.getTextInputValue('embed_thumbnail_input');
        
        let template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        if (!template) {
            template = { title: '', description: '', color: '#0099ff', fields: [], footer: '', thumbnail: '', image: '', timestamp: false };
        }
        
        template.thumbnail = thumbnail;
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);
        
        await interaction.reply({
            content: `Thumbnail set to: ${thumbnail}`,
            ephemeral: true
        });

    } else if (customId.includes('_image_')) {
        const templateName = customId.split('_image_')[1];
        const image = interaction.fields.getTextInputValue('embed_image_input');
        
        let template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        if (!template) {
            template = { title: '', description: '', color: '#0099ff', fields: [], footer: '', thumbnail: '', image: '', timestamp: false };
        }
        
        template.image = image;
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);
        
        await interaction.reply({
            content: `Image set to: ${image}`,
            ephemeral: true
        });
    }
}
