const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  version: djsVersion,
} = require("discord.js");

const BOT_VERSION = "1.1.0";
const OWNER_ID = "1115605327371575306";
const OWNER_TEXT = "nzm.g0ne/dex7s";
const BANNER_URL = "https://i.imgur.com/7SiBqJJ.png";

function formatUptime(ms) {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hour = Math.floor(ms / 3600000) % 24;
  const day = Math.floor(ms / 86400000);

  const arr = [];
  if (day) arr.push(`${day}d`);
  if (hour) arr.push(`${hour}h`);
  if (min) arr.push(`${min}m`);
  arr.push(`${sec}s`);

  return arr.join(" ");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Information about this bot"),

  async execute(interaction) {
    await interaction.deferReply();

    const client = interaction.client;
    const owner = await client.users.fetch(OWNER_ID).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor("#2B2D31")
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
      .setImage(BANNER_URL)
      .setDescription([
        "Discord Utility Bot",
        "> Handles moderation, auto responses, and a bunch of small stuff that makes running this server less annoying.",
        "> Clean • Fast • Reliable",
        "",
        `✦ Version   : \`${BOT_VERSION}\``,
        `✦ Ping      : \`${Math.round(client.ws.ping)}ms\``,
        `✦ Uptime    : \`${formatUptime(client.uptime)}\``,
        `✦ Servers   : \`${client.guilds.cache.size}\``,
        `✦ Commands  : \`${client.commands.size}\``,
        "╭────────────────────",
        `> Owner   : ${OWNER_TEXT}`,
        owner ? `> Discord : ${owner.tag}` : "",
        "╰────────────────────",
      ].filter(Boolean).join("\n"))
      .setFooter({
        text: `discord.js v${djsVersion} • Node ${process.version}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Owner")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${OWNER_ID}`)
    );

    await interaction.editReply({
      embeds: [embed],
      components: [buttons],
    });
  },
};
