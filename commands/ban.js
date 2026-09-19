const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Mem-banned member dari server')
    .addUserOption((option) => option.setName('user').setDescription('Member yang ingin di-ban').setRequired(true))
    .addStringOption((option) => option.setName('alasan').setDescription('Alasan ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('alasan') || 'Tidak ada alasan diberikan';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({ content: 'Aku tidak punya izin untuk ban user ini (role-nya lebih tinggi atau setara).', flags: MessageFlags.Ephemeral });
    }

    await interaction.guild.members.ban(target.id, { reason });
    await interaction.reply(`🔨 **${target.username}** telah di-ban dari server.\n> Alasan: ${reason}`);
  },
};
