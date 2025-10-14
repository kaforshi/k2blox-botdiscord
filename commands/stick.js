const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stick')
        .setDescription('Kelola pesan melekat (sticky message)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Atur pesan melekat di channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel untuk pesan melekat')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Pesan yang akan dilekatkan')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Hapus pesan melekat dari channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel untuk menghapus pesan melekat')
                        .setRequired(true)
                )
        ),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');

        // Validasi channel
        if (!channel.isTextBased()) {
            return await interaction.reply({
                content: '❌ Channel yang dipilih bukan channel teks!',
                ephemeral: true
            });
        }

        try {
            if (subcommand === 'set') {
                const message = interaction.options.getString('message');
                
                // Simpan data sticky message (dalam implementasi nyata, gunakan database)
                if (!global.stickyMessages) {
                    global.stickyMessages = new Map();
                }
                
                global.stickyMessages.set(channel.id, {
                    message: message,
                    lastMessageId: null
                });

                // Kirim pesan sticky pertama
                const stickyMsg = await channel.send(message);
                global.stickyMessages.get(channel.id).lastMessageId = stickyMsg.id;

                await interaction.reply({
                    content: `✅ Pesan melekat berhasil diatur di channel ${channel}!\nPesan: ${message}`,
                    ephemeral: true
                });

            } else if (subcommand === 'remove') {
                if (!global.stickyMessages || !global.stickyMessages.has(channel.id)) {
                    return await interaction.reply({
                        content: `❌ Tidak ada pesan melekat di channel ${channel}!`,
                        ephemeral: true
                    });
                }

                // Hapus pesan sticky terakhir jika ada
                const stickyData = global.stickyMessages.get(channel.id);
                if (stickyData.lastMessageId) {
                    try {
                        const lastMessage = await channel.messages.fetch(stickyData.lastMessageId);
                        await lastMessage.delete();
                    } catch (error) {
                        console.log('Pesan sticky terakhir tidak ditemukan atau sudah dihapus');
                    }
                }

                global.stickyMessages.delete(channel.id);

                await interaction.reply({
                    content: `✅ Pesan melekat berhasil dihapus dari channel ${channel}!`,
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error in stick command:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengelola pesan melekat!',
                ephemeral: true
            });
        }
    }
};
