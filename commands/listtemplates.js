const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listtemplates')
        .setDescription('Lihat daftar template pesan')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        try {
            const templates = await database.getAllTemplates(interaction.guild.id);
            
            if (templates.length === 0) {
                return await interaction.reply({
                    content: '📝 Tidak ada template yang tersedia.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('📝 Daftar Template')
                .setDescription('Berikut adalah daftar template yang tersedia:')
                .setColor('#0099FF')
                .setTimestamp();

            templates.forEach((template, index) => {
                const content = template.content.length > 100 
                    ? template.content.substring(0, 100) + '...' 
                    : template.content;
                
                embed.addFields({
                    name: `${index + 1}. ${template.name}`,
                    value: `**Konten:** ${content}\n**Gambar:** ${template.imageUrl ? 'Ya' : 'Tidak'}\n**Dibuat:** <t:${Math.floor(template.createdAt / 1000)}:R>`,
                    inline: false
                });
            });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error listing templates:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengambil daftar template!',
                ephemeral: true
            });
        }
    }
};
