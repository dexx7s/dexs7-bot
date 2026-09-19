require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, MessageFlags } = require('discord.js');

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN belum diisi. Salin .env.example menjadi .env lalu isi tokennya.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️  Command di ${filePath} tidak memiliki properti "data" atau "execute" yang diperlukan.`);
  }
}

client.once('clientReady', () => {
  console.log(`✅ Bot berhasil login sebagai ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: '/help', type: 3 }],
    status: 'online',
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Tidak ditemukan command bernama ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Terjadi error saat menjalankan /${interaction.commandName}:`, error.message || error);

    if (error.code === 10062) {
      console.warn('⚠️  Interaction expired sebelum bot sempat merespons (koneksi/latensi terlalu lambat).');
      return;
    }

    try {
      const errorMessage = { content: 'Terjadi kesalahan saat menjalankan perintah ini.', flags: MessageFlags.Ephemeral };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (followUpError) {
      console.error('❌ Gagal mengirim pesan error ke user:', followUpError.message || followUpError);
    }
  }
});

process.on('unhandledRejection', (error) => {
  console.error('⚠️  Unhandled promise rejection (bot tetap jalan):', error.message || error);
});

client.login(DISCORD_TOKEN);
