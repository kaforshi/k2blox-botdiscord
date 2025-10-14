const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.log('📁 Folder commands tidak ditemukan');
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Command ${command.data.name} dimuat`);
        } else {
            console.log(`⚠️ Command di ${file} tidak memiliki "data" atau "execute"`);
        }
    }
    
    console.log(`📁 ${commandFiles.length} commands berhasil dimuat!`);
}

module.exports = { loadCommands };
