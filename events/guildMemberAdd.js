const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            const config = await client.database.getGuildConfig(member.guild.id);
            
            if (!config.welcome_channel_id) {
                return;
            }

            const welcomeChannel = member.guild.channels.cache.get(config.welcome_channel_id);
            if (!welcomeChannel) {
                return;
            }

            // Replace variables in welcome message
            let welcomeMessage = config.welcome_message
                .replace(/{user}/g, `<@${member.id}>`)
                .replace(/{username}/g, member.user.username)
                .replace(/{guild}/g, member.guild.name)
                .replace(/{memberCount}/g, member.guild.memberCount);

            const embed = new EmbedBuilder()
                .setTitle('🎉 Welcome!')
                .setDescription(welcomeMessage)
                .setColor('#00ff00')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: `Member #${member.guild.memberCount}` });

            await welcomeChannel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error in guildMemberAdd event:', error);
        }
    },
};
