// File untuk testing perintah bot
// Jalankan dengan: node test-commands.js

const config = require('./config');

console.log('🧪 Testing K2BLOX Bot Configuration');
console.log('=====================================');

// Test config loading
console.log('✅ Config loaded successfully');
console.log(`📝 Brand Name: ${config.brand.name}`);
console.log(`🎨 Brand Color: ${config.brand.color}`);
console.log(`🖼️  Brand Icon: ${config.brand.iconURL}`);

// Test environment variables
console.log('\n🔧 Environment Variables:');
console.log(`Token: ${config.token ? '✅ Set' : '❌ Missing'}`);
console.log(`Client ID: ${config.clientId ? '✅ Set' : '❌ Missing'}`);
console.log(`Guild ID: ${config.guildId ? '✅ Set' : '❌ Missing'}`);

if (!config.token || !config.clientId) {
    console.log('\n⚠️  Warning: Token atau Client ID tidak ditemukan!');
    console.log('📋 Pastikan file .env sudah dibuat dan diisi dengan benar.');
    console.log('📖 Lihat SETUP.md untuk panduan lengkap.');
} else {
    console.log('\n🎉 Semua konfigurasi sudah benar! Bot siap dijalankan.');
    console.log('🚀 Jalankan: npm start');
}

console.log('\n📚 Dokumentasi:');
console.log('- README.md: Dokumentasi lengkap');
console.log('- SETUP.md: Panduan setup step-by-step');
console.log('- env.example: Template environment variables');
