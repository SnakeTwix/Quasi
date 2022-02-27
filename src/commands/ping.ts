import { Command } from '../structures/Command';

export default new Command({
  name: 'ping',
  description: 'Replies with pong!',
  run({ interaction }) {
    interaction.reply('Pong!');
  },
});
