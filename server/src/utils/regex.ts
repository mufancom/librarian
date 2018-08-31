export const REGEX_TITLE = /^[^\d\s]+.*$/;

export function underscoreToCamelCase(source: string): string {
  return source.replace(/\_(\w)/g, (_all, letter) => {
    return letter.toUpperCase();
  });
}

export function getMarkdownTitle(markdown: string, fallback: string): string;
export function getMarkdownTitle(markdown: string): string | undefined;
export function getMarkdownTitle(
  markdown: string,
  fallback?: string,
): string | undefined {
  markdown = markdown.trim();

  let result = markdown.match(/^\s*#+ +(.+)/);

  if (result && result.length === 2) {
    return result[1].trim();
  }

  return fallback;
}
