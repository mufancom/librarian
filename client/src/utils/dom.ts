export function collapse(element: HTMLElement, position: number) {
  let selection = window.getSelection();
  selection.collapse(element.firstChild!, position);
}

export function collapseToEnd(element: HTMLElement) {
  let {nodeValue} = element.firstChild!;

  collapse(element, nodeValue!.length);
}
