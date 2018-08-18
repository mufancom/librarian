export function filterHTMLTags(html: string) {
  return html.replace(/<[^>]*>/g, '');
}
