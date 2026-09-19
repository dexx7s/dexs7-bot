// Script untuk mendaftarkan (deploy) slash command ke Discord.
// Jalankan sekali setiap kali kamu menambah/mengubah command: node deploy-commands.js

require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('❌ DISCORD_TOKEN dan CLIENT_ID wajib diisi di file .env');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️  Command di ${filePath} tidak memiliki properti "data" atau "execute" yang diperlukan.`);
  }
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🚀 Mendaftarkan ${commands.length} slash command...`);

    let data;
    if (GUILD_ID) {
      // Deploy ke satu guild saja -> update instan, cocok untuk development
      data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log(`✅ Berhasil mendaftarkan ${data.length} command ke guild ${GUILD_ID}.`);
    } else {
      // Deploy global -> bisa dipakai di semua server, tapi update bisa memakan waktu hingga 1 jam
      data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log(`✅ Berhasil mendaftarkan ${data.length} command secara global.`);
    }
  } catch (error) {
    console.error('❌ Gagal mendaftarkan command:', error);
  }
})();
