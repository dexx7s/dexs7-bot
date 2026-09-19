const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const answers = [
  'Ya, pasti.',
  'Kemungkinan besar iya.',
  'Sepertinya begitu.',
  'Tidak diragukan lagi.',
  'Coba tanya lagi nanti.',
  'Aku tidak bisa memprediksi sekarang.',
  'Fokus dan tanya lagi.',
  'Jangan berharap terlalu banyak.',
  'Jawabannya tidak jelas, coba lagi.',
  'Tidak.',
  'Sumber-sumberku bilang tidak.',
  'Kelihatannya kurang bagus.',
  'Sangat meragukan.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Tanyakan sesuatu ke bola ajaib')
    .addStringOption((option) =>
      option.setName('pertanyaan').setDescription('Pertanyaanmu').setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('pertanyaan');
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('🎱 Bola Ajaib')
      .addFields(
        { name: 'Pertanyaan', value: question },
        { name: 'Jawaban', value: `**${answer}**` }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
