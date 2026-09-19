const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Mengeluarkan member dari server')
    .addUserOption((option) => option.setName('user').setDescription('Member yang ingin dikeluarkan').setRequired(true))
    .addStringOption((option) => option.setName('alasan').setDescription('Alasan kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('alasan') || 'Tidak ada alasan diberikan';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'User tersebut tidak ditemukan di server ini.', flags: MessageFlags.Ephemeral });
    }

    if (!member.kickable) {
      return interaction.reply({ content: 'Aku tidak punya izin untuk kick user ini (role-nya lebih tinggi atau setara).', flags: MessageFlags.Ephemeral });
    }

    await member.kick(reason);
    await interaction.reply(`👢 **${target.username}** telah dikeluarkan dari server.\n> Alasan: ${reason}`);
  },
};
