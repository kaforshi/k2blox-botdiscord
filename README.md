# K2Blox Discord Bot

Advanced Discord bot dengan fitur moderasi, music player, dan sistem konfigurasi yang dapat dikustomisasi melalui Discord.

## 🚀 Fitur

### 🛡️ Moderation
- **Warn System**: Sistem peringatan dengan auto-warn dan auto-ban
- **Ban/Kick**: Perintah untuk ban dan kick user
- **Warning Management**: Lihat dan hapus warning user
- **Auto Actions**: Auto-warn dan auto-ban berdasarkan threshold yang dapat dikonfigurasi
- **Logging**: Sistem log untuk semua aksi moderasi

### 🎵 Music Player
- **YouTube Support**: Putar musik dari YouTube
- **Spotify Support**: Putar musik dari Spotify (mencari di YouTube)
- **Queue System**: Sistem antrian musik
- **Music Controls**: Play, pause, skip, stop, dan clear queue
- **Channel Restrictions**: Batasi perintah musik ke channel tertentu

### 🎉 Welcome System
- **Welcome Messages**: Pesan selamat datang yang dapat dikustomisasi
- **Variables**: Support untuk variabel seperti {user}, {guild}, {memberCount}
- **Auto Welcome**: Otomatis mengirim pesan selamat datang

### 📋 Embed System
- **Template Creation**: Buat template embed yang dapat digunakan kembali
- **Interactive Builder**: Builder embed dengan form interaktif
- **Customization**: Title, description, color, fields, footer, thumbnail, image
- **Preview**: Preview embed sebelum menyimpan

### ⚙️ Configuration
- **Discord Interface**: Konfigurasi semua setting melalui Discord
- **Server Settings**: Welcome channel, log channel, music channel
- **Moderation Settings**: Auto-warn/ban thresholds
- **Music Settings**: Enable/disable YouTube dan Spotify
- **Reset Options**: Reset semua konfigurasi ke default

## 📦 Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/k2blox-botdiscord.git
cd k2blox-botdiscord
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp config.example.env .env
```

Edit file `.env` dan isi dengan informasi bot Anda:
```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_guild_id_here  # Optional: For development (instant command registration)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
OWNER_ID=your_user_id_here
```

4. **Run the bot**
```bash
npm start
```

Untuk development mode:
```bash
npm run dev
```

### 📝 **Tentang GUILD_ID**

`GUILD_ID` di file `.env` adalah **opsional** dan memiliki kegunaan khusus:

#### ✅ **Dengan GUILD_ID (Recommended untuk Development)**
- Commands langsung tersedia di server tersebut (instant)
- Cocok untuk testing dan development
- Tidak mempengaruhi kemampuan bot di server lain

#### ✅ **Tanpa GUILD_ID (Production)**
- Commands didaftarkan secara global
- Tersedia di semua server yang di-invite bot
- Butuh waktu hingga 1 jam untuk propagate

#### 🎯 **Rekomendasi Penggunaan**
- **Development**: Gunakan GUILD_ID untuk testing cepat
- **Production**: Kosongkan GUILD_ID untuk multi-server support

## 🔧 Setup Bot

### Discord Application
1. Pergi ke [Discord Developer Portal](https://discord.com/developers/applications)
2. Buat aplikasi baru
3. Pergi ke tab "Bot" dan buat bot
4. Copy token dan masukkan ke `.env`
5. Enable "Message Content Intent" di Privileged Gateway Intents
6. Pergi ke tab "OAuth2" > "URL Generator"
7. Pilih scopes: `bot`, `applications.commands`
8. Pilih permissions: `Administrator` (atau permissions yang diperlukan)
9. Copy URL dan invite bot ke server

### Spotify API (Optional)
1. Pergi ke [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Buat aplikasi baru
3. Copy Client ID dan Client Secret
4. Masukkan ke file `.env`

## 📝 Commands

### Moderation
- `/warn <user> <reason>` - Warn a user
- `/ban <user> [reason] [delete_messages]` - Ban a user
- `/kick <user> [reason]` - Kick a user
- `/warnings <user>` - View user warnings
- `/clearwarnings <user>` - Clear user warnings

### Music
- `/play <query>` - Play music from YouTube/Spotify
- `/queue` - View music queue
- `/leave` - Make bot leave voice channel

### Configuration
- `/config` - Configure server settings
- `/embed create <name>` - Create embed template
- `/embed list` - List embed templates
- `/embed send <name> [channel]` - Send embed template

### General
- `/help` - Show help information
- `/ping` - Check bot latency

## 🎛️ Configuration

Gunakan `/config` untuk mengkonfigurasi server:

### Welcome Settings
- **Welcome Channel**: Channel untuk pesan selamat datang
- **Welcome Message**: Pesan yang akan dikirim (support variables)

### Moderation Settings
- **Log Channel**: Channel untuk log moderasi
- **Auto Warn Threshold**: Jumlah warning untuk auto-warn
- **Auto Ban Threshold**: Jumlah warning untuk auto-ban

### Music Settings
- **Music Channel**: Channel untuk perintah musik
- **Spotify**: Enable/disable Spotify support
- **YouTube**: Enable/disable YouTube support

## 🔄 Auto Actions

Bot akan otomatis melakukan aksi berdasarkan warning count:

1. **Auto Warn**: Ketika user mencapai threshold auto-warn
2. **Auto Ban**: Ketika user mencapai threshold auto-ban

Semua aksi akan di-log ke channel yang dikonfigurasi.

## 📊 Database

Bot menggunakan SQLite database untuk menyimpan:
- Konfigurasi server
- Warning history
- Ban history
- Music queue
- Embed templates

Database akan dibuat otomatis saat bot pertama kali dijalankan.

## 🛠️ Development

### Project Structure
```
k2blox-botdiscord/
├── commands/           # Slash commands
│   ├── moderation/     # Moderation commands
│   ├── music/          # Music commands
│   ├── config/         # Configuration commands
│   └── general/        # General commands
├── events/             # Event handlers
├── handlers/           # Interaction handlers
├── utils/              # Utility modules
├── index.js            # Main bot file
└── package.json        # Dependencies
```

### Adding New Features
1. Buat command di folder `commands/`
2. Tambahkan event handler di folder `events/` jika diperlukan
3. Update database schema di `utils/database.js` jika diperlukan
4. Test fitur baru

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 🔧 Troubleshooting

Jika mengalami error **"Used disallowed intents"**:

### ✅ **Solusi Cepat:**
```bash
npm run start:minimal
```

### ✅ **Solusi Lengkap:**
1. Aktifkan **Privileged Gateway Intents** di Discord Developer Portal:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
2. Restart bot dengan `npm start`

### 🧪 **Test Connection:**
```bash
npm test
```

Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md) untuk panduan lengkap.

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:
- Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Buat issue di GitHub
- Join Discord server kami
- Email: support@k2blox.com

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API library
- [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube downloader
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Spotify integration

---

**Made with ❤️ by K2Blox Team**
