const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Kirim meme random dari Reddit'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch('https://meme-api.com/gimme');

      if (!response.ok) {
        throw new Error(`API mengembalikan status ${response.status}`);
      }

      const data = await response.json();

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(data.title || 'Meme')
        .setImage(data.url)
        .setFooter({ text: `r/${data.subreddit}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Gagal mengambil meme:', error.message || error);
      await interaction.editReply({
        content: 'Gagal mengambil meme sekarang, coba lagi beberapa saat lagi ya.',
      });
    }
  },
};
