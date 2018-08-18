export function collapse(element: HTMLElement, position: number): void {
  let selection = window.getSelection();
  selection.collapse(element.firstChild!, position);
}

export function collapseToEnd(element: HTMLElement): void {
  let {nodeValue} = element.firstChild!;

  collapse(element, nodeValue!.length);
}
