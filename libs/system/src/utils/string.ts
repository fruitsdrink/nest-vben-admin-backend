export function stringToNumber(value: string): number {
  try {
    return Number(value);
  } catch {
    return 0;
  }
}

export function stringToInt(value: string): number {
  try {
    return parseInt(value);
  } catch {
    return 0;
  }
}
