import { filterString } from '../lib/filterString';
import { DEvent } from '../structures/DEvent';

export default new DEvent('guildMemberUpdate', (oldMember, newMember) => {
  // ?: If the bot doesn't have enough permissions
  //  to change someone's nickname, it crashes

  const usernameRegex = /[!-/:-@\[-`]+/g;
  const displayName = newMember.displayName;

  if (!usernameRegex.test(displayName)) return;

  const newName = filterString(newMember.displayName, usernameRegex);

  newMember.setNickname(newName || 'Unknown Programmer');
});
