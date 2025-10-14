const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('liststicky')
        .setDescription('Lihat daftar sticky message aktif')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        try {
            const stickyMessages = await database.getAllStickyMessages();
            
            if (stickyMessages.length === 0) {
                return await interaction.reply({
                    content: '📌 Tidak ada sticky message yang aktif.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('📌 Daftar Sticky Message Aktif')
                .setDescription('Berikut adalah daftar sticky message yang aktif:')
                .setColor('#FFA500')
                .setTimestamp();

            for (const sticky of stickyMessages) {
                const channel = interaction.guild.channels.cache.get(sticky.channelId);
                const channelName = channel ? channel.name : 'Channel tidak ditemukan';
                
                const content = sticky.content.length > 100 
                    ? sticky.content.substring(0, 100) + '...' 
                    : sticky.content;
                
                embed.addFields({
                    name: `#${channelName}`,
                    value: `**Pesan:** ${content}\n**Terakhir dikirim:** <t:${Math.floor(sticky.lastSent / 1000)}:R>`,
                    inline: false
                });
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error listing sticky messages:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengambil daftar sticky message!',
                ephemeral: true
            });
        }
    }
};
