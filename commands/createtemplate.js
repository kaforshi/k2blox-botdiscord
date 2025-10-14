const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createtemplate')
        .setDescription('Buat template pesan baru')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nama template')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Konten pesan')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('URL gambar (opsional)')
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
            // Cek apakah template sudah ada
            const existingTemplate = await database.getTemplate(interaction.guild.id, name);
            if (existingTemplate) {
                return await interaction.reply({
                    content: `❌ Template dengan nama "${name}" sudah ada!`,
                    ephemeral: true
                });
            }

            // Buat template baru
            await database.createTemplate(interaction.guild.id, name, content, imageUrl, interaction.user.id);

            const embed = new (require('discord.js').EmbedBuilder)()
                .setTitle('✅ Template Berhasil Dibuat!')
                .setDescription(`**Nama:** ${name}\n**Konten:** ${content}\n**Gambar:** ${imageUrl || 'Tidak ada'}`)
                .setColor('#00FF00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error creating template:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat membuat template!',
                ephemeral: true
            });
        }
    }
};
