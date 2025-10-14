# 🔧 Troubleshooting K2BLOX Discord Bot

## Masalah Umum dan Solusi

### 1. Perintah `/create_embed` Tidak Berfungsi

#### Gejala:
- Perintah tidak muncul di Discord
- Modal tidak terbuka saat perintah dijalankan
- Error di terminal saat menjalankan bot

#### Solusi:

**A. Pastikan Commands Sudah Di-deploy**
```bash
npm run deploy
```
- Tunggu hingga muncul pesan "Successfully reloaded X application commands"
- Restart bot setelah deploy

**B. Cek Permission Bot**
- Pastikan bot memiliki permission "Use Slash Commands"
- Pastikan user yang menjalankan perintah adalah Administrator
- Cek role bot di server Discord

**C. Cek Environment Variables**
```bash
npm test
```
- Pastikan semua environment variables sudah di-set dengan benar
- File `.env` harus ada dan berisi token yang valid

**D. Restart Bot**
```bash
# Stop bot (Ctrl+C)
npm start
```

### 2. Modal Tidak Terbuka

#### Gejala:
- Perintah `/create_embed` berjalan tapi modal tidak muncul
- Error "This interaction failed" di Discord
- Error "Invalid Form Body" dengan kode 50035

#### Solusi:

**A. Cek Discord.js Version**
```bash
npm list discord.js
```
- Pastikan menggunakan Discord.js v14.14.1 atau lebih baru

**B. Cek Bot Intents**
- Pastikan bot memiliki "Message Content Intent" di Developer Portal
- Restart bot setelah mengubah intents

**C. Cek Console Log**
- Jalankan bot dan lihat error di console
- Pastikan tidak ada error saat bot startup

**D. Error "Invalid Form Body" (50035)**
- Error ini terjadi jika modal memiliki lebih dari 5 ActionRow
- Error ini juga terjadi jika komponen dalam satu ActionRow melebihi batas lebar
- Sudah diperbaiki di versi terbaru dengan struktur yang benar
- Pastikan menggunakan versi terbaru dari bot

**E. Error "COMPONENT_LAYOUT_WIDTH_EXCEEDED"**
- Error ini terjadi jika total lebar komponen dalam satu ActionRow > 5
- TextInput Short = 1 width, TextInput Paragraph = 2 width
- Sudah diperbaiki dengan memisahkan komponen yang lebar

**F. Error "ExpectedConstraintError: s.number().lessThanOrEqual()"**
- Error ini terjadi jika setMaxLength() > 4000
- Discord membatasi TextInput maksimal 4000 karakter
- Sudah diperbaiki dengan mengatur setMaxLength(4000)

### 3. Error Saat Mengirim Embed

#### Gejala:
- Modal terbuka tapi embed tidak terkirim
- Error "Channel not found" atau "Missing permissions"

#### Solusi:

**A. Validasi Channel ID**
- Pastikan Channel ID benar (bukan nama channel)
- Channel ID adalah angka panjang (contoh: 123456789012345678)
- Cara mendapatkan Channel ID: Klik kanan channel → Copy ID

**B. Cek Permission Bot**
- Bot harus memiliki permission "Send Messages" di channel tujuan
- Bot harus memiliki permission "Embed Links"

**C. Validasi Input**
- Pastikan Channel ID tidak kosong
- URL thumbnail dan image harus valid
- Warna hex harus format yang benar (#RRGGBB)

### 4. Bot Tidak Online

#### Gejala:
- Bot tidak muncul di member list Discord
- Error "Invalid token" di console

#### Solusi:

**A. Cek Token Bot**
- Pastikan token di file `.env` benar
- Token tidak boleh ada spasi atau karakter tambahan
- Regenerate token di Developer Portal jika perlu

**B. Cek Internet Connection**
- Pastikan koneksi internet stabil
- Coba restart router jika perlu

**C. Cek Discord Status**
- Kunjungi https://status.discord.com/
- Pastikan Discord tidak sedang maintenance

### 5. Commands Tidak Muncul

#### Gejala:
- Slash commands tidak muncul di Discord
- Error saat deploy commands

#### Solusi:

**A. Deploy Ulang Commands**
```bash
npm run deploy
```

**B. Tunggu Sinkronisasi**
- Commands membutuhkan waktu 5-10 menit untuk muncul
- Restart Discord client jika perlu

**C. Cek Guild vs Global Commands**
- Commands di-deploy secara global
- Pastikan bot ada di server yang sama

## 🧪 Testing Commands

### Test Konfigurasi
```bash
npm test
```

### Test Bot Startup
```bash
npm start
# Lihat output di console
```

### Test Deploy Commands
```bash
npm run deploy
# Pastikan tidak ada error
```

## 📋 Checklist Troubleshooting

- [ ] Bot token valid dan benar
- [ ] Bot sudah di-invite ke server dengan permission yang tepat
- [ ] Commands sudah di-deploy (`npm run deploy`)
- [ ] Bot online dan tidak ada error di console
- [ ] User yang menjalankan perintah adalah Administrator
- [ ] Channel ID yang dimasukkan benar
- [ ] Bot memiliki permission di channel tujuan
- [ ] Discord.js version terbaru (v14.14.1+)

## 🆘 Jika Masih Bermasalah

1. **Cek Console Log**
   - Jalankan `npm start` dan lihat error yang muncul
   - Screenshot error message untuk debugging

2. **Test di Server Baru**
   - Buat server Discord baru untuk testing
   - Invite bot dengan permission lengkap

3. **Regenerate Token**
   - Di Developer Portal, regenerate bot token
   - Update file `.env` dengan token baru

4. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Cek Discord.js Documentation**
   - Kunjungi https://discord.js.org/
   - Cek changelog untuk breaking changes

## 📞 Bantuan Lebih Lanjut

Jika masalah masih berlanjut:
1. Screenshot error message
2. Copy console log yang relevan
3. Deskripsikan langkah-langkah yang sudah dicoba
4. Sertakan versi Node.js dan Discord.js yang digunakan
