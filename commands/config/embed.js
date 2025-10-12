const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create or manage embed templates')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new embed template')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Name for the embed template')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all embed templates'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('send')
                .setDescription('Send an embed template')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Name of the embed template')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to send the embed to')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const name = interaction.options.getString('name');
            
            // Check if template already exists
            const existingTemplate = await client.database.getEmbedTemplate(interaction.guild.id, name);
            if (existingTemplate) {
                return interaction.reply({
                    content: `An embed template with the name "${name}" already exists!`,
                    ephemeral: true
                });
            }

            // Create embed builder form
            const embed = new EmbedBuilder()
                .setTitle('📋 Embed Template Creator')
                .setDescription(`Creating embed template: **${name}**\n\nUse the buttons below to configure your embed.`)
                .setColor('#0099ff')
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`embed_title_${name}`)
                        .setLabel('Set Title')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`embed_description_${name}`)
                        .setLabel('Set Description')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`embed_color_${name}`)
                        .setLabel('Set Color')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`embed_fields_${name}`)
                        .setLabel('Add Fields')
                        .setStyle(ButtonStyle.Secondary)
                );

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`embed_footer_${name}`)
                        .setLabel('Set Footer')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`embed_thumbnail_${name}`)
                        .setLabel('Set Thumbnail')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`embed_image_${name}`)
                        .setLabel('Set Image')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`embed_preview_${name}`)
                        .setLabel('Preview')
                        .setStyle(ButtonStyle.Success)
                );

            const row3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`embed_save_${name}`)
                        .setLabel('Save Template')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`embed_cancel_${name}`)
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({ embeds: [embed], components: [row, row2, row3] });

        } else if (subcommand === 'list') {
            const templates = await client.database.getEmbedTemplates(interaction.guild.id);
            
            if (templates.length === 0) {
                return interaction.reply({
                    content: 'No embed templates found! Use `/embed create` to create one.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('📋 Embed Templates')
                .setDescription('Available embed templates:')
                .setColor('#0099ff')
                .setTimestamp();

            let templateList = '';
            templates.forEach((template, index) => {
                templateList += `${index + 1}. **${template.name}**\n   ${template.title || 'No title'}\n   ${template.description || 'No description'}\n\n`;
            });

            embed.addFields({
                name: 'Templates',
                value: templateList,
                inline: false
            });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'send') {
            const name = interaction.options.getString('name');
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const template = await client.database.getEmbedTemplate(interaction.guild.id, name);
            if (!template) {
                return interaction.reply({
                    content: `No embed template found with the name "${name}"!`,
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(template.title)
                .setDescription(template.description)
                .setColor(template.color);

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

            await channel.send({ embeds: [embed] });
            await interaction.reply({
                content: `Embed template "${name}" sent to ${channel}!`,
                ephemeral: true
            });
        }
    },
};
