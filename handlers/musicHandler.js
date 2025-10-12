const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction, client) => {
    const customId = interaction.customId;

    if (customId === 'music_play') {
        const result = await client.music.play(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('▶️ Music Player')
            .setDescription(result.message)
            .setColor(result.success ? '#00ff00' : '#ff0000')
            .setTimestamp();

        await interaction.update({ embeds: [embed] });

    } else if (customId === 'music_pause') {
        const result = await client.music.pause(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('⏸️ Music Player')
            .setDescription(result.message)
            .setColor(result.success ? '#00ff00' : '#ff0000')
            .setTimestamp();

        await interaction.update({ embeds: [embed] });

    } else if (customId === 'music_skip') {
        const result = await client.music.skip(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('⏭️ Music Player')
            .setDescription(result.message)
            .setColor(result.success ? '#00ff00' : '#ff0000')
            .setTimestamp();

        await interaction.update({ embeds: [embed] });

    } else if (customId === 'music_stop') {
        const result = await client.music.stop(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('⏹️ Music Player')
            .setDescription(result.message)
            .setColor(result.success ? '#00ff00' : '#ff0000')
            .setTimestamp();

        await interaction.update({ embeds: [embed] });

    } else if (customId === 'music_queue') {
        const queue = client.music.getQueue(interaction.guild.id);
        const currentSong = client.music.getCurrentSong(interaction.guild.id);

        if (queue.length === 0 && !currentSong) {
            const embed = new EmbedBuilder()
                .setTitle('📋 Music Queue')
                .setDescription('The queue is empty!')
                .setColor('#ff0000')
                .setTimestamp();

            await interaction.update({ embeds: [embed] });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('📋 Music Queue')
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
            const maxItems = 10;
            
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

        await interaction.update({ embeds: [embed] });

    } else if (customId === 'music_clear') {
        const result = await client.music.stop(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('🗑️ Queue Cleared')
            .setDescription('The music queue has been cleared!')
            .setColor('#00ff00')
            .setTimestamp();

        await interaction.update({ embeds: [embed] });
    }
};
