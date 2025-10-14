const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    // Template methods
    async createTemplate(guildId, name, content, imageUrl, authorId) {
        await db.set(`templates.${guildId}.${name}`, { 
            content, 
            imageUrl, 
            authorId, 
            createdAt: Date.now() 
        });
    },

    async getTemplate(guildId, name) {
        return await db.get(`templates.${guildId}.${name}`);
    },

    async updateTemplate(guildId, name, content, imageUrl) {
        const template = await db.get(`templates.${guildId}.${name}`);
        if (template) {
            template.content = content !== undefined ? content : template.content;
            template.imageUrl = imageUrl !== undefined ? imageUrl : template.imageUrl;
            await db.set(`templates.${guildId}.${name}`, template);
            return true;
        }
        return false;
    },

    async deleteTemplate(guildId, name) {
        return await db.delete(`templates.${guildId}.${name}`);
    },

    async getAllTemplates(guildId) {
        const templates = await db.get(`templates.${guildId}`);
        return templates ? Object.keys(templates).map(name => ({ name, ...templates[name] })) : [];
    },

    // Sticky message methods
    async setStickyMessage(channelId, messageId, content) {
        await db.set(`sticky.${channelId}`, { 
            messageId, 
            content, 
            lastSent: Date.now() 
        });
    },

    async getStickyMessage(channelId) {
        return await db.get(`sticky.${channelId}`);
    },

    async removeStickyMessage(channelId) {
        return await db.delete(`sticky.${channelId}`);
    },

    async getAllStickyMessages() {
        const stickyData = await db.get('sticky');
        return stickyData ? Object.keys(stickyData).map(channelId => ({ 
            channelId, 
            ...stickyData[channelId] 
        })) : [];
    }
};
