const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Membisukan (timeout) member untuk beberapa menit')
    .addUserOption((option) => option.setName('user').setDescription('Member yang ingin di-mute').setRequired(true))
    .addIntegerOption((option) =>
      option.setName('menit').setDescription('Durasi mute dalam menit (default 10)').setMinValue(1).setMaxValue(40320)
    )
    .addStringOption((option) => option.setName('alasan').setDescription('Alasan mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const minutes = interaction.options.getInteger('menit') || 10;
    const reason = interaction.options.getString('alasan') || 'Tidak ada alasan diberikan';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'User tersebut tidak ditemukan di server ini.', flags: MessageFlags.Ephemeral });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: 'Aku tidak punya izin untuk mute user ini (role-nya lebih tinggi atau setara).', flags: MessageFlags.Ephemeral });
    }

    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply(`🔇 **${target.username}** di-mute selama **${minutes} menit**.\n> Alasan: ${reason}`);
  },
};
