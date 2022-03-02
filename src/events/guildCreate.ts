import { usernameRegex } from '../config';
import { getName } from '../lib/getName';
import { DEvent } from '../structures/DEvent';

export default new DEvent('guildCreate', async (guild) => {
  const members = await guild.members.fetch().catch((e) => console.error(e));

  if (!members) return;

  members.forEach((member) => {
    if (!member.manageable) return;
    const displayName = member.displayName;

    if (!usernameRegex.test(displayName)) return;

    const newName = getName(displayName, usernameRegex);
    member.setNickname(newName);
  });
});
