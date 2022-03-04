import { SlashCommandBuilder } from '@discordjs/builders';
import { modRoles, usernameRegex } from '../../config';
import { getName } from '../../lib/getName';
import { Command } from '../../structures/Command';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('refresh_username')
    .setDescription('Checks usernames on server '),
  async run({ interaction }) {
    const members = await interaction.guild?.members.fetch();
    if (!members) return;

    interaction.deferReply();
    await members.forEach(async (member) => {
      if (!member.manageable) return;

      const displayName = member.displayName.replaceAll(/[-_.]+/g, ' ');

      if (!usernameRegex.test(displayName)) return;

      const newName = getName(displayName, usernameRegex);
      member.setNickname(newName);
    });
  },
  permissions: modRoles,
});
