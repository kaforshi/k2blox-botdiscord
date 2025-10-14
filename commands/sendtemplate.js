const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendtemplate')
        .setDescription('Kirim template pesan ke channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nama template yang akan dikirim')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel tempat template akan dikirim')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Anda tidak memiliki permission Administrator!',
                ephemeral: true
            });
        }

        const name = interaction.options.getString('name');
        const targetChannel = interaction.options.getChannel('channel');

        try {
            // Cek apakah template ada
            const template = await database.getTemplate(interaction.guild.id, name);
            if (!template) {
                return await interaction.reply({
                    content: `❌ Template dengan nama "${name}" tidak ditemukan!`,
                    ephemeral: true
                });
            }

            // Cek permission
            if (!targetChannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
                return await interaction.reply({
                    content: '❌ Bot tidak memiliki permission untuk mengirim pesan ke channel tersebut!',
                    ephemeral: true
                });
            }

            // Kirim template
            const messageOptions = { content: template.content };
            if (template.imageUrl) {
                messageOptions.files = [template.imageUrl];
            }

            await targetChannel.send(messageOptions);

            const embed = new (require('discord.js').EmbedBuilder)()
                .setTitle('✅ Template Berhasil Dikirim!')
                .setDescription(`Template "${name}" telah dikirim ke ${targetChannel}`)
                .setColor('#00FF00')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error sending template:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengirim template!',
                ephemeral: true
            });
        }
    }
};
