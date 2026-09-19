# Simple Discord Bot

Bot Discord sederhana berbasis Node.js dan [discord.js](https://discord.js.org/) v14, dengan tiga slash command dasar: `/ping`, `/help`, dan `/say`.

## 📁 Struktur Proyek

```
discord-bot/
├── commands/
│   ├── help.js
│   ├── ping.js
│   └── say.js
├── .env.example
├── .gitignore
├── deploy-commands.js
├── index.js
├── package.json
└── README.md
```

## ✅ Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- Akun Discord + akses ke [Discord Developer Portal](https://discord.com/developers/applications)

## 🚀 Cara Menjalankan

### 1. Ekstrak dan install dependency

```bash
cd discord-bot
npm install
```

### 2. Buat aplikasi bot di Discord

1. Buka https://discord.com/developers/applications → **New Application**
2. Buka tab **Bot** → klik **Reset Token** → salin token yang muncul (ini `DISCORD_TOKEN`)
3. Di tab **General Information**, salin **Application ID** (ini `CLIENT_ID`)
4. (Opsional, untuk development) Buka server Discord kamu → klik kanan nama server → **Copy Server ID** (ini `GUILD_ID`). Pastikan mode developer aktif di Discord (Settings → Advanced → Developer Mode).

### 3. Siapkan file environment

Salin `.env.example` menjadi `.env`, lalu isi nilainya:

```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=token_bot_asli_kamu
CLIENT_ID=application_id_kamu
GUILD_ID=server_id_kamu   # opsional, kosongkan untuk deploy global
```

> ⚠️ **Jangan pernah membagikan `.env` atau token bot asli.** File `.env` sudah masuk `.gitignore`.

### 4. Undang bot ke server

Buat URL undangan di tab **OAuth2 → URL Generator**:
- Scopes: `bot`, `applications.commands`
- Bot Permissions: minimal `Send Messages`, `Use Slash Commands`, `Embed Links`

Buka URL yang dihasilkan, pilih server, lalu klik **Authorize**.

### 5. Deploy slash command

Jalankan sekali (dan setiap kali menambah/mengubah command):

```bash
node deploy-commands.js
```

- Jika `GUILD_ID` diisi → command langsung muncul di server itu.
- Jika `GUILD_ID` dikosongkan → command dideploy global (bisa butuh waktu hingga ±1 jam untuk muncul).

### 6. Jalankan bot

```bash
node index.js
```

Jika berhasil, akan muncul log seperti:

```
✅ Bot berhasil login sebagai NamaBot#1234
```

## 🧩 Daftar Perintah

| Command       | Deskripsi                                              |
|---------------|----------------------------------------------------------|
| `/ping`       | Mengecek apakah bot aktif dan menampilkan latensi        |
| `/help`       | Menampilkan daftar semua perintah yang tersedia          |
| `/say <pesan>`| Membuat bot mengirim pesan sesuai teks yang kamu masukkan |

## ➕ Menambah Command Baru

1. Buat file baru di folder `commands/`, misalnya `commands/hello.js`
2. Ikuti pola yang sama seperti `commands/ping.js` (ekspor `data` dan `execute`)
3. Jalankan ulang `node deploy-commands.js` agar command baru terdaftar di Discord
4. Restart bot dengan `node index.js`

## 🛠️ Troubleshooting

- **"Used disallowed intents"** → pastikan intent yang diaktifkan di kode sesuai dengan yang diizinkan di Developer Portal (tab **Bot**).
- **Command tidak muncul di Discord** → pastikan sudah menjalankan `node deploy-commands.js`, dan tunggu beberapa menit jika deploy global.
- **`DISCORD_TOKEN belum diisi`** → pastikan file `.env` sudah dibuat dan berisi token yang benar (bukan `.env.example`).

## 📄 Lisensi

MIT — bebas digunakan dan dimodifikasi.
