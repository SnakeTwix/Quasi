import { usernameRegex } from '../config';
import { getName } from '../lib/getName';
import { DEvent } from '../structures/DEvent';

export default new DEvent('guildMemberAdd', (member) => {
  if (!member.manageable) return;
  const displayName = member.displayName;

  if (!usernameRegex.test(displayName)) return;

  const newName = getName(displayName, usernameRegex);
  member.setNickname(newName);
});
