import { DEvent } from '../structures/DEvent';
import { usernameRegex } from '../config';
import { getName } from '../lib/getName';

export default new DEvent('guildMemberUpdate', (oldMember, newMember) => {
  if (!newMember.manageable) return;
  const displayName = newMember.displayName;

  if (!usernameRegex.test(displayName)) return;

  const newName = getName(displayName, usernameRegex);
  newMember.setNickname(newName);
});
