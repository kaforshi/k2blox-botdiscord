const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
require('dotenv').config();

// Membuat client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Map untuk menyimpan data modal
const modalData = new Map();

// Event ketika bot siap
client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} telah online!`);
    console.log(`📊 Terhubung ke ${client.guilds.cache.size} server`);
});

// Event untuk versi Discord.js v15+ (menghilangkan deprecation warning)
client.once('clientReady', () => {
    console.log(`🤖 Bot ${client.user.tag} telah online!`);
    console.log(`📊 Terhubung ke ${client.guilds.cache.size} server`);
});

// Command untuk mengirim embed
const sendEmbedCommand = new SlashCommandBuilder()
    .setName('sendembed')
    .setDescription('Mengirim embed ke channel yang dipilih')
    .addStringOption(option =>
        option.setName('title')
            .setDescription('Judul embed')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('description')
            .setDescription('Deskripsi embed')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('color')
            .setDescription('Warna embed (hex code, contoh: #FF0000)')
            .setRequired(false)
    )
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Channel untuk mengirim embed (bisa channel manapun)')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('channelid')
            .setDescription('ID Channel untuk mengirim embed (jika tidak ada di dropdown)')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('footer')
            .setDescription('Footer text')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('thumbnail')
            .setDescription('URL thumbnail')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('image')
            .setDescription('URL gambar')
            .setRequired(false)
    );

// Command untuk mengirim embed dengan template
const templateEmbedCommand = new SlashCommandBuilder()
    .setName('templateembed')
    .setDescription('Mengirim embed dengan template yang sudah ditentukan')
    .addStringOption(option =>
        option.setName('type')
            .setDescription('Jenis template')
            .setRequired(true)
            .addChoices(
                { name: 'Announcement', value: 'announcement' },
                { name: 'Welcome', value: 'welcome' },
                { name: 'Info', value: 'info' },
                { name: 'Warning', value: 'warning' },
                { name: 'Success', value: 'success' }
            )
    )
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Channel untuk mengirim embed (bisa channel manapun)')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('channelid')
            .setDescription('ID Channel untuk mengirim embed (jika tidak ada di dropdown)')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('content')
            .setDescription('Konten khusus untuk template')
            .setRequired(false)
    );

// Command untuk mengirim embed ke channel default
const quickEmbedCommand = new SlashCommandBuilder()
    .setName('quickembed')
    .setDescription('Mengirim embed cepat ke channel yang dipilih')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Pesan yang akan dikirim')
            .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Channel untuk mengirim embed')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('channelid')
            .setDescription('ID Channel untuk mengirim embed (jika tidak ada di dropdown)')
            .setRequired(false)
    );

// Command untuk mengirim embed ke multiple channels
const broadcastEmbedCommand = new SlashCommandBuilder()
    .setName('broadcastembed')
    .setDescription('Mengirim embed ke multiple channels sekaligus')
    .addStringOption(option =>
        option.setName('title')
            .setDescription('Judul embed')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('description')
            .setDescription('Deskripsi embed')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('channelids')
            .setDescription('ID Channel yang dipisah koma (contoh: 123456789,987654321)')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('color')
            .setDescription('Warna embed (hex code, contoh: #FF0000)')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('footer')
            .setDescription('Footer text')
            .setRequired(false)
    );

// Command untuk membuat embed dengan form/modal
const createEmbedCommand = new SlashCommandBuilder()
    .setName('createembed')
    .setDescription('Buat embed menggunakan form Discord (Modal)')
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Channel untuk mengirim embed')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('channelid')
            .setDescription('ID Channel untuk mengirim embed (jika tidak ada di dropdown)')
            .setRequired(false)
    );

// Array commands
const commands = [sendEmbedCommand, templateEmbedCommand, quickEmbedCommand, broadcastEmbedCommand, createEmbedCommand];

// Event untuk menangani slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'sendembed') {
        try {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color') || '#0099ff';
            const channelOption = interaction.options.getChannel('channel');
            const channelIdOption = interaction.options.getString('channelid');
            const footer = interaction.options.getString('footer');
            const thumbnail = interaction.options.getString('thumbnail');
            const image = interaction.options.getString('image');

            // Validasi warna hex
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!colorRegex.test(color)) {
                return interaction.reply({ 
                    content: '❌ Format warna tidak valid! Gunakan format hex seperti #FF0000', 
                    ephemeral: true 
                });
            }

            // Menentukan channel tujuan
            let targetChannel;
            if (channelOption) {
                targetChannel = channelOption;
            } else if (channelIdOption) {
                targetChannel = interaction.guild.channels.cache.get(channelIdOption);
                if (!targetChannel) {
                    return interaction.reply({ 
                        content: '❌ Channel dengan ID tersebut tidak ditemukan!', 
                        ephemeral: true 
                    });
                }
            } else {
                targetChannel = interaction.channel;
            }

            // Membuat embed
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setTimestamp();

            if (footer) embed.setFooter({ text: footer });
            if (thumbnail) embed.setThumbnail(thumbnail);
            if (image) embed.setImage(image);

            // Mengirim embed ke channel yang dipilih
            await targetChannel.send({ embeds: [embed] });

            await interaction.reply({ 
                content: `✅ Embed berhasil dikirim ke ${targetChannel}!`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error mengirim embed:', error);
            await interaction.reply({ 
                content: '❌ Terjadi kesalahan saat mengirim embed!', 
                ephemeral: true 
            });
        }
    }

    if (commandName === 'templateembed') {
        try {
            const type = interaction.options.getString('type');
            const channelOption = interaction.options.getChannel('channel');
            const channelIdOption = interaction.options.getString('channelid');
            const content = interaction.options.getString('content') || '';

            // Menentukan channel tujuan
            let targetChannel;
            if (channelOption) {
                targetChannel = channelOption;
            } else if (channelIdOption) {
                targetChannel = interaction.guild.channels.cache.get(channelIdOption);
                if (!targetChannel) {
                    return interaction.reply({ 
                        content: '❌ Channel dengan ID tersebut tidak ditemukan!', 
                        ephemeral: true 
                    });
                }
            } else {
                targetChannel = interaction.channel;
            }

            let embed;

            switch (type) {
                case 'announcement':
                    embed = new EmbedBuilder()
                        .setTitle('📢 PENGUMUMAN')
                        .setDescription(content || 'Penting untuk diketahui oleh semua member!')
                        .setColor('#FF6B6B')
                        .setTimestamp();
                    break;

                case 'welcome':
                    embed = new EmbedBuilder()
                        .setTitle('🎉 SELAMAT DATANG!')
                        .setDescription(content || 'Selamat datang di server kami!')
                        .setColor('#4ECDC4')
                        .setTimestamp();
                    break;

                case 'info':
                    embed = new EmbedBuilder()
                        .setTitle('ℹ️ INFORMASI')
                        .setDescription(content || 'Informasi penting untuk Anda')
                        .setColor('#45B7D1')
                        .setTimestamp();
                    break;

                case 'warning':
                    embed = new EmbedBuilder()
                        .setTitle('⚠️ PERINGATAN')
                        .setDescription(content || 'Harap perhatikan hal ini!')
                        .setColor('#FFA726')
                        .setTimestamp();
                    break;

                case 'success':
                    embed = new EmbedBuilder()
                        .setTitle('✅ BERHASIL')
                        .setDescription(content || 'Operasi berhasil dilakukan!')
                        .setColor('#66BB6A')
                        .setTimestamp();
                    break;
            }

            await targetChannel.send({ embeds: [embed] });

            await interaction.reply({ 
                content: `✅ Template embed "${type}" berhasil dikirim ke ${targetChannel}!`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error mengirim template embed:', error);
            await interaction.reply({ 
                content: '❌ Terjadi kesalahan saat mengirim template embed!', 
                ephemeral: true 
            });
        }
    }

    if (commandName === 'quickembed') {
        try {
            const message = interaction.options.getString('message');
            const channelOption = interaction.options.getChannel('channel');
            const channelIdOption = interaction.options.getString('channelid');

            // Menentukan channel tujuan
            let targetChannel;
            if (channelOption) {
                targetChannel = channelOption;
            } else if (channelIdOption) {
                targetChannel = interaction.guild.channels.cache.get(channelIdOption);
                if (!targetChannel) {
                    return interaction.reply({ 
                        content: '❌ Channel dengan ID tersebut tidak ditemukan!', 
                        ephemeral: true 
                    });
                }
            } else {
                targetChannel = interaction.guild.channels.cache.get(process.env.DEFAULT_CHANNEL_ID) || interaction.channel;
            }

            const embed = new EmbedBuilder()
                .setDescription(message)
                .setColor('#0099ff')
                .setTimestamp();

            await targetChannel.send({ embeds: [embed] });

            await interaction.reply({ 
                content: `✅ Quick embed berhasil dikirim ke ${targetChannel}!`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error mengirim quick embed:', error);
            await interaction.reply({ 
                content: '❌ Terjadi kesalahan saat mengirim quick embed!', 
                ephemeral: true 
            });
        }
    }

    if (commandName === 'broadcastembed') {
        try {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const channelIds = interaction.options.getString('channelids');
            const color = interaction.options.getString('color') || '#0099ff';
            const footer = interaction.options.getString('footer');

            // Validasi warna hex
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!colorRegex.test(color)) {
                return interaction.reply({ 
                    content: '❌ Format warna tidak valid! Gunakan format hex seperti #FF0000', 
                    ephemeral: true 
                });
            }

            // Parse channel IDs
            const channelIdArray = channelIds.split(',').map(id => id.trim());
            const validChannels = [];
            const invalidChannels = [];

            // Membuat embed
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setTimestamp();

            if (footer) embed.setFooter({ text: footer });

            // Mengirim ke setiap channel
            for (const channelId of channelIdArray) {
                try {
                    const channel = interaction.guild.channels.cache.get(channelId);
                    if (channel) {
                        await channel.send({ embeds: [embed] });
                        validChannels.push(channel.name);
                    } else {
                        invalidChannels.push(channelId);
                    }
                } catch (error) {
                    console.error(`Error mengirim ke channel ${channelId}:`, error);
                    invalidChannels.push(channelId);
                }
            }

            let responseMessage = `✅ Embed berhasil dikirim ke ${validChannels.length} channel:\n${validChannels.map(name => `• ${name}`).join('\n')}`;
            
            if (invalidChannels.length > 0) {
                responseMessage += `\n\n❌ Gagal mengirim ke ${invalidChannels.length} channel:\n${invalidChannels.map(id => `• ${id}`).join('\n')}`;
            }

            await interaction.reply({ 
                content: responseMessage, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error mengirim broadcast embed:', error);
            await interaction.reply({ 
                content: '❌ Terjadi kesalahan saat mengirim broadcast embed!', 
                ephemeral: true 
            });
        }
    }

    if (commandName === 'createembed') {
        try {
            const channelOption = interaction.options.getChannel('channel');
            const channelIdOption = interaction.options.getString('channelid');

            // Menentukan channel tujuan
            let targetChannel;
            if (channelOption) {
                targetChannel = channelOption;
            } else if (channelIdOption) {
                targetChannel = interaction.guild.channels.cache.get(channelIdOption);
                if (!targetChannel) {
                    return interaction.reply({ 
                        content: '❌ Channel dengan ID tersebut tidak ditemukan!', 
                        ephemeral: true 
                    });
                }
            } else {
                targetChannel = interaction.channel;
            }

            // Membuat modal form
            const modal = new ModalBuilder()
                .setCustomId('embed_creator_modal')
                .setTitle('🎨 Buat Embed');

            // Input untuk judul
            const titleInput = new TextInputBuilder()
                .setCustomId('embed_title')
                .setLabel('Judul Embed')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Masukkan judul embed...')
                .setRequired(true)
                .setMaxLength(256);

            // Input untuk deskripsi
            const descriptionInput = new TextInputBuilder()
                .setCustomId('embed_description')
                .setLabel('Deskripsi Embed')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Masukkan deskripsi embed...')
                .setRequired(true)
                .setMaxLength(4000);

            // Input untuk warna
            const colorInput = new TextInputBuilder()
                .setCustomId('embed_color')
                .setLabel('Warna (Hex Code)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('#FF0000')
                .setRequired(false)
                .setMaxLength(7);

            // Input untuk footer
            const footerInput = new TextInputBuilder()
                .setCustomId('embed_footer')
                .setLabel('Footer Text')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Masukkan footer text...')
                .setRequired(false)
                .setMaxLength(2048);

            // Input untuk thumbnail URL
            const thumbnailInput = new TextInputBuilder()
                .setCustomId('embed_thumbnail')
                .setLabel('Thumbnail URL')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('https://example.com/image.png')
                .setRequired(false)
                .setMaxLength(2048);

            // Menambahkan input ke modal
            const titleRow = new ActionRowBuilder().addComponents(titleInput);
            const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
            const colorRow = new ActionRowBuilder().addComponents(colorInput);
            const footerRow = new ActionRowBuilder().addComponents(footerInput);
            const thumbnailRow = new ActionRowBuilder().addComponents(thumbnailInput);

            modal.addComponents(titleRow, descriptionRow, colorRow, footerRow, thumbnailRow);

            // Menyimpan channel tujuan untuk digunakan saat modal submit
            const modalId = `embed_modal_${interaction.user.id}_${Date.now()}`;
            modalData.set(modalId, { targetChannel: targetChannel.id });
            
            // Update modal custom ID
            modal.setCustomId(modalId);

            await interaction.showModal(modal);

        } catch (error) {
            console.error('Error membuat modal:', error);
            await interaction.reply({ 
                content: '❌ Terjadi kesalahan saat membuat form!', 
                ephemeral: true 
            });
        }
    }
});

// Event untuk menangani modal submit
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.startsWith('embed_modal_')) {
        try {
            // Mendapatkan data dari form
            const title = interaction.fields.getTextInputValue('embed_title');
            const description = interaction.fields.getTextInputValue('embed_description');
            const color = interaction.fields.getTextInputValue('embed_color') || '#0099ff';
            const footer = interaction.fields.getTextInputValue('embed_footer');
            const thumbnail = interaction.fields.getTextInputValue('embed_thumbnail');

            // Validasi warna hex
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (color && !colorRegex.test(color)) {
                return interaction.reply({ 
                    content: '❌ Format warna tidak valid! Gunakan format hex seperti #FF0000', 
                    ephemeral: true 
                });
            }

            // Mendapatkan channel tujuan dari data yang disimpan
            const modalInfo = modalData.get(interaction.customId);
            let targetChannel;
            
            if (modalInfo && modalInfo.targetChannel) {
                targetChannel = interaction.guild.channels.cache.get(modalInfo.targetChannel);
                if (!targetChannel) {
                    return interaction.reply({ 
                        content: '❌ Channel tujuan tidak ditemukan!', 
                        ephemeral: true 
                    });
                }
            } else {
                targetChannel = interaction.channel;
            }

            // Membuat embed
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setTimestamp();

            if (footer) embed.setFooter({ text: footer });
            if (thumbnail) embed.setThumbnail(thumbnail);

            // Mengirim embed ke channel yang dipilih
            await targetChannel.send({ embeds: [embed] });

            // Hapus data modal dari map
            modalData.delete(interaction.customId);

            await interaction.reply({ 
                content: `✅ Embed berhasil dibuat dan dikirim ke ${targetChannel}!`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Error mengirim embed dari modal:', error);
            await interaction.reply({ 
                content: '❌ Terjadi kesalahan saat membuat embed!', 
                ephemeral: true 
            });
        }
    }
});

// Fungsi untuk registrasi slash commands
async function registerCommands() {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        console.log('🔄 Mulai registrasi slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('✅ Slash commands berhasil diregistrasi!');
    } catch (error) {
        console.error('❌ Error registrasi commands:', error);
    }
}

// Event ketika bot siap untuk registrasi commands
client.once('ready', async () => {
    await registerCommands();
});

// Event untuk registrasi commands di versi Discord.js v15+
client.once('clientReady', async () => {
    await registerCommands();
});

// Login bot
client.login(process.env.DISCORD_TOKEN);