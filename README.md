# K2BLOX Discord Bot

Bot Discord modern dengan fitur testimoni interaktif, pesan melekat, dan pembuat embed kustom menggunakan Discord.js v14.

## 🚀 Fitur

### 1. Sistem Testimoni/Review Interaktif
- **Perintah**: `/setup_review` (Admin Only)
- **Fungsi**: Mengatur sistem review dengan tombol interaktif
- **Fitur**:
  - Tombol "Buat Ulasan" yang membuka modal
  - Input rating 1-5 dengan validasi
  - Input ulasan detail (maksimal 1000 karakter)
  - Embed hasil review dengan bintang dan foto profil pengguna

### 2. Pesan Melekat (Sticky Message)
- **Perintah**: `/stick` (Admin Only)
  - `set`: Atur pesan melekat di channel
  - `remove`: Hapus pesan melekat dari channel
- **Fitur**:
  - Pesan otomatis muncul di bawah setiap pesan baru
  - Cooldown 5 detik untuk mencegah spam
  - Hapus otomatis pesan sticky lama

### 3. Pembuat Embed Kustom
- **Perintah**: `/create_embed` (Admin Only)
- **Fitur**:
  - **Dropdown channel selection** - Pilih channel tanpa perlu ID
  - **Dukungan gambar** - Thumbnail dan image URL
  - **Form Discord asli** - Menggunakan ModalBuilder yang benar
  - **User-friendly interface** - Proses 2 langkah yang mudah
  - **Validasi lengkap** - URL, color, dan input validation
  - **Branding otomatis** - K2BLOX author & footer otomatis

## 📋 Persyaratan

- Node.js 16.9.0 atau lebih baru
- Discord Bot Token
- Discord Application Client ID
- Guild ID (opsional, untuk testing)

## 🛠️ Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd k2blox-botdiscord
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   - Copy `env.example` menjadi `.env`
   - Isi dengan token dan ID yang diperlukan:
   ```env
   DISCORD_TOKEN=YourBotTokenHere
   CLIENT_ID=YourClientIdHere
   GUILD_ID=YourGuildIdHere
   ```

4. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

5. **Jalankan bot**
   ```bash
   npm start
   ```

## 🔧 Konfigurasi

### Bot Permissions
Bot memerlukan permission berikut:
- `Send Messages`
- `Use Slash Commands`
- `Embed Links`
- `Read Message History`
- `Manage Messages` (untuk sticky message)

### Environment Variables
- `DISCORD_TOKEN`: Token bot Discord (wajib)
- `CLIENT_ID`: Client ID aplikasi Discord (wajib)
- `GUILD_ID`: Guild ID untuk testing (opsional)

## 📁 Struktur Proyek

```
k2blox-botdiscord/
├── commands/           # Perintah slash
│   ├── setup_review.js
│   ├── stick.js
│   └── create_embed.js
├── events/             # Event handlers
│   ├── ready.js
│   ├── interactionCreate.js
│   └── messageCreate.js
├── config.js          # Konfigurasi bot
├── index.js           # File utama
├── deploy-commands.js # Deploy slash commands
├── package.json       # Dependencies
├── env.example        # Template environment
├── .gitignore         # Git ignore rules
└── README.md          # Dokumentasi
```

## 🎯 Penggunaan

### Setup Review System
1. Jalankan `/setup_review #channel-review`
2. Bot akan mengirim embed dengan tombol "Buat Ulasan"
3. Pengguna klik tombol dan isi form review
4. Review akan muncul sebagai embed dengan rating bintang

### Sticky Message
1. Atur: `/stick set #channel "Pesan penting"`
2. Hapus: `/stick remove #channel`
3. Pesan akan otomatis muncul di bawah setiap pesan baru

### Custom Embed
1. **Jalankan perintah**: `/create_embed`
2. **Pilih channel** dari dropdown yang muncul
3. **Form Discord akan muncul** dengan 5 field input:
   - Judul Embed (opsional)
   - Deskripsi Embed (opsional)
   - Warna Hex (opsional)
   - Thumbnail URL (opsional)
   - Image URL (opsional)
4. **Submit form** untuk mengirim embed

## 🔒 Keamanan

- Token bot disimpan di environment variables
- Perintah admin hanya bisa diakses oleh administrator
- Validasi input untuk mencegah error
- Error handling yang komprehensif

## 🐛 Troubleshooting

### Bot tidak merespons
- Pastikan token bot valid
- Cek permission bot di server
- Pastikan slash commands sudah di-deploy

### Slash commands tidak muncul
- Jalankan `npm run deploy`
- Tunggu beberapa menit untuk sinkronisasi
- Restart bot jika perlu

### Sticky message tidak bekerja
- Pastikan bot memiliki permission "Manage Messages"
- Cek apakah ada pesan sticky di channel tersebut

## 📝 Changelog

### v1.0.0
- Sistem review interaktif dengan modal
- Pesan melekat dengan cooldown
- Pembuat embed kustom
- Branding K2BLOX otomatis
- Error handling lengkap

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim

- **K2BLOX** - *Development* - [K2BLOX](https://github.com/k2blox)

## 🙏 Acknowledgments

- Discord.js team untuk library yang luar biasa
- Komunitas Discord untuk feedback dan saran
