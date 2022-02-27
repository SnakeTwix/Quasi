import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..';
import { DEvent } from '../structures/DEvent';
import { ExtendedInteraction } from '../typings/Command';

export default new DEvent('interactionCreate', (interaction) => {
  // Execute Commands
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    command.run({
      client,
      interaction: interaction as ExtendedInteraction,
      args: interaction.options as CommandInteractionOptionResolver,
    });
  }
});
