// Director class
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SHIMThreeasy } from '../third-party/models/threeasy';
import { Router } from './Router';
import { SceneObject } from './shapes/shape';
import { iColorScheme, getColorScheme } from '../constants/color';

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
}

export class Director implements IDirector {
  private static instance: Director | null = null;
  app: SHIMThreeasy;
  controls: OrbitControls;
  colorScheme: iColorScheme;
  animationQueue = [];

  constructor(app, controls) {
    this.app = app;
    this.controls = controls;
    this.assignColorScheme();
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

  findRoute = (path: string) => {
    const router = new Router();
    router.route(path);
  };

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
    this.app.scene.add(shape);
  };

  // Remove shape from scene
  removeShapeFromScene = (shape: SceneObject) => {
    this.app.scene.remove(shape);
  };

  // Assign color scheme
  assignColorScheme = (scheme?: string): void => {
    this.colorScheme = getColorScheme(scheme);
  };
}
