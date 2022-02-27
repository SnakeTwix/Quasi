import { filterString } from './filterString';

export function getName(nickname: string, regex: RegExp): string {
  // If the string is empty, sets it to Unknown Programmer
  const newName = filterString(nickname, regex) || 'Unknown Programmer';

  return newName;
}
