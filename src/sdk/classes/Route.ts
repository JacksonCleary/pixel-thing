// A parent route consumed by the router
import { routeInstance } from '../constants/routing';
import { Director, IDirector } from './Director';
import { TemplateService } from '../services/TemplateService';

export class Route {
  eventListeners: Array<{
    target: EventTarget;
    type: string;
    listener: EventListenerOrEventListenerObject;
  }> = [];
  events: Map<string, Function> = new Map();

  director: IDirector;

  title: string;
  permalink: string;
  routeInstance: string;

  private static mountedRoutes: Set<string> = new Set();
  protected templateService: TemplateService;
  private template: DocumentFragment | null = null;
  private mountPoint: HTMLElement | null = null;
  private loader: HTMLElement | null = null;

  constructor(route: routeInstance) {
    this.director = Director.getInstance();

    // Bind the render method to the instance
    this.render = this.render.bind(this);
    // Bind the deregister method to the instance
    this.deregister = this.deregister.bind(this);

    // emit a custom event when the route is registered

    this.title = route.title;
    this.permalink = route.permalink;
    this.routeInstance = route.templateSrc || this.permalink;

    this.templateService = new TemplateService();
    this.mountPoint = document.getElementById('ui');
    this.loader = document.getElementById('loader');
    window.___debug.log(`Route ${this.permalink} registered`);
    // Load template based on route permalink
    // this.loadTemplate();
    this.emit('routeRegistered', this.permalink);
  }

  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(type, listener, options);
    this.eventListeners.push({ target, type, listener });
  }

  removeEventListener(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) {
    target.removeEventListener(type, listener, options);
    this.eventListeners = this.eventListeners.filter(
      (eventListener) =>
        eventListener.target !== target ||
        eventListener.type !== type ||
        eventListener.listener !== listener
    );
  }

  // Method to remove all event listeners
  cleanup() {
    this.eventListeners.forEach(({ target, type, listener }) => {
      target.removeEventListener(type, listener);
    });
    this.eventListeners = [];
    this.events.clear();
  }

  // Method to register custom events
  on(event: string, callback: Function) {
    this.events.set(event, callback);
  }

  // Method to emit custom events
  emit(event: string, ...args: any) {
    const eventCallback = this.events.get(event);
    if (eventCallback) {
      eventCallback(...args);
    }
  }

  // Method to remove custom events
  off(event: string) {
    this.events.delete(event);
  }

  // A method to be overridden by child classes
  protected render(): void {
    if (!this.template || !this.mountPoint) return;

    // Clone template to avoid mutating cached version
    const content = this.template.cloneNode(true) as DocumentFragment;
    this.mountPoint.appendChild(content);
  }

  // A method to be overridden by child classes
  deregister() {
    window.___debug.log('Deregistering route');
    Route.mountedRoutes.delete(this.permalink);
    this.cleanup(); // Call cleanup to remove all event listeners and custom events
    console.log('this.mountPoint', this.mountPoint);
    // Clean up template
    if (this.mountPoint) {
      this.mountPoint.innerHTML = '';
    }
    // remove template HTML from DOM

    this.template = null;
  }

  async loadTemplate(): Promise<void> {
    if (this.loader) {
      console.log('this.loader.classList', this.loader.classList);
    }
    try {
      // Remove leading slash for template path
      const templatePath = this.routeInstance.replace(/^\//, '');
      const templateSlug = templatePath || 'home';
      console.log('templateSlug', templateSlug);
      this.template = await this.templateService.fetchTemplate(templateSlug);
      window.___debug.log(`Template loaded for ${templateSlug}`);
      console.log(this.template);
      this.render();
    } catch (error) {
      console.error(`Failed to load template for ${this.permalink}:`, error);
    } finally {
      if (this.loader) {
        this.loader.classList.remove('active');
      }
    }
  }
}

// // Example usage
// const route = new Route();
// const clickTarget = document.getElementById('clickTarget');

// function makeBackgroundYellow() {
//   document.body.style.backgroundColor = 'yellow';
// }

// // Register an event listener
// route.addEventListener(clickTarget, 'click', makeBackgroundYellow);

// // Register a custom event
// route.on('customEvent', (message: string) => {
//   console.log(`Custom event triggered: ${message}`);
// });

// // Emit the custom event
// route.emit('customEvent', 'Hello, world!');

// // Deregister the route and cleanup event listeners and custom events
// route.deregister();
