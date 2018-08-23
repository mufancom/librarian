export function collapse(element: HTMLElement, position: number): void {
  let selection = window.getSelection();
  selection.collapse(element.firstChild!, position);
}

export function collapseToEnd(element: HTMLElement): void {
  let {nodeValue} = element.firstChild!;

  collapse(element, nodeValue!.length);
}

export const fadeInUpAnimation = {
  from: {
    transform: 'translateY(+50px)',
    opacity: '0',
  },
  to: {
    transform: 'none',
    opacity: '1',
  },
};

export const fadeOutDownAnimation = {
  from: {
    opacity: '1',
  },
  to: {
    transform: 'translateY(+50px)',
    opacity: '0',
  },
};
