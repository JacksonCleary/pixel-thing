// Director class
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SHIMThreeasy } from '../third-party/models/threeasy';
import { Router } from './Router';
import { Route } from './Route';
import { SceneObject } from './shapes/shape';
import { iColorScheme, getColorScheme } from '../constants/color';
import { DOMElement } from './elements/DOMElement';
import { Animation } from './animation/animation';

export interface IDirector {
  animationQueue: Array<Function>;
  app: SHIMThreeasy;
  controls: OrbitControls;
  colorScheme: iColorScheme;
  start: () => void;
  findRoute: (path: string) => void;
  animate: () => void;
  addAnimationToQueue: (animation: Function) => void;
  removeAnimationFromQueue: (animation: Function) => void;
  addShapeToScene: (shape: SceneObject) => void;
  removeShapeFromScene: (shape: SceneObject) => void;
  assignColorScheme: (scheme: string) => void;
  animateOutScene: () => Promise<void>;
  addDOMObjectToDOMObjects: (object: DOMElement<HTMLElement>) => void;
  removeDOMObjectsFromScene: () => Promise<void>;
  getCurrentRoute: () => Route | null;
  setCurrentRoute: (route: Route) => void;
}

export class Director implements IDirector {
  private events: Map<string, Function> = new Map();
  private static instance: Director | null = null;
  private sceneObjects: SceneObject[] = [];
  private domObjects: DOMElement<HTMLElement>[] = [];
  private animator: Animation;
  private currentRoute: Route;
  private isRouting: boolean = false;

  app: SHIMThreeasy;
  controls: OrbitControls;
  colorScheme: iColorScheme;
  animationQueue = [];

  constructor(app, controls) {
    this.app = app;
    this.controls = controls;
    this.currentRoute = null;
    this.assignColorScheme();
    this.animator = new Animation(this);
  }

  public static getInstance(app?, controls?): Director {
    if (!Director.instance) {
      if (!app || !controls) {
        throw new Error(
          'Director requires app and controls for initialization'
        );
      }
      Director.instance = new Director(app, controls);
    }
    return Director.instance;
  }

  public static hasInstance(): boolean {
    return Director.instance !== null;
  }

  start = () => {
    this.animate();
    this.findRoute(window.location.pathname);
  };

  // Update route finding to wait for animation
  findRoute = async (path: string) => {
    if (this.isRouting) {
      return;
    }
    this.isRouting = true;
    await this.removeDOMObjectsFromScene();
    // small wait time for visual effect
    await new Promise((resolve) => setTimeout(resolve, 150));
    await this.animateOutScene();
    console.log('Navigating to:', path);
    const router = new Router();
    router.route(path);
    this.isRouting = false;
  };

  getCurrentRoute(): Route | null {
    return this.currentRoute;
  }

  async setCurrentRoute(route: Route): Promise<void> {
    console.log('route', route);
    this.currentRoute = route;
    await this.emit('route:initialized');
  }

  on(event: string, callback: Function) {
    this.events.set(event, callback);
  }

  emit(event: string) {
    const callback = this.events.get(event);
    if (callback) callback();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const currentTime = performance.now();

    // Run all queued animations with timestamp
    this.animationQueue.forEach((animation) => animation(currentTime));

    this.controls.update();
    this.app.renderer.render(this.app.scene, this.app.camera);
  };

  // Method to add animations to the queue
  addAnimationToQueue = (animation: Function) => {
    this.animationQueue.push(animation);
  };

  // Method to remove animations from the queue
  removeAnimationFromQueue = (animation: Function) => {
    this.animationQueue = this.animationQueue.filter((a) => a !== animation);
  };

  // Add shape to scene
  addShapeToScene = (shape: SceneObject) => {
    this.sceneObjects.push(shape);
    this.app.scene.add(shape);
  };

  // Remove shape from scene
  removeShapeFromScene = (shape: SceneObject) => {
    this.app.scene.remove(shape);
  };

  // Assign color scheme
  assignColorScheme = (scheme?: string): void => {
    const { name, colorScheme } = getColorScheme(scheme);
    this.colorScheme = colorScheme;
    // remove other body classes that start with 'scheme-'
    document.body.className = document.body.className.replace(
      /\bscheme-\S+/g,
      ''
    );
    // add new color scheme class
    document.body.classList.add(`scheme-${name}`);
  };

  // Update method signatures to use DOMElement
  addDOMObjectToDOMObjects = (object: DOMElement<HTMLElement>) => {
    this.domObjects.push(object);
  };

  // Remove all DOM objects from the scene
  removeDOMObjectsFromScene = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      try {
        // Unmount all DOM objects
        this.domObjects.forEach((obj) => {
          // remove ready class
          obj.addClass('out');
          // wait 250 ms
          setTimeout(async () => {
            await obj.unmount();
          }, 500);
        });

        // Clear the array
        this.domObjects = [];

        resolve();
      } catch (error) {
        console.error('Error removing DOM objects:', error);
        resolve(); // Still resolve to prevent blocking
      }
    });
  };

  // Animate out and cleanup
  animateOutScene = async () => {
    console.log('Animating out scene');
    if (this.sceneObjects.length === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.animator.animateScene({
        sceneObjects: this.sceneObjects,
        isEntry: false,
        onComplete: () => {
          this.sceneObjects = [];
          resolve();
        },
      });
    });
  };
}
