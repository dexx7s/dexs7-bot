const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cek apakah bot masih hidup dan berapa latensinya'),

  async execute(interaction) {
    await interaction.deferReply();

    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong!\n> Latensi Bot: **${latency}ms**\n> Latensi API Discord: **${apiLatency}ms**`
    );
  },
};
