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
    await interaction.deferReply();

    const client = interaction.client;
    const owner = await client.users.fetch(OWNER_ID).catch(() => null);

    const uptime = formatUptime(client.uptime);
    const serverCount = client.guilds.cache.size;
    const commandCount = client.commands.size;
    const apiPing = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setDescription(
        [
          'Bot Discord multifungsi untuk fun, moderasi, dan welcome message.',
          '',
          `Versi ${BOT_VERSION} • Ping ${apiPing}ms • Uptime ${uptime}`,
          `Server ${serverCount} • Command ${commandCount}`,
        ].join('\n')
      )
      .setFooter({ text: `discord.js v${djsVersion} • Node ${process.version}` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Chat Owner')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${OWNER_ID}`)
    );

    await interaction.editReply({
      content: owner ? `Owner: ${owner.username}` : null,
      embeds: [embed],
      components: [row],
    });
  },
};
