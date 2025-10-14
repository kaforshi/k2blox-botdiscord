const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Abaikan pesan dari bot
        if (message.author.bot) return;

        // Cek apakah ada sticky message di channel ini
        if (!global.stickyMessages || !global.stickyMessages.has(message.channel.id)) {
            return;
        }

        const stickyData = global.stickyMessages.get(message.channel.id);
        
        // Cooldown untuk mencegah spam (5 detik)
        const now = Date.now();
        if (stickyData.lastProcessed && (now - stickyData.lastProcessed) < 5000) {
            return;
        }

        try {
            // Hapus pesan sticky lama jika ada
            if (stickyData.lastMessageId) {
                try {
                    const lastMessage = await message.channel.messages.fetch(stickyData.lastMessageId);
                    await lastMessage.delete();
                } catch (error) {
                    // Pesan mungkin sudah dihapus atau tidak ditemukan
                    console.log('Pesan sticky lama tidak ditemukan');
                }
            }

            // Kirim pesan sticky baru
            const newStickyMessage = await message.channel.send(stickyData.message);
            
            // Update data sticky
            stickyData.lastMessageId = newStickyMessage.id;
            stickyData.lastProcessed = now;
            
            global.stickyMessages.set(message.channel.id, stickyData);

        } catch (error) {
            console.error('Error managing sticky message:', error);
        }
    },
};
