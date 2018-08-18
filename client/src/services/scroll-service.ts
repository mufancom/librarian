type ScrollListener = (scrollTop: number) => void;

export class ScrollService {
  listeners = new Map<number, ScrollListener>();
  nextFreeId = 0;
  timer: any;

  constructor() {
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll = (_event: UIEvent): void => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      for (let listener of this.listeners.values()) {
        listener(window.scrollY);
      }
    }, 10);
  };

  addListener(listener: ScrollListener): number {
    let thisId = this.nextFreeId;

    this.listeners.set(thisId, listener);

    this.nextFreeId++;

    return thisId;
  }

  removeListener(id: number): boolean {
    return this.listeners.delete(id);
  }
}
