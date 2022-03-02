import { SlashCommandBuilder } from '@discordjs/builders';
import { modRoles } from '../../config';
import { Command } from '../../structures/Command';
import ms from 'ms';
import { Collection, TextChannel } from 'discord.js';
import { promiseWrap } from '../../lib/promiseWrap';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban user')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to ban').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason of the ban')
    )
    .addStringOption((option) =>
      option
        .setName('msg_time')
        .setDescription(
          `Messages to delete in the past [msg_time] (ex: 1d 1m 1s) default: 0ms`
        )
    )
    .setDefaultPermission(false),

  permissions: modRoles,
  async run({ interaction }) {
    const user = interaction.options.getUser('user')!;
    const { data: guildMember } = await promiseWrap(
      interaction.guild?.members.fetch(user.id)
    );

    const reason = interaction.options.getString('reason') ?? 'None';
    const duration = interaction.options.getString('msg_time') ?? '0';

    if (!guildMember?.bannable)
      return interaction.reply({
        content: `Couldn't ban ${user.tag}`,
        ephemeral: true,
      });

    const durationNum = duration
      .split(' ')
      .reduce((acc, elem) => acc + ms(elem), 0);

    if (Number.isNaN(durationNum)) {
      return interaction.reply({
        content: 'Wrong duration format!',
        ephemeral: true,
      });
    }

    console.log(guildMember.bannable);

    await interaction.guild?.members.ban(guildMember, {
      reason,
    });

    interaction.reply({
      content: `Banned ${user.tag}`,
      ephemeral: true,
    });

    // Gets all the text channels
    const channels = interaction.guild?.channels.cache.filter((channel) =>
      channel.isText()
    ) as Collection<string, TextChannel>;

    // Searches for messages from a specified user and deletes every message after deleteTime
    const deleteTime = Date.now() - durationNum;
    channels.forEach(async (channel) => {
      const messages = (
        await channel.messages.fetch({
          limit: 100,
        })
      ).filter(
        (message) =>
          message.author.id === user.id && message.createdTimestamp > deleteTime
      );

      channel.bulkDelete(messages);
    });
  },
});
