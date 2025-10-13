const fs = require('fs');
const path = require('path');

console.log('🚀 K2Blox Discord Bot Setup');
console.log('============================\n');

// Cek apakah file .env sudah ada
if (fs.existsSync('.env')) {
    console.log('⚠️  File .env sudah ada!');
    console.log('   Jika ingin membuat ulang, hapus file .env terlebih dahulu.\n');
    process.exit(0);
}

// Baca template dari config.example.env
const templatePath = path.join(__dirname, 'config.example.env');
if (!fs.existsSync(templatePath)) {
    console.log('❌ File config.example.env tidak ditemukan!');
    process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// Buat file .env dengan template
fs.writeFileSync('.env', template);

console.log('✅ File .env berhasil dibuat!');
console.log('\n📝 Langkah selanjutnya:');
console.log('1. Edit file .env dan isi dengan informasi bot Discord Anda');
console.log('2. Jalankan: npm start');
console.log('\n🔧 Konfigurasi yang perlu diisi:');
console.log('   - DISCORD_TOKEN: Token bot dari Discord Developer Portal');
console.log('   - GUILD_ID: ID server Discord');
console.log('   - DEFAULT_CHANNEL_ID: ID channel default (opsional)');
console.log('\n💡 Tips:');
console.log('   - Aktifkan Developer Mode di Discord untuk mendapatkan ID');
console.log('   - Klik kanan pada server/channel untuk copy ID');
console.log('   - Konfigurasi lainnya bersifat opsional');


