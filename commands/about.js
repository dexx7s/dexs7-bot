const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version: djsVersion } = require('discord.js');

const BOT_VERSION = '1.1.0';
const OWNER_ID = '1115605327371575306';

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}h`);
  if (hours > 0) parts.push(`${hours}j`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}d`);

  return parts.join(' ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Menampilkan informasi lengkap tentang bot ini'),

  async execute(interaction) {
    const client = interaction.client;
    const owner = await client.users.fetch(OWNER_ID).catch(() => null);

    const uptime = formatUptime(client.uptime);
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const serverCount = client.guilds.cache.size;
    const commandCount = client.commands.size;
    const apiPing = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setTitle('🤖 Tentang Bot Ini')
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setDescription('Bot Discord multifungsi — command fun, moderasi, dan welcome message.')
      .addFields(
        { name: '📦 Versi Bot', value: `v${BOT_VERSION}`, inline: true },
        { name: '⚙️ discord.js', value: `v${djsVersion}`, inline: true },
        { name: '🟢 Node.js', value: process.version, inline: true },
        { name: '👑 Owner', value: owner ? `${owner.username}` : 'Tidak diketahui', inline: true },
        { name: '📡 Ping API', value: `${apiPing}ms`, inline: true },
        { name: '⏱️ Uptime', value: uptime, inline: true },
        { name: '🖥️ Server Terpasang', value: `${serverCount}`, inline: true },
        { name: '📜 Total Command', value: `${commandCount}`, inline: true },
        { name: '💾 Memori Terpakai', value: `${memoryUsage} MB`, inline: true }
      )
      .setFooter({ text: `Diminta oleh ${interaction.user.username}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Chat Owner')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${OWNER_ID}`)
        .setEmoji('💬')
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
