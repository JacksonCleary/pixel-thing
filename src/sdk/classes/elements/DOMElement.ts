// DOMElement.ts
export abstract class DOMElement<T extends HTMLElement> {
  protected element: T;
  protected eventListeners: { type: string; handler: EventListener }[] = [];
  private isMounted: boolean = false;

  constructor(elementType: string, id: string, className: string = '') {
    this.element = document.createElement(elementType) as T;
    this.element.id = id;
    if (className) this.element.classList.add(className);
  }

  mount(parent: HTMLElement = document.body): void {
    if (this.isMounted) {
      console.warn(`Element ${this.element.id} is already mounted`);
      return;
    }
    parent.appendChild(this.element);
    this.isMounted = true;
    console.log(`Mounted element ${this.element.id}`);
  }

  unmount(): void {
    if (!this.isMounted) {
      console.warn(`Element ${this.element.id} is not mounted`);
      return;
    }
    this.removeAllEventListeners();
    this.element.remove();
    this.isMounted = false;
    console.log(`Unmounted element ${this.element.id}`);
  }

  setPosition(x: number, y: number): void {
    this.element.style.position = 'absolute';
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  setDimensions(width: number, height: number): void {
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
  }

  addEventListener(type: string, handler: EventListener): void {
    this.element.addEventListener(type, handler);
    this.eventListeners.push({ type, handler });
  }

  removeEventListener(type: string, handler: EventListener): void {
    this.element.removeEventListener(type, handler);
    this.eventListeners = this.eventListeners.filter(
      (listener) => listener.type !== type || listener.handler !== handler
    );
  }

  protected removeAllEventListeners(): void {
    this.eventListeners.forEach(({ type, handler }) => {
      this.element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  addClass(className: string): void {
    this.element.classList.add(className);
  }

  removeClass(className: string): void {
    this.element.classList.remove(className);
  }
}
