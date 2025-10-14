const { Events, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: '❌ Terjadi kesalahan saat menjalankan perintah ini!',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }

        // Handle button interactions
        else if (interaction.isButton()) {
            if (interaction.customId === 'create_review') {
                // Modal untuk review
                const reviewModal = new ModalBuilder()
                    .setCustomId('review_modal')
                    .setTitle('Buat Ulasan');

                // Rating input
                const ratingInput = new TextInputBuilder()
                    .setCustomId('rating')
                    .setLabel('Rating (1-5)')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Masukkan angka antara 1 hingga 5')
                    .setRequired(true)
                    .setMaxLength(1);

                // Review message input
                const reviewInput = new TextInputBuilder()
                    .setCustomId('review_message')
                    .setLabel('Ulasan Anda')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder('Tulis ulasan detail Anda di sini...')
                    .setRequired(true)
                    .setMaxLength(1000);

                reviewModal.addComponents(
                    new ActionRowBuilder().addComponents(ratingInput),
                    new ActionRowBuilder().addComponents(reviewInput)
                );

                await interaction.showModal(reviewModal);
            }

        }

        // Handle select menu interactions
        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'embed_channel_select') {
                await this.handleChannelSelection(interaction);
            }
        }

        // Handle modal submissions
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'review_modal') {
                const rating = interaction.fields.getTextInputValue('rating');
                const reviewMessage = interaction.fields.getTextInputValue('review_message');

                // Validasi rating
                const ratingNum = parseInt(rating);
                if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                    return await interaction.reply({
                        content: '❌ Rating harus berupa angka antara 1-5!',
                        ephemeral: true
                    });
                }

                // Buat embed review
                const reviewEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .addFields(
                        {
                            name: '⭐ Rating',
                            value: '⭐'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum),
                            inline: true
                        },
                        {
                            name: '📝 Ulasan',
                            value: reviewMessage,
                            inline: false
                        }
                    )
                    .setColor(0x00ff00)
                    .setTimestamp()
                    .setFooter({
                        text: config.brand.name,
                        iconURL: config.brand.iconURL
                    });

                await interaction.reply({
                    content: '✅ Ulasan Anda berhasil dikirim!',
                    ephemeral: true
                });

                // Kirim embed review ke channel yang sama
                await interaction.channel.send({
                    embeds: [reviewEmbed]
                });
            }

            else if (interaction.customId.startsWith('create_embed_modal_')) {
                await this.handleEmbedModal(interaction);
            }

        }
    },

    async handleChannelSelection(interaction) {
        const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
        const config = require('../config');

        try {
            const selectedChannelId = interaction.values[0];
            const selectedChannel = interaction.guild.channels.cache.get(selectedChannelId);

            if (!selectedChannel) {
                return await interaction.reply({
                    content: '❌ Channel tidak ditemukan! Silakan coba lagi.',
                    ephemeral: true
                });
            }

            // Buat modal dengan channel ID di customId
            const modal = new ModalBuilder()
                .setCustomId(`create_embed_modal_${selectedChannelId}`)
                .setTitle(`Buat Embed untuk #${selectedChannel.name}`);

            // Judul input (opsional)
            const titleInput = new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Judul Embed')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Masukkan judul embed (opsional)')
                .setRequired(false)
                .setMaxLength(256);

            // Deskripsi input (opsional)
            const descriptionInput = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Deskripsi Embed')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Masukkan deskripsi embed (opsional)')
                .setRequired(false)
                .setMaxLength(4000);

            // Warna input (opsional)
            const colorInput = new TextInputBuilder()
                .setCustomId('color')
                .setLabel('Warna Hex')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('#3498db')
                .setRequired(false)
                .setMaxLength(7);

            // Thumbnail URL input (opsional)
            const thumbnailInput = new TextInputBuilder()
                .setCustomId('thumbnail')
                .setLabel('Thumbnail URL')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('https://example.com/thumbnail.jpg')
                .setRequired(false)
                .setMaxLength(2000);

            // Image URL input (opsional)
            const imageInput = new TextInputBuilder()
                .setCustomId('image')
                .setLabel('Image URL')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('https://example.com/image.jpg')
                .setRequired(false)
                .setMaxLength(2000);

            // Tambahkan semua input ke modal (maksimal 5 ActionRow)
            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descriptionInput),
                new ActionRowBuilder().addComponents(colorInput),
                new ActionRowBuilder().addComponents(thumbnailInput),
                new ActionRowBuilder().addComponents(imageInput)
            );

            await interaction.showModal(modal);

        } catch (error) {
            console.error('Error in channel selection:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat memproses pilihan channel!',
                ephemeral: true
            });
        }
    },

    async handleEmbedModal(interaction) {
        const { EmbedBuilder } = require('discord.js');
        const config = require('../config');

        try {
            const title = interaction.fields.getTextInputValue('title');
            const description = interaction.fields.getTextInputValue('description');
            const colorHex = interaction.fields.getTextInputValue('color');
            const thumbnail = interaction.fields.getTextInputValue('thumbnail');
            const image = interaction.fields.getTextInputValue('image');

            // Validasi input minimal
            if (!title && !description) {
                return await interaction.reply({
                    content: '❌ Minimal harus ada judul atau deskripsi!',
                    ephemeral: true
                });
            }

            // Ambil channel ID dari customId modal
            const channelId = interaction.customId.replace('create_embed_modal_', '');
            if (!channelId) {
                return await interaction.reply({
                    content: '❌ Channel tidak ditemukan! Silakan coba lagi.',
                    ephemeral: true
                });
            }

            // Validasi channel
            let channel;
            try {
                channel = await interaction.client.channels.fetch(channelId);
            } catch (fetchError) {
                return await interaction.reply({
                    content: '❌ Channel tidak ditemukan! Pastikan channel masih ada.',
                    ephemeral: true
                });
            }

            if (!channel || !channel.isTextBased()) {
                return await interaction.reply({
                    content: '❌ Channel tidak ditemukan atau bukan channel teks!',
                    ephemeral: true
                });
            }

            // Cek permission bot
            if (!channel.permissionsFor(interaction.client.user).has('SendMessages')) {
                return await interaction.reply({
                    content: '❌ Bot tidak memiliki permission untuk mengirim pesan di channel tersebut!',
                    ephemeral: true
                });
            }

            // Buat embed
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: config.brand.name,
                    iconURL: config.brand.iconURL
                })
                .setTimestamp();

            // Set warna
            if (colorHex && colorHex.trim() !== '') {
                const color = colorHex.replace('#', '').trim();
                if (/^[0-9A-F]{6}$/i.test(color)) {
                    embed.setColor(`#${color}`);
                } else {
                    embed.setColor(config.brand.color);
                }
            } else {
                embed.setColor(config.brand.color);
            }

            // Set konten
            if (title && title.trim() !== '') embed.setTitle(title);
            if (description && description.trim() !== '') embed.setDescription(description);

            // Set thumbnail
            if (thumbnail && thumbnail.trim() !== '') {
                try {
                    // Validasi URL
                    new URL(thumbnail);
                    embed.setThumbnail(thumbnail);
                } catch (error) {
                    console.log('Invalid thumbnail URL:', thumbnail);
                }
            }

            // Set image
            if (image && image.trim() !== '') {
                try {
                    // Validasi URL
                    new URL(image);
                    embed.setImage(image);
                } catch (error) {
                    console.log('Invalid image URL:', image);
                }
            }

            // Set footer
            embed.setFooter({
                text: config.brand.name,
                iconURL: config.brand.iconURL
            });

            // Kirim embed
            await channel.send({ embeds: [embed] });

            await interaction.reply({
                content: `✅ Embed berhasil dikirim ke ${channel}!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error in embed modal:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat membuat embed!',
                ephemeral: true
            });
        }
    },
};
