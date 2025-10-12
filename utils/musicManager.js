const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const SpotifyWebApi = require('spotify-web-api-node');
const youtubeSearch = require('youtube-search-without-api-key');

class MusicManager {
    constructor(client) {
        this.client = client;
        this.queues = new Map();
        this.players = new Map();
        this.connections = new Map();
        
        // Initialize Spotify API
        this.spotify = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        });
        
        this.initializeSpotify();
    }

    async initializeSpotify() {
        try {
            const data = await this.spotify.clientCredentialsGrant();
            this.spotify.setAccessToken(data.body['access_token']);
            console.log('✅ Spotify API initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Spotify API:', error);
        }
    }

    async joinChannel(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return { success: false, message: 'You need to be in a voice channel to use music commands!' };
        }

        const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return { success: false, message: 'I need the Connect and Speak permissions in your voice channel!' };
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            this.connections.set(interaction.guild.id, connection);

            // Create audio player if it doesn't exist
            if (!this.players.has(interaction.guild.id)) {
                const player = createAudioPlayer();
                this.players.set(interaction.guild.id, player);
                connection.subscribe(player);

                // Handle player events
                player.on(AudioPlayerStatus.Idle, () => {
                    this.playNext(interaction.guild.id);
                });

                player.on('error', error => {
                    console.error('Audio player error:', error);
                });
            }

            return { success: true, message: `Joined ${voiceChannel.name}!` };
        } catch (error) {
            console.error('Error joining voice channel:', error);
            return { success: false, message: 'Failed to join voice channel!' };
        }
    }

    async leaveChannel(guildId) {
        const connection = this.connections.get(guildId);
        if (connection) {
            connection.destroy();
            this.connections.delete(guildId);
        }
        
        this.players.delete(guildId);
        this.queues.delete(guildId);
        
        return { success: true, message: 'Left the voice channel!' };
    }

    async addToQueue(guildId, userId, query, database) {
        try {
            let songInfo;
            
            // Check if it's a Spotify URL
            if (query.includes('spotify.com')) {
                songInfo = await this.getSpotifyTrack(query);
            } else if (query.includes('youtube.com') || query.includes('youtu.be')) {
                songInfo = await this.getYouTubeTrack(query);
            } else {
                // Search for the song
                songInfo = await this.searchSong(query);
            }

            if (!songInfo) {
                return { success: false, message: 'Could not find the requested song!' };
            }

            // Add to database queue
            await database.addToQueue(guildId, userId, songInfo.title, songInfo.url, songInfo.duration, songInfo.thumbnail);

            // Add to memory queue
            if (!this.queues.has(guildId)) {
                this.queues.set(guildId, []);
            }
            this.queues.get(guildId).push(songInfo);

            return { success: true, message: `Added **${songInfo.title}** to the queue!`, song: songInfo };
        } catch (error) {
            console.error('Error adding to queue:', error);
            return { success: false, message: 'Failed to add song to queue!' };
        }
    }

    async getSpotifyTrack(url) {
        try {
            const trackId = this.extractSpotifyId(url);
            const track = await this.spotify.getTrack(trackId);
            
            // Search for the track on YouTube
            const searchQuery = `${track.body.artists[0].name} ${track.body.name}`;
            const youtubeResults = await youtubeSearch.search(searchQuery);
            
            if (youtubeResults.length === 0) {
                return null;
            }

            const youtubeVideo = youtubeResults[0];
            return {
                title: track.body.name,
                url: youtubeVideo.url,
                duration: this.formatDuration(track.body.duration_ms),
                thumbnail: track.body.album.images[0]?.url || youtubeVideo.thumbnail,
                artist: track.body.artists[0].name,
                source: 'spotify'
            };
        } catch (error) {
            console.error('Error getting Spotify track:', error);
            return null;
        }
    }

    async getYouTubeTrack(url) {
        try {
            const info = await ytdl.getInfo(url);
            return {
                title: info.videoDetails.title,
                url: url,
                duration: this.formatDuration(info.videoDetails.lengthSeconds * 1000),
                thumbnail: info.videoDetails.thumbnails[0]?.url,
                source: 'youtube'
            };
        } catch (error) {
            console.error('Error getting YouTube track:', error);
            return null;
        }
    }

    async searchSong(query) {
        try {
            const results = await youtubeSearch.search(query);
            if (results.length === 0) {
                return null;
            }

            const video = results[0];
            return {
                title: video.title,
                url: video.url,
                duration: video.duration || 'Unknown',
                thumbnail: video.thumbnail,
                source: 'youtube'
            };
        } catch (error) {
            console.error('Error searching for song:', error);
            return null;
        }
    }

    async playNext(guildId) {
        const queue = this.queues.get(guildId);
        const player = this.players.get(guildId);

        if (!queue || queue.length === 0 || !player) {
            return;
        }

        const song = queue.shift();
        
        try {
            const stream = ytdl(song.url, {
                filter: 'audioonly',
                highWaterMark: 1 << 25
            });

            const resource = createAudioResource(stream);
            player.play(resource);

            // Update database queue
            const database = this.client.database;
            const dbQueue = await database.getQueue(guildId);
            if (dbQueue.length > 0) {
                await database.run('DELETE FROM music_queue WHERE guild_id = ? AND position = 0', [guildId]);
                // Update positions
                for (let i = 0; i < dbQueue.length - 1; i++) {
                    await database.run('UPDATE music_queue SET position = ? WHERE id = ?', [i, dbQueue[i + 1].id]);
                }
            }

        } catch (error) {
            console.error('Error playing song:', error);
            this.playNext(guildId);
        }
    }

    async play(guildId) {
        const player = this.players.get(guildId);
        if (!player) {
            return { success: false, message: 'No audio player found!' };
        }

        if (player.state.status === AudioPlayerStatus.Playing) {
            return { success: false, message: 'Already playing music!' };
        }

        this.playNext(guildId);
        return { success: true, message: 'Started playing music!' };
    }

    async pause(guildId) {
        const player = this.players.get(guildId);
        if (!player) {
            return { success: false, message: 'No audio player found!' };
        }

        if (player.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            return { success: true, message: 'Paused the music!' };
        } else if (player.state.status === AudioPlayerStatus.Paused) {
            player.unpause();
            return { success: true, message: 'Resumed the music!' };
        }

        return { success: false, message: 'No music is currently playing!' };
    }

    async skip(guildId) {
        const player = this.players.get(guildId);
        if (!player) {
            return { success: false, message: 'No audio player found!' };
        }

        player.stop();
        return { success: true, message: 'Skipped the current song!' };
    }

    async stop(guildId) {
        const player = this.players.get(guildId);
        if (!player) {
            return { success: false, message: 'No audio player found!' };
        }

        player.stop();
        this.queues.set(guildId, []);
        
        const database = this.client.database;
        await database.clearQueue(guildId);
        
        return { success: true, message: 'Stopped the music and cleared the queue!' };
    }

    getQueue(guildId) {
        return this.queues.get(guildId) || [];
    }

    getCurrentSong(guildId) {
        const player = this.players.get(guildId);
        if (!player || player.state.status !== AudioPlayerStatus.Playing) {
            return null;
        }
        
        const queue = this.queues.get(guildId);
        return queue && queue.length > 0 ? queue[0] : null;
    }

    extractSpotifyId(url) {
        const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

module.exports = MusicManager;
