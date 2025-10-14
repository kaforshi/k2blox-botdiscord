const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');
const dataStore = require('../utils/dataStore');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('Berikan testimoni/review untuk server ini'),

    async execute(interaction) {
        const reviewChannel = interaction.guild.channels.cache.get(process.env.REVIEW_CHANNEL_ID);
        
        if (!reviewChannel) {
            return await interaction.reply({
                content: '❌ Channel review tidak dikonfigurasi! Silakan hubungi administrator.',
                ephemeral: true
            });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('review_rating_select')
            .setPlaceholder('Pilih rating Anda (1-5 bintang)')
            .addOptions([
                { label: '⭐ 1 Bintang - Sangat Buruk', value: '1' },
                { label: '⭐⭐ 2 Bintang - Buruk', value: '2' },
                { label: '⭐⭐⭐ 3 Bintang - Biasa', value: '3' },
                { label: '⭐⭐⭐⭐ 4 Bintang - Baik', value: '4' },
                { label: '⭐⭐⭐⭐⭐ 5 Bintang - Sangat Baik', value: '5' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        dataStore.setReviewData(interaction.user.id, {
            channel: reviewChannel
        });

        await interaction.reply({
            content: '⭐ **Berikan Testimoni**\n\nSilakan pilih rating untuk server ini:',
            components: [row],
            ephemeral: true
        });
    }
};
