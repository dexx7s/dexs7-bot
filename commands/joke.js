const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const jokes = [
  'Kenapa programmer suka gelap? Karena mereka takut bug!',
  'Kenapa komputer kedinginan? Karena lupa nutup windows-nya.',
  'Apa bedanya kamu sama WiFi? Kamu nggak connect ke hatiku.',
  'Kenapa laptop nggak bisa nangis? Karena dia cuma punya notebook, bukan tearbook.',
  'Ada anak sekolah nanya ke guru, "Bu, kenapa 6 takut 7?" Gurunya bingung. "Karena 7 8 9!" (seven ate nine)',
  'Kenapa hantu suka pakai Discord? Biar bisa jadi online invisible.',
  'Programmer paling benci hari apa? Hari-hari nge-debug tanpa hasil.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Kirim lelucon receh biar ga garing'),

  async execute(interaction) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('😂 Lelucon Receh')
      .setDescription(joke);

    await interaction.reply({ embeds: [embed] });
  },
};
