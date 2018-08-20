export enum Direction {
  up,
  down,
}

export type ScrollListener = (
  scrollTop: number,
  direction: Direction,
  lastingLength: number,
) => void;

export class ScrollService {
  listeners = new Map<number, ScrollListener>();
  nextFreeId = 0;
  timer: any;
  lastDirection = Direction.down;
  lastPosition = 0;
  lastTurningPoint = 0;

  constructor() {
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll = (_event: UIEvent): void => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      let direction = Direction.down;

      let {scrollY} = window;

      if (scrollY < this.lastPosition) {
        direction = Direction.up;
      }

      if (direction !== this.lastDirection) {
        this.lastTurningPoint = scrollY;
      }

      let lastingLength = Math.abs(scrollY - this.lastTurningPoint);

      for (let listener of this.listeners.values()) {
        listener(scrollY, direction, lastingLength);
      }

      this.lastPosition = window.scrollY;
      this.lastDirection = direction;
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
