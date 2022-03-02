export function filterString(string: string, regex: RegExp): string {
  // Appends special characters the the end of the name
  const specChars = string.match(regex)!.join('');
  let newName = string.replaceAll(regex, '') + specChars;

  // If the name consists only of special characters, then sets it to "Unkown programmer"
  if (newName.length === specChars.length) newName = '';

  return newName;
}
