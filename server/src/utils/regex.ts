export const REGEX_TITLE = /^[^\d\s]+.*$/;

export function underscoreToCamelCase(source: string): string {
  return source.replace(/\_(\w)/g, (_all, letter) => {
    return letter.toUpperCase();
  });
}
