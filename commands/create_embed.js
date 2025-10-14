const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_embed')
        .setDescription('Buat dan kirim embed kustom dengan form Discord')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        try {
            // Buat select menu untuk channel
            const channelSelect = new StringSelectMenuBuilder()
                .setCustomId('embed_channel_select')
                .setPlaceholder('Pilih channel tujuan')
                .setMinValues(1)
                .setMaxValues(1);

            // Ambil semua channel teks dari guild
            const textChannels = interaction.guild.channels.cache
                .filter(channel => channel.isTextBased())
                .map(channel => ({
                    label: `#${channel.name}`,
                    description: `ID: ${channel.id}`,
                    value: channel.id
                }))
                .slice(0, 25); // Discord limit 25 options

            // Tambahkan opsi channel ke select menu
            textChannels.forEach(channel => {
                channelSelect.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(channel.label)
                        .setDescription(channel.description)
                        .setValue(channel.value)
                );
            });

            // Buat embed untuk channel selection
            const channelEmbed = new EmbedBuilder()
                .setTitle('🎨 Buat Embed Kustom')
                .setDescription('Pilih channel tujuan untuk embed Anda:')
                .setColor(config.brand.color)
                .setAuthor({
                    name: config.brand.name,
                    iconURL: config.brand.iconURL
                })
                .setFooter({
                    text: 'Pilih channel untuk melanjutkan',
                    iconURL: config.brand.iconURL
                });

            const row = new ActionRowBuilder().addComponents(channelSelect);

            await interaction.reply({
                embeds: [channelEmbed],
                components: [row],
                ephemeral: true
            });
            
        } catch (error) {
            console.error('Error in create_embed command:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat membuka form embed!',
                ephemeral: true
            });
        }
    }
};
