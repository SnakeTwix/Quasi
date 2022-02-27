import { DEvent } from '../structures/DEvent';

export default new DEvent('ready', (interaction) => {
  console.log('Bot ready!');
});
