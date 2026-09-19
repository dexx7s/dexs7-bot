const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Menampilkan foto profil (avatar) seseorang')
    .addUserOption((option) =>
      option.setName('user').setDescription('User yang ingin dilihat avatarnya (kosongkan untuk diri sendiri)')
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Avatar ${target.username}`)
      .setImage(target.displayAvatarURL({ size: 1024, extension: 'png' }))
      .setFooter({ text: `Diminta oleh ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};
