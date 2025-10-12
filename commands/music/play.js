const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from YouTube or Spotify')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name, YouTube URL, or Spotify URL')
                .setRequired(true)),

    async execute(interaction, client) {
        const query = interaction.options.getString('query');

        // Check if user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to use music commands!',
                ephemeral: true
            });
        }

        // Check guild config for music channel
        const config = await client.database.getGuildConfig(interaction.guild.id);
        if (config.music_channel_id && interaction.channel.id !== config.music_channel_id) {
            return interaction.reply({
                content: `Music commands can only be used in <#${config.music_channel_id}>!`,
                ephemeral: true
            });
        }

        // Check if Spotify is enabled and query is Spotify URL
        if (query.includes('spotify.com') && !config.spotify_enabled) {
            return interaction.reply({
                content: 'Spotify is disabled for this server!',
                ephemeral: true
            });
        }

        // Check if YouTube is enabled and query is YouTube URL
        if ((query.includes('youtube.com') || query.includes('youtu.be')) && !config.youtube_enabled) {
            return interaction.reply({
                content: 'YouTube is disabled for this server!',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        // Join voice channel if not already connected
        const connection = client.music.connections.get(interaction.guild.id);
        if (!connection) {
            const joinResult = await client.music.joinChannel(interaction);
            if (!joinResult.success) {
                return interaction.editReply(joinResult.message);
            }
        }

        // Add song to queue
        const result = await client.music.addToQueue(interaction.guild.id, interaction.user.id, query, client.database);

        if (!result.success) {
            return interaction.editReply(result.message);
        }

        const embed = new EmbedBuilder()
            .setTitle('🎵 Added to Queue')
            .setDescription(result.message)
            .setColor('#00ff00')
            .addFields(
                { name: 'Title', value: result.song.title, inline: true },
                { name: 'Duration', value: result.song.duration, inline: true },
                { name: 'Source', value: result.song.source, inline: true }
            )
            .setThumbnail(result.song.thumbnail)
            .setTimestamp();

        if (result.song.artist) {
            embed.addFields({ name: 'Artist', value: result.song.artist, inline: true });
        }

        // Create music control buttons
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
                    .setCustomId('music_queue')
                    .setLabel('Queue')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

        // Auto-play if nothing is currently playing
        const player = client.music.players.get(interaction.guild.id);
        if (player && player.state.status !== 'playing') {
            await client.music.play(interaction.guild.id);
        }
    },
};
