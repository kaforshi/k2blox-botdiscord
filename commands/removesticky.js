const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removesticky')
        .setDescription('Hapus sticky message dari channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel tempat sticky message akan dihapus')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        const targetChannel = interaction.options.getChannel('channel');

        try {
            // Cek apakah sticky message ada
            const stickyData = await database.getStickyMessage(targetChannel.id);
            if (!stickyData) {
                return await interaction.reply({
                    content: `❌ Tidak ada sticky message di ${targetChannel}!`,
                    ephemeral: true
                });
            }

            // Hapus sticky message dari database
            await database.removeStickyMessage(targetChannel.id);

            // Coba hapus pesan sticky yang ada
            try {
                const stickyMessage = await targetChannel.messages.fetch(stickyData.messageId);
                await stickyMessage.delete();
            } catch (error) {
                // Ignore if message not found
            }

            const embed = new (require('discord.js').EmbedBuilder)()
                .setTitle('✅ Sticky Message Berhasil Dihapus!')
                .setDescription(`Sticky message telah dihapus dari ${targetChannel}`)
                .setColor('#FF0000')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error removing sticky message:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menghapus sticky message!',
                ephemeral: true
            });
        }
    }
};
