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
const OWNER_DISCORD = "dexx7s";
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
    const sentMsg = await interaction.fetchReply();
    const roundTripPing = sentMsg.createdTimestamp - interaction.createdTimestamp;
    const wsPing = Math.round(client.ws.ping);
    const ping = wsPing > 0 ? wsPing : roundTripPing;

    const embed = new EmbedBuilder()
      .setColor("#2B2D31")
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(BANNER_URL)
      .setDescription("Discord utility bot for moderation, automation, and server management.")
      .addFields(
        { name: "Version", value: BOT_VERSION, inline: true },
        { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "Commands", value: `${client.commands.size}`, inline: true },
        { name: "Ping", value: `${ping}ms`, inline: true },
        { name: "Uptime", value: formatUptime(client.uptime), inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Owner", value: `${OWNER_TEXT} (${OWNER_DISCORD})`, inline: false }
      )
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
