// Director class
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SHIMThreeasy } from '../third-party/models/threeasy';
import { Router } from './Router';

export interface IDirector {
  animationQueue: Array<Function>;
  app: SHIMThreeasy;
  controls: OrbitControls;
  start: () => void;
  findRoute: (path: string) => void;
  animate: () => void;
  addAnimationToQueue: (animation: Function) => void;
  removeAnimationFromQueue: (animation: Function) => void;
}

export class Director implements IDirector {
  app;
  controls;
  animationQueue = [];

  constructor(app, controls) {
    this.app = app;
    this.controls = controls;
  }

  start = () => {
    this.animate();
    this.findRoute(window.location.pathname);
  };

  findRoute = (path: string) => {
    const router = new Router();
    router.route(path, this);
  };

  animate = () => {
    // Request animation frame
    requestAnimationFrame(this.animate);
    // Run animations in the queue
    this.animationQueue.forEach((animation) => animation());
    // Update controls
    this.controls.update();
    // Render the scene
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
}
