const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Membuat bot mengirim pesan yang kamu tentukan')
    .addStringOption((option) =>
      option
        .setName('pesan')
        .setDescription('Pesan yang ingin dikirim oleh bot')
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('pesan');

    await interaction.reply({ content: 'Pesan terkirim ✅', flags: MessageFlags.Ephemeral });
    await interaction.channel.send(message);
  },
};
