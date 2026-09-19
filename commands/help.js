const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Menampilkan daftar perintah yang tersedia'),

  async execute(interaction) {
    await interaction.deferReply();

    const commands = interaction.client.commands;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📖 Daftar Perintah')
      .setDescription('Berikut adalah semua perintah yang bisa kamu gunakan:')
      .setTimestamp()
      .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

    for (const [name, command] of commands) {
      embed.addFields({
        name: `/${name}`,
        value: command.data.description || 'Tidak ada deskripsi.',
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
