const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction, client) => {
    const customId = interaction.customId;

    if (customId.startsWith('embed_title_')) {
        const templateName = customId.replace('embed_title_', '');
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_embed_title_${templateName}`)
            .setTitle('Set Embed Title');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title_input')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the embed title')
            .setRequired(false);

        const actionRow = new ActionRowBuilder().addComponents(titleInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId.startsWith('embed_description_')) {
        const templateName = customId.replace('embed_description_', '');
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_embed_description_${templateName}`)
            .setTitle('Set Embed Description');

        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description_input')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter the embed description')
            .setRequired(false);

        const actionRow = new ActionRowBuilder().addComponents(descriptionInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId.startsWith('embed_color_')) {
        const templateName = customId.replace('embed_color_', '');
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_embed_color_${templateName}`)
            .setTitle('Set Embed Color');

        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color_input')
            .setLabel('Color (hex code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('#0099ff')
            .setValue('#0099ff')
            .setRequired(false);

        const actionRow = new ActionRowBuilder().addComponents(colorInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId.startsWith('embed_footer_')) {
        const templateName = customId.replace('embed_footer_', '');
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_embed_footer_${templateName}`)
            .setTitle('Set Embed Footer');

        const footerInput = new TextInputBuilder()
            .setCustomId('embed_footer_input')
            .setLabel('Footer Text')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the footer text')
            .setRequired(false);

        const actionRow = new ActionRowBuilder().addComponents(footerInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId.startsWith('embed_thumbnail_')) {
        const templateName = customId.replace('embed_thumbnail_', '');
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_embed_thumbnail_${templateName}`)
            .setTitle('Set Embed Thumbnail');

        const thumbnailInput = new TextInputBuilder()
            .setCustomId('embed_thumbnail_input')
            .setLabel('Thumbnail URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/image.png')
            .setRequired(false);

        const actionRow = new ActionRowBuilder().addComponents(thumbnailInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId.startsWith('embed_image_')) {
        const templateName = customId.replace('embed_image_', '');
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_embed_image_${templateName}`)
            .setTitle('Set Embed Image');

        const imageInput = new TextInputBuilder()
            .setCustomId('embed_image_input')
            .setLabel('Image URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/image.png')
            .setRequired(false);

        const actionRow = new ActionRowBuilder().addComponents(imageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

    } else if (customId.startsWith('embed_preview_')) {
        const templateName = customId.replace('embed_preview_', '');
        
        // Get current template data from database
        const template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        
        if (!template) {
            return interaction.reply({
                content: 'Template not found!',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(template.title || 'Preview')
            .setDescription(template.description || 'No description set')
            .setColor(template.color || '#0099ff');

        if (template.fields && template.fields.length > 0) {
            template.fields.forEach(field => {
                embed.addFields(field);
            });
        }

        if (template.footer) {
            embed.setFooter({ text: template.footer });
        }

        if (template.thumbnail) {
            embed.setThumbnail(template.thumbnail);
        }

        if (template.image) {
            embed.setImage(template.image);
        }

        if (template.timestamp) {
            embed.setTimestamp();
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (customId.startsWith('embed_save_')) {
        const templateName = customId.replace('embed_save_', '');
        
        // Get current template data from database
        const template = await client.database.getEmbedTemplate(interaction.guild.id, templateName);
        
        if (!template) {
            return interaction.reply({
                content: 'Template not found!',
                ephemeral: true
            });
        }

        // Save the template
        await client.database.saveEmbedTemplate(interaction.guild.id, templateName, template);

        const embed = new EmbedBuilder()
            .setTitle('✅ Template Saved')
            .setDescription(`Embed template "${templateName}" has been saved successfully!`)
            .setColor('#00ff00')
            .setTimestamp();

        await interaction.update({ embeds: [embed], components: [] });

    } else if (customId.startsWith('embed_cancel_')) {
        const templateName = customId.replace('embed_cancel_', '');
        
        const embed = new EmbedBuilder()
            .setTitle('❌ Template Creation Cancelled')
            .setDescription(`Embed template "${templateName}" creation has been cancelled.`)
            .setColor('#ff0000')
            .setTimestamp();

        await interaction.update({ embeds: [embed], components: [] });
    }
};
