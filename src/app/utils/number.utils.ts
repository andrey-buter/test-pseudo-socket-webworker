export function hasFloatPrecision(strFloat: string, precision: number) {
  const regexPattern = new RegExp(`^\\d+\\.\\d{${precision}}$`);
  return regexPattern.test(strFloat);
}
