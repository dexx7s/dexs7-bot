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
const OWNER_NAME = "nzm.g0ne/dex7s";
const CLIENT_ID = "1199118242845827132";

function uptime(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;

  return [
    d && `${d}d`,
    h && `${h}h`,
    m && `${m}m`,
    `${s}s`
  ].filter(Boolean).join(" ");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("View information about this bot"),

  async execute(interaction) {
    await interaction.deferReply();

    const client = interaction.client;
    const owner = await client.users.fetch(OWNER_ID).catch(() => null);

    const invite =
      `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
      .setDescription(
        [
          "A lightweight Discord bot built for moderation, utility, automation, and community management.",
          "",
          "━━━━━━━━━━━━━━━━━━━━━━"
        ].join("\n")
      )
      .addFields(
        {
          name: "📦 Information",
          value:
`> **Version** : \`${BOT_VERSION}\`
> **Commands** : \`${client.commands.size}\`
> **Servers** : \`${client.guilds.cache.size}\``,
          inline: true,
        },
        {
          name: "⚡ Performance",
          value:
`> **Ping** : \`${Math.round(client.ws.ping)} ms\`
> **Uptime** : \`${uptime(client.uptime)}\`
> **Node** : \`${process.version}\``,
          inline: true,
        },
        {
          name: "👤 Developer",
          value:
`> **${OWNER_NAME}**
> ${owner ? owner.tag : "Unknown"}`,
          inline: false,
        }
      )
      .setFooter({
        text: `Powered by Dex7s • discord.js v${djsVersion}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Owner")
        .setEmoji("👤")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${OWNER_ID}`),

      new ButtonBuilder()
        .setLabel("Invite")
        .setEmoji("➕")
        .setStyle(ButtonStyle.Link)
        .setURL(invite)
    );

    await interaction.editReply({
      content:
`╭────────────────────────────
> 👑 **Owner** : **${OWNER_NAME}**
> 🤖 **Bot** : **${client.user.username}**
╰────────────────────────────`,
      embeds: [embed],
      components: [buttons],
    });
  },
};
