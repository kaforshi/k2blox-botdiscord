# K2Blox Discord Bot - Embed Sender

Bot Discord untuk mengirimkan embed ke channel yang telah dipilih dengan berbagai opsi kustomisasi.

## 🚀 Fitur

- **Send Embed**: Mengirim embed kustom dengan judul, deskripsi, warna, dan media ke channel manapun
- **Template Embed**: Mengirim embed dengan template yang sudah ditentukan (Announcement, Welcome, Info, Warning, Success) ke channel manapun
- **Quick Embed**: Mengirim embed cepat ke channel yang dipilih
- **Broadcast Embed**: Mengirim embed yang sama ke multiple channels sekaligus
- **Create Embed (Modal Form)**: Buat embed menggunakan form Discord yang user-friendly
- **Flexible Channel Selection**: Pilih channel melalui dropdown atau masukkan ID channel secara manual
- **Slash Commands**: Interface yang mudah digunakan dengan slash commands

## 📋 Prerequisites

- Node.js (versi 16.9.0 atau lebih baru)
- Discord Bot Token
- Discord Server (Guild) ID
- Channel ID (opsional, untuk channel default)

## 🛠️ Instalasi

1. **Clone atau download repository ini**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   **Cara Otomatis (Recommended):**
   ```bash
   npm run setup
   ```
   
   **Cara Manual:**
   - Copy file `config.example.env` menjadi `.env`
   - Edit file `.env` dan isi dengan informasi bot Discord Anda
   
   **Konfigurasi Minimal:**
   ```env
   DISCORD_TOKEN=your_bot_token_here
   GUILD_ID=your_guild_id_here
   DEFAULT_CHANNEL_ID=your_channel_id_here
   ```

4. **Jalankan bot**
   ```bash
   npm start
   ```

   Atau untuk development dengan auto-restart:
   ```bash
   npm run dev
   ```

## ⚙️ Konfigurasi Environment

### Konfigurasi Wajib
```env
DISCORD_TOKEN=your_bot_token_here    # Token bot dari Discord Developer Portal
GUILD_ID=your_guild_id_here          # ID server Discord
DEFAULT_CHANNEL_ID=your_channel_id_here  # ID channel default (opsional)
```

### Konfigurasi Opsional
```env
# Warna default untuk embed
DEFAULT_EMBED_COLOR=#0099ff

# Nama bot untuk footer embed
BOT_NAME=K2Blox Bot

# URL avatar bot
BOT_AVATAR_URL=https://example.com/bot-avatar.png

# Permission settings
ADMIN_ONLY=false                    # Set true jika hanya admin yang bisa pakai
ALLOWED_ROLES=123456789,987654321   # ID role yang diizinkan (pisahkan koma)

# Logging settings
ENABLE_LOGGING=true                 # Enable console logging
LOG_COMMANDS=true                   # Log setiap command yang dijalankan
```

## 🔧 Setup Discord Bot

1. **Buat Bot di Discord Developer Portal**
   - Pergi ke [Discord Developer Portal](https://discord.com/developers/applications)
   - Klik "New Application"
   - Beri nama untuk aplikasi Anda
   - Pergi ke tab "Bot" dan klik "Add Bot"
   - Copy token bot dan masukkan ke file `.env`

2. **Set Permissions Bot**
   - Di tab "Bot", scroll ke bawah ke "Privileged Gateway Intents"
   - Aktifkan "Message Content Intent" jika diperlukan
   - Di tab "OAuth2 > URL Generator"
   - Pilih scopes: `bot` dan `applications.commands`
   - Pilih permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
   - Copy URL yang dihasilkan dan invite bot ke server Anda

3. **Dapatkan Guild ID dan Channel ID**
   - Aktifkan Developer Mode di Discord (User Settings > Advanced > Developer Mode)
   - Klik kanan pada server untuk copy Guild ID
   - Klik kanan pada channel untuk copy Channel ID

## 📖 Cara Penggunaan

### Slash Commands

1. **`/sendembed`** - Mengirim embed kustom ke channel manapun
   - `title`: Judul embed (required)
   - `description`: Deskripsi embed (required)
   - `color`: Warna embed dalam format hex (optional, default: #0099ff)
   - `channel`: Channel tujuan dari dropdown (optional)
   - `channelid`: ID Channel untuk channel yang tidak ada di dropdown (optional)
   - `footer`: Text footer (optional)
   - `thumbnail`: URL thumbnail (optional)
   - `image`: URL gambar (optional)

2. **`/templateembed`** - Mengirim embed dengan template ke channel manapun
   - `type`: Jenis template (Announcement, Welcome, Info, Warning, Success)
   - `channel`: Channel tujuan dari dropdown (optional)
   - `channelid`: ID Channel untuk channel yang tidak ada di dropdown (optional)
   - `content`: Konten khusus untuk template (optional)

3. **`/quickembed`** - Mengirim embed cepat ke channel yang dipilih
   - `message`: Pesan yang akan dikirim (required)
   - `channel`: Channel tujuan dari dropdown (optional)
   - `channelid`: ID Channel untuk channel yang tidak ada di dropdown (optional)

4. **`/broadcastembed`** - Mengirim embed yang sama ke multiple channels
   - `title`: Judul embed (required)
   - `description`: Deskripsi embed (required)
   - `channelids`: ID Channel yang dipisah koma (required, contoh: 123456789,987654321)
   - `color`: Warna embed dalam format hex (optional, default: #0099ff)
   - `footer`: Text footer (optional)

5. **`/createembed`** - Buat embed menggunakan form Discord (Modal)
   - `channel`: Channel tujuan dari dropdown (optional)
   - `channelid`: ID Channel untuk channel yang tidak ada di dropdown (optional)
   - **Form Fields:**
     - Judul Embed (required)
     - Deskripsi Embed (required)
     - Warna (Hex Code, optional)
     - Footer Text (optional)
     - Thumbnail URL (optional)

### Contoh Penggunaan

```
# Mengirim embed kustom ke channel tertentu
/sendembed title:"Penting!" description:"Ini adalah pesan penting" color:#FF0000 channel:#general

# Mengirim embed ke channel berdasarkan ID
/sendembed title:"Info" description:"Informasi penting" channelid:123456789012345678

# Mengirim template announcement
/templateembed type:announcement content:"Server akan maintenance besok" channel:#announcements

# Mengirim quick embed ke channel tertentu
/quickembed message:"Halo semua!" channel:#general

# Broadcast embed ke multiple channels
/broadcastembed title:"Penting!" description:"Pesan untuk semua channel" channelids:123456789,987654321,456789123

# Buat embed menggunakan form Discord (Modal)
/createembed channel:#general
# Form akan muncul dengan field untuk judul, deskripsi, warna, footer, dan thumbnail
```

## 🎨 Kustomisasi

### Warna Embed
Gunakan format hex color code:
- Merah: `#FF0000`
- Biru: `#0000FF`
- Hijau: `#00FF00`
- Kuning: `#FFFF00`

### Template Types
- **Announcement**: Untuk pengumuman penting (warna merah)
- **Welcome**: Untuk menyambut member baru (warna cyan)
- **Info**: Untuk informasi umum (warna biru)
- **Warning**: Untuk peringatan (warna orange)
- **Success**: Untuk notifikasi sukses (warna hijau)

### Pilihan Channel
- **Dropdown Channel**: Pilih channel dari daftar yang tersedia
- **Channel ID**: Masukkan ID channel secara manual untuk channel yang tidak muncul di dropdown
- **Multiple Channels**: Gunakan `/broadcastembed` untuk mengirim ke beberapa channel sekaligus

### Form Discord (Modal)
- **User-Friendly Interface**: Gunakan `/createembed` untuk membuka form Discord
- **Real-time Preview**: Form memberikan interface yang lebih mudah digunakan
- **Validation**: Form otomatis memvalidasi input seperti warna hex
- **Multiple Fields**: Judul, deskripsi, warna, footer, dan thumbnail dalam satu form

## 🐛 Troubleshooting

### Bot tidak merespon slash commands
- Pastikan bot sudah diinvite dengan permission `applications.commands`
- Restart bot untuk registrasi ulang commands
- Pastikan Guild ID sudah benar di file `.env`

### Error "Missing Access"
- Pastikan bot memiliki permission `Send Messages` dan `Embed Links`
- Pastikan bot bisa mengakses channel yang dituju

### Commands tidak muncul
- Tunggu beberapa menit setelah bot online
- Pastikan menggunakan slash commands dengan `/` di awal

### Deprecation Warning
Jika muncul warning tentang `ready` event:
```
(node:xxxx) DeprecationWarning: The ready event has been renamed to clientReady...
```
- **Ini normal** dan tidak mempengaruhi fungsi bot
- Bot sudah menggunakan `clientReady` event untuk kompatibilitas
- Warning akan hilang di versi Discord.js v15
- Bot tetap berfungsi normal dengan warning ini

## 📝 License

MIT License - bebas digunakan untuk proyek pribadi maupun komersial.

## 🤝 Kontribusi

Silakan buat issue atau pull request jika ada bug atau fitur yang ingin ditambahkan.

---

**Dibuat dengan ❤️ oleh K2Blox**