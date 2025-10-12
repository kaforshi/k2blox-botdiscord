# 🔧 Troubleshooting Guide

Panduan mengatasi masalah umum pada K2Blox Discord Bot.

## ❌ Error: "Used disallowed intents"

### 🎯 **Penyebab:**
Bot menggunakan privileged intents yang belum diaktifkan di Discord Developer Portal.

### ✅ **Solusi:**

#### **Opsi 1: Aktifkan Privileged Intents (Recommended)**
1. Pergi ke [Discord Developer Portal](https://discord.com/developers/applications)
2. Pilih aplikasi bot Anda
3. Pergi ke tab **"Bot"**
4. Scroll ke bawah ke bagian **"Privileged Gateway Intents"**
5. Aktifkan:
   - ✅ **SERVER MEMBERS INTENT** (untuk welcome system)
   - ✅ **MESSAGE CONTENT INTENT** (untuk message content)
6. Klik **"Save Changes"**
7. Restart bot

#### **Opsi 2: Gunakan Minimal Intents**
Jika tidak bisa mengaktifkan privileged intents:

```bash
npm run start:minimal
```

**Catatan:** Beberapa fitur akan terbatas:
- Welcome system mungkin tidak berfungsi penuh
- Message content features terbatas

## ❌ Error: "Invalid token"

### 🎯 **Penyebab:**
Token Discord bot tidak valid atau salah.

### ✅ **Solusi:**
1. Cek file `.env`
2. Pastikan `DISCORD_TOKEN` benar
3. Regenerate token di Discord Developer Portal jika perlu
4. Pastikan tidak ada spasi atau karakter tambahan

## ❌ Error: "Missing permissions"

### 🎯 **Penyebab:**
Bot tidak memiliki permission yang diperlukan.

### ✅ **Solusi:**
1. Invite bot dengan permission yang benar:
   - Administrator (recommended)
   - Atau permissions spesifik:
     - Send Messages
     - Manage Messages
     - Ban Members
     - Kick Members
     - Connect (untuk music)
     - Speak (untuk music)

## ❌ Commands tidak muncul

### 🎯 **Penyebab:**
Slash commands belum terdaftar atau masih propagating.

### ✅ **Solusi:**

#### **Dengan GUILD_ID (Instant):**
```env
GUILD_ID=your_guild_id_here
```

#### **Tanpa GUILD_ID (Global):**
- Tunggu hingga 1 jam
- Restart bot
- Cek console untuk error

## ❌ Music tidak berfungsi

### 🎯 **Penyebab:**
Bot tidak bisa join voice channel atau music features disabled.

### ✅ **Solusi:**
1. **Cek permissions:**
   - Bot perlu permission "Connect" dan "Speak"
   - User perlu di voice channel

2. **Cek konfigurasi:**
   ```bash
   /config
   ```
   - Pastikan music channel sudah diset
   - Pastikan YouTube/Spotify enabled

3. **Cek Spotify API:**
   - Pastikan `SPOTIFY_CLIENT_ID` dan `SPOTIFY_CLIENT_SECRET` benar
   - Spotify API optional, YouTube tetap berfungsi

## ❌ Database error

### 🎯 **Penyebab:**
SQLite database tidak bisa dibuat atau diakses.

### ✅ **Solusi:**
1. **Cek permissions folder:**
   - Pastikan bot bisa write ke folder project
   - Cek file `database.sqlite` permissions

2. **Delete dan recreate:**
   ```bash
   rm database.sqlite
   npm start
   ```

## ❌ Spotify API error

### 🎯 **Penyebab:**
Spotify API credentials salah atau expired.

### ✅ **Solusi:**
1. **Cek credentials:**
   - Pastikan `SPOTIFY_CLIENT_ID` dan `SPOTIFY_CLIENT_SECRET` benar
   - Regenerate di [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

2. **Disable Spotify:**
   ```bash
   /config
   ```
   - Toggle Spotify off
   - YouTube tetap berfungsi

## ❌ Bot tidak respond

### 🎯 **Penyebab:**
Bot offline atau ada error di code.

### ✅ **Solusi:**
1. **Cek status bot:**
   ```bash
   /ping
   ```

2. **Cek console logs:**
   - Lihat terminal untuk error messages
   - Cek network connection

3. **Restart bot:**
   ```bash
   Ctrl+C
   npm start
   ```

## 🔍 Debug Mode

### **Enable verbose logging:**
```bash
DEBUG=* npm start
```

### **Check bot permissions:**
```bash
/ping
```

### **Test basic functionality:**
```bash
/help
/config
```

## 📞 Still Having Issues?

1. **Check logs** di terminal
2. **Verify environment variables** di `.env`
3. **Test dengan minimal intents:**
   ```bash
   npm run start:minimal
   ```
4. **Create issue** di GitHub dengan:
   - Error message lengkap
   - Steps to reproduce
   - Environment info

## 🎯 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Intents error | `npm run start:minimal` |
| Token error | Regenerate token |
| Permissions error | Re-invite bot with Admin |
| Commands not showing | Wait 1 hour or use GUILD_ID |
| Music not working | Check voice permissions |
| Database error | Delete database.sqlite |

---

**Need more help? Check the main README.md or create an issue! 🚀**
