export function filterHTMLTags(html: string) {
  return html.replace(/<[^>]*>/g, '');
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
