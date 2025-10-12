const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current music queue'),

    async execute(interaction, client) {
        const queue = client.music.getQueue(interaction.guild.id);
        const currentSong = client.music.getCurrentSong(interaction.guild.id);

        if (queue.length === 0 && !currentSong) {
            return interaction.reply({
                content: 'The queue is empty!',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🎵 Music Queue')
            .setColor('#0099ff')
            .setTimestamp();

        if (currentSong) {
            embed.addFields({
                name: '🎶 Now Playing',
                value: `**${currentSong.title}**\nDuration: ${currentSong.duration}\nSource: ${currentSong.source}`,
                inline: false
            });
        }

        if (queue.length > 0) {
            let queueText = '';
            const maxItems = 10; // Show max 10 items in queue
            
            for (let i = 0; i < Math.min(queue.length, maxItems); i++) {
                const song = queue[i];
                queueText += `${i + 1}. **${song.title}** (${song.duration})\n`;
            }

            if (queue.length > maxItems) {
                queueText += `\n... and ${queue.length - maxItems} more songs`;
            }

            embed.addFields({
                name: '📋 Up Next',
                value: queueText || 'No songs in queue',
                inline: false
            });

            embed.setFooter({ text: `Total songs in queue: ${queue.length}` });
        }

        // Create control buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('music_play')
                    .setLabel('Play')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('▶️'),
                new ButtonBuilder()
                    .setCustomId('music_pause')
                    .setLabel('Pause')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⏸️'),
                new ButtonBuilder()
                    .setCustomId('music_skip')
                    .setLabel('Skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭️'),
                new ButtonBuilder()
                    .setCustomId('music_stop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('⏹️'),
                new ButtonBuilder()
                    .setCustomId('music_clear')
                    .setLabel('Clear Queue')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🗑️')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
