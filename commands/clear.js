const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Menghapus sejumlah pesan terakhir di channel ini')
    .addIntegerOption((option) =>
      option.setName('jumlah').setDescription('Jumlah pesan yang ingin dihapus (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('jumlah');

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.editReply(`🧹 Berhasil menghapus **${deleted.size}** pesan.`);
    } catch (error) {
      console.error('❌ Gagal menghapus pesan:', error.message || error);
      await interaction.editReply('Gagal menghapus pesan. Pesan yang lebih tua dari 14 hari tidak bisa dihapus otomatis.');
    }
  },
};
