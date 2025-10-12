const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        try {
            const config = await client.database.getGuildConfig(member.guild.id);
            
            if (!config.log_channel_id) {
                return;
            }

            const logChannel = member.guild.channels.cache.get(config.log_channel_id);
            if (!logChannel) {
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('👋 Member Left')
                .setColor('#ff8800')
                .addFields(
                    { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: `Member #${member.guild.memberCount}` });

            await logChannel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error in guildMemberRemove event:', error);
        }
    },
};
