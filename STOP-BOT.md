# 🛑 Cara Menghentikan Bot K2BLOX

## Metode 1: Keyboard Interrupt (Cara Normal)

Jika bot sedang berjalan di terminal:
```bash
# Tekan Ctrl+C di terminal tempat bot berjalan
Ctrl + C
```

## Metode 2: Task Manager (Windows)

1. Buka **Task Manager** (Ctrl + Shift + Esc)
2. Cari proses **Node.js** atau **node.exe**
3. Klik kanan → **End Task**

## Metode 3: Command Line

### Menghentikan Semua Proses Node.js
```bash
# Windows Command Prompt
taskkill /f /im node.exe

# PowerShell
Get-Process -Name "node" | Stop-Process -Force
```

### Menghentikan Proses Spesifik
```bash
# Cari PID proses bot
tasklist | findstr node

# Hentikan dengan PID
taskkill /f /pid [PID_NUMBER]
```

## Metode 4: PowerShell Script

Buat file `stop-bot.ps1`:
```powershell
# Hentikan semua proses Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Verifikasi
if (Get-Process -Name "node" -ErrorAction SilentlyContinue) {
    Write-Host "Masih ada proses Node.js yang berjalan" -ForegroundColor Red
} else {
    Write-Host "Bot berhasil dihentikan" -ForegroundColor Green
}
```

Jalankan dengan:
```bash
powershell -ExecutionPolicy Bypass -File stop-bot.ps1
```

## Verifikasi Bot Sudah Mati

### Cek Proses Node.js
```bash
# Command Prompt
tasklist | findstr node

# PowerShell
Get-Process -Name "node" -ErrorAction SilentlyContinue
```

### Cek Koneksi Discord
```bash
# Cek koneksi ke Discord API
netstat -ano | findstr :443
```

### Cek Port Bot (jika menggunakan port khusus)
```bash
# Cek port yang digunakan bot
netstat -ano | findstr :3000
```

## Troubleshooting

### Bot Tidak Bisa Dihentikan
1. **Gunakan Force Kill**:
   ```bash
   taskkill /f /im node.exe
   ```

2. **Restart Komputer** (cara terakhir)

3. **Cek Process Tree**:
   ```bash
   wmic process where "name='node.exe'" get processid,parentprocessid,commandline
   ```

### Bot Restart Otomatis
- Cek apakah ada **PM2** atau **nodemon** yang berjalan
- Cek **Windows Service** yang mungkin menjalankan bot
- Cek **Task Scheduler** untuk task otomatis

### Error "Access Denied"
- Jalankan Command Prompt sebagai **Administrator**
- Gunakan PowerShell dengan **Run as Administrator**

## Status Bot

### Bot Online
- Bot muncul di member list Discord
- Console menampilkan log aktivitas
- Perintah slash tersedia

### Bot Offline
- Bot tidak muncul di member list Discord
- Console tidak menampilkan log
- Perintah slash tidak tersedia

## Menjalankan Bot Kembali

Setelah bot dihentikan, untuk menjalankan kembali:
```bash
npm start
```

## Catatan Penting

- ⚠️ **Jangan** mematikan bot saat sedang memproses data penting
- 💾 **Simpan** perubahan kode sebelum mematikan bot
- 🔄 **Restart** bot secara berkala untuk performa optimal
- 📝 **Log** aktivitas bot sebelum mematikan untuk debugging

## Emergency Stop

Jika bot tidak responsif atau error:
1. **Force Kill** semua proses Node.js
2. **Restart** komputer jika perlu
3. **Cek** log error untuk debugging
4. **Update** dependencies jika ada masalah
