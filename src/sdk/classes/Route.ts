// A parent route consumed by the router

import { Director, IDirector } from './Director';

export class Route {
  eventListeners: Array<{
    target: EventTarget;
    type: string;
    listener: EventListenerOrEventListenerObject;
  }> = [];
  events: Map<string, Function> = new Map();

  director: IDirector;

  constructor(name: string) {
    window.___debug.log(`Route ${name} registered`);

    this.director = Director.getInstance();

    // Bind the render method to the instance
    this.render = this.render.bind(this);
    // Bind the deregister method to the instance
    this.deregister = this.deregister.bind(this);

    // emit a custom event when the route is registered
    this.emit('routeRegistered', name);
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
  render() {
    window.___debug.log('Rendering route');
  }

  // A method to be overridden by child classes
  deregister() {
    window.___debug.log('Deregistering route');
    this.cleanup(); // Call cleanup to remove all event listeners and custom events
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
