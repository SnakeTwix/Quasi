export function filterString(nickname: string, regex: RegExp): string {
  // Appends special characters the the end of the name
  const specChars = nickname.match(regex)!.join('');
  let newName = nickname.replaceAll(regex, '') + specChars;

  // If the name consists only of special characters, then sets it to "Unkown programmer"
  if (newName.length === specChars.length) newName = '';

  return newName;
}
