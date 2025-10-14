const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_review')
        .setDescription('Setup sistem testimoni/review interaktif')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel tujuan untuk sistem review')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel');
            
            // Validasi channel
            if (!channel.isTextBased()) {
                return await interaction.reply({
                    content: '❌ Channel yang dipilih bukan channel teks!',
                    ephemeral: true
                });
            }

            // Embed untuk pesan review
            const reviewEmbed = new EmbedBuilder()
                .setTitle('🌟 Beri Kami Ulasan!')
                .setDescription('Kami sangat menghargai feedback dari Anda! Klik tombol di bawah untuk memberikan ulasan tentang pelayanan kami.')
                .setColor(config.brand.color)
                .setAuthor({
                    name: config.brand.name,
                    iconURL: config.brand.iconURL
                })
                .setFooter({
                    text: config.brand.name,
                    iconURL: config.brand.iconURL
                })
                .setTimestamp();

            // Tombol untuk membuat ulasan
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_review')
                        .setLabel('Buat Ulasan')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('⭐')
                );

            // Kirim pesan ke channel yang dipilih
            await channel.send({
                embeds: [reviewEmbed],
                components: [row]
            });

            await interaction.reply({
                content: `✅ Sistem review berhasil diatur di channel ${channel}!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in setup_review command:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengatur sistem review!',
                ephemeral: true
            });
        }
    }
};
