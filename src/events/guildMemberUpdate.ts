import { DEvent } from '../structures/DEvent';
import { usernameRegex } from '../config';
import { getName } from '../lib/getName';

export default new DEvent('guildMemberUpdate', (oldMember, newMember) => {
  // ?: If the bot doesn't have enough permissions
  //  to change someone's nickname, it crashes

  const displayName = newMember.displayName;

  if (!usernameRegex.test(displayName)) return;

  const newName = getName(displayName, usernameRegex);
  newMember.setNickname(newName);
});
