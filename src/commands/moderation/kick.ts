import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../../structures/Command';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to kick').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason to kick user')
    )
    .setDefaultPermission(false),
  async run({ interaction }) {
    const user = interaction.options.getUser('user')!;
    const guildMember = await interaction.guild?.members.fetch(user.id);
    const reason = (await interaction.options.getString('reason')) || '';

    if (!guildMember?.kickable)
      return interaction.reply({
        content: `Can't kick ${user.tag}`,
        ephemeral: true,
      });

    await guildMember.kick(reason).catch(() => {
      interaction.reply({
        content: `Couldn't kick ${user.tag}`,
        ephemeral: true,
      });
    });

    interaction.reply({
      content: `Kicked ${user.tag}`,
      ephemeral: true,
    });
  },
});
