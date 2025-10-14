const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edittemplate')
        .setDescription('Edit template pesan yang sudah ada')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nama template yang akan diedit')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Konten pesan baru')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('URL gambar baru (opsional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        const name = interaction.options.getString('name');
        const content = interaction.options.getString('content');
        const imageUrl = interaction.options.getString('image_url');

        try {
            // Cek apakah template ada
            const existingTemplate = await database.getTemplate(interaction.guild.id, name);
            if (!existingTemplate) {
                return await interaction.reply({
                    content: `❌ Template dengan nama "${name}" tidak ditemukan!`,
                    ephemeral: true
                });
            }

            // Update template
            const success = await database.updateTemplate(interaction.guild.id, name, content, imageUrl);
            
            if (success) {
                const embed = new (require('discord.js').EmbedBuilder)()
                    .setTitle('✅ Template Berhasil Diupdate!')
                    .setDescription(`**Nama:** ${name}\n**Konten:** ${content || 'Tidak diubah'}\n**Gambar:** ${imageUrl || 'Tidak diubah'}`)
                    .setColor('#00FF00')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({
                    content: '❌ Gagal mengupdate template!',
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error editing template:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengedit template!',
                ephemeral: true
            });
        }
    }
};
