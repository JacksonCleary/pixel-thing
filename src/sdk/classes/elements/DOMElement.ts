// DOMElement.ts
export abstract class DOMElement<T extends HTMLElement> {
  protected element: T;
  protected eventListeners: { type: string; handler: EventListener }[] = [];
  private isMounted: boolean = false;

  constructor(
    elementOrType: string | T,
    className: string = '',
    id: string = ''
  ) {
    if (typeof elementOrType === 'string') {
      // Create new element
      this.element = document.createElement(elementOrType) as T;
    } else {
      // Use existing element
      this.element = elementOrType;
      this.isMounted = document.body.contains(this.element);
    }

    console.log('class name', className);

    if (!this.element.id) {
      this.element.id =
        id || `${elementOrType}-${Math.random().toString(36).substr(2, 9)}`;
    }

    if (className) {
      this.addClass(className);
    }
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

  async unmount(): Promise<void> {
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
    // Split multiple classes and add individually
    const classes = className.split(/\s+/).filter((c) => c.length > 0);
    classes.forEach((c) => {
      if (c) this.element.classList.add(c);
    });
  }

  removeClass(className: string): void {
    this.element.classList.remove(className);
  }
}
