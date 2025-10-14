# 🚀 Panduan Setup K2BLOX Discord Bot

## Langkah 1: Persiapan Bot Discord

1. **Buat Aplikasi Discord**
   - Buka [Discord Developer Portal](https://discord.com/developers/applications)
   - Klik "New Application"
   - Beri nama "K2BLOX Bot" (atau nama yang Anda inginkan)
   - Klik "Create"

2. **Dapatkan Token Bot**
   - Di sidebar kiri, klik "Bot"
   - Klik "Add Bot" jika belum ada
   - Di bagian "Token", klik "Copy" untuk menyalin token
   - **PENTING**: Jangan bagikan token ini kepada siapa pun!

3. **Dapatkan Client ID**
   - Di sidebar kiri, klik "General Information"
   - Copy "Application ID" (ini adalah Client ID)

4. **Setup Bot Permissions**
   - Di halaman Bot, scroll ke bawah ke "Privileged Gateway Intents"
   - Aktifkan "Message Content Intent" (wajib untuk sticky message)
   - Scroll ke "Bot Permissions" dan pilih:
     - Send Messages
     - Use Slash Commands
     - Embed Links
     - Read Message History
     - Manage Messages
     - Add Reactions

5. **Invite Bot ke Server**
   - Di sidebar kiri, klik "OAuth2" > "URL Generator"
   - Pilih scopes: `bot` dan `applications.commands`
   - Pilih permissions yang sama seperti di atas
   - Copy URL yang dihasilkan dan buka di browser
   - Pilih server dan authorize bot

## Langkah 2: Setup Proyek

1. **Install Node.js**
   - Download dari [nodejs.org](https://nodejs.org/)
   - Install versi 16.9.0 atau lebih baru
   - Verifikasi dengan: `node --version`

2. **Clone/Download Proyek**
   ```bash
   # Jika menggunakan Git
   git clone <repository-url>
   cd k2blox-botdiscord
   
   # Atau download ZIP dan extract
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Setup Environment Variables**
   - Copy file `env.example` menjadi `.env`
   - Edit file `.env` dan isi dengan data bot Anda:
   ```env
   DISCORD_TOKEN=your_actual_bot_token_here
   CLIENT_ID=your_actual_client_id_here
   GUILD_ID=your_server_id_here
   ```

## Langkah 3: Deploy dan Jalankan

1. **Deploy Slash Commands**
   ```bash
   npm run deploy
   ```
   - Tunggu hingga muncul pesan "Successfully reloaded X application commands"

2. **Jalankan Bot**
   ```bash
   npm start
   ```
   - Bot akan online dan siap digunakan
   - Anda akan melihat pesan "Bot K2BLOX berhasil login!"

## Langkah 4: Testing Fitur

### Test Setup Review
1. Jalankan `/setup_review #channel-review` di server Discord
2. Klik tombol "Buat Ulasan" di channel yang dipilih
3. Isi form review dan submit
4. Cek apakah review muncul sebagai embed

### Test Sticky Message
1. Jalankan `/stick set #channel "Pesan penting ini akan melekat"`
2. Kirim pesan biasa di channel tersebut
3. Cek apakah pesan sticky muncul di bawah

### Test Custom Embed
1. Jalankan `/create_embed`
2. Isi form modal dengan data yang diinginkan
3. Cek apakah embed terkirim ke channel yang ditentukan

## 🔧 Troubleshooting

### Bot tidak online
- ✅ Cek token bot di file `.env`
- ✅ Pastikan bot sudah di-invite ke server
- ✅ Cek koneksi internet

### Slash commands tidak muncul
- ✅ Jalankan `npm run deploy` lagi
- ✅ Tunggu 5-10 menit untuk sinkronisasi
- ✅ Restart bot dengan `npm start`

### Error "Missing Access"
- ✅ Cek permission bot di server
- ✅ Pastikan bot memiliki role yang tepat
- ✅ Re-invite bot dengan permission yang benar

### Sticky message tidak bekerja
- ✅ Pastikan "Message Content Intent" aktif di Developer Portal
- ✅ Cek permission "Manage Messages"
- ✅ Pastikan bot bukan di channel yang sama dengan pesan sticky

## 📞 Bantuan

Jika mengalami masalah:
1. Cek console log untuk error messages
2. Pastikan semua langkah setup sudah benar
3. Cek permission bot di server Discord
4. Restart bot dan coba lagi

## 🎉 Selamat!

Bot K2BLOX Anda sudah siap digunakan! Semua fitur review, sticky message, dan custom embed sudah aktif.
