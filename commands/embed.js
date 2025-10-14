const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');
const dataStore = require('../utils/dataStore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Buat dan kirim embed kustomisasi lengkap')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel tempat embed akan dikirim')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator untuk menggunakan perintah ini!',
                ephemeral: true
            });
        }

        const targetChannel = interaction.options.getChannel('channel');

        if (!targetChannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
            return await interaction.reply({
                content: '❌ Bot tidak memiliki permission untuk mengirim pesan ke channel tersebut!',
                ephemeral: true
            });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('embed_type_selector')
            .setPlaceholder('Pilih jenis embed yang ingin Anda buat')
            .addOptions([
                { label: '📝 Embed Sederhana', description: 'Judul, deskripsi, warna', value: 'simple' },
                { label: '🖼️ Embed dengan Gambar', description: 'Judul, deskripsi, gambar, thumbnail, warna', value: 'image' },
                { label: '📋 Embed dengan Fields', description: 'Judul, deskripsi, fields JSON, warna', value: 'fields' },
                { label: '🎨 Embed Lengkap', description: 'Semua opsi kustomisasi', value: 'complete' },
                { label: '📄 Embed dari Template', description: 'Gunakan template yang sudah ada', value: 'template' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        dataStore.setEmbedData(interaction.user.id, {
            channel: targetChannel,
            embed: new EmbedBuilder()
        });

        await interaction.reply({
            content: `📝 **Kustomisasi Embed**\n\nChannel target: ${targetChannel}\n\nPilih jenis embed yang ingin Anda buat:`,
            components: [row],
            ephemeral: true
        });
    }
};
