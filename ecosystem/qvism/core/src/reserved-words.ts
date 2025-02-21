const reservedWords = new Set(["switch"]);

function isReservedWord(str: string) {
  return reservedWords.has(str);
}

export function escapeReservedWord(str: string) {
  if (!isReservedWord(str)) {
    return str;
  }

  return `${str}Style`;
}
