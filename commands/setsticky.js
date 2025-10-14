const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setsticky')
        .setDescription('Set sticky message di channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel tempat sticky message akan diatur')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Pesan sticky yang akan ditampilkan')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        const targetChannel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        try {
            // Cek permission
            if (!targetChannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
                return await interaction.reply({
                    content: '❌ Bot tidak memiliki permission untuk mengirim pesan ke channel tersebut!',
                    ephemeral: true
                });
            }

            // Kirim sticky message pertama
            const stickyMessage = await targetChannel.send(message);
            
            // Simpan ke database
            await database.setStickyMessage(targetChannel.id, stickyMessage.id, message);

            const embed = new (require('discord.js').EmbedBuilder)()
                .setTitle('✅ Sticky Message Berhasil Diatur!')
                .setDescription(`Sticky message telah diatur di ${targetChannel}\n**Pesan:** ${message}`)
                .setColor('#00FF00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error setting sticky message:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengatur sticky message!',
                ephemeral: true
            });
        }
    }
};
