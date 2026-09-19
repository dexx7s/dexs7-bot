const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const VERSION = "1.1.0";
const OWNER = "nzm.g0ne/dex7s";
const OWNER_ID = "1115605327371575306";
const CLIENT_ID = "1199118242845827132";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Informasi mengenai bot."),

  async execute(interaction) {
    const c = interaction.client;

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setAuthor({
        name: "DEXS-S7 BOT",
        iconURL: c.user.displayAvatarURL()
      })
      .setDescription(
`Bot utilitas Discord yang dibuat untuk membantu pengelolaan server dengan fitur yang ringan dan mudah digunakan.`)
      .addFields(
        {
          name: "Information",
          value:
`Version
\`${VERSION}\`

Commands
\`${c.commands.size}\`

Servers
\`${c.guilds.cache.size}\``,
          inline: true
        },
        {
          name: "Status",
          value:
`Ping
\`${Math.round(c.ws.ping)} ms\`

Node
\`${process.version}\`

Developer
\`${OWNER}\``,
          inline: true
        }
      )
      .setFooter({
        text: "Powered by Dex7s"
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Owner")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${OWNER_ID}`),

      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
