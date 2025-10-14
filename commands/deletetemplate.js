const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletetemplate')
        .setDescription('Hapus template pesan')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nama template yang akan dihapus')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        const name = interaction.options.getString('name');

        try {
            // Cek apakah template ada
            const existingTemplate = await database.getTemplate(interaction.guild.id, name);
            if (!existingTemplate) {
                return await interaction.reply({
                    content: `❌ Template dengan nama "${name}" tidak ditemukan!`,
                    ephemeral: true
                });
            }

            // Hapus template
            const success = await database.deleteTemplate(interaction.guild.id, name);
            
            if (success) {
                const embed = new (require('discord.js').EmbedBuilder)()
                    .setTitle('✅ Template Berhasil Dihapus!')
                    .setDescription(`Template "${name}" telah dihapus.`)
                    .setColor('#FF0000')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({
                    content: '❌ Gagal menghapus template!',
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error deleting template:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat menghapus template!',
                ephemeral: true
            });
        }
    }
};
