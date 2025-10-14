const database = require('../utils/database');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return; // Ignore bot messages

        const stickyData = await database.getStickyMessage(message.channel.id);

        if (stickyData) {
            // Delete old sticky message if it exists
            if (stickyData.messageId) {
                try {
                    const oldStickyMessage = await message.channel.messages.fetch(stickyData.messageId);
                    await oldStickyMessage.delete();
                } catch (error) {
                    // Ignore if message not found (already deleted or bot restarted)
                    if (error.code !== 10008) {
                        console.error('Error deleting old sticky message:', error);
                    }
                }
            }

            // Send new sticky message
            const newStickyMessage = await message.channel.send({
                content: stickyData.content
            });

            // Update database with new message ID
            await database.setStickyMessage(message.channel.id, newStickyMessage.id, stickyData.content);
        }
    },
};
