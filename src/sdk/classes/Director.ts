// Director class
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SHIMThreeasy } from '../third-party/models/threeasy';
import { Router } from './Router';
import { SceneObject } from './shapes/shape';
import { iColorScheme, getColorScheme } from '../constants/color';
import * as THREE from 'three';
import anime from 'animejs';
import { DOMElement } from './elements/DOMElement';

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
}

export class Director implements IDirector {
  private static instance: Director | null = null;
  private sceneObjects: SceneObject[] = [];
  private domObjects: DOMElement<HTMLElement>[] = [];
  private activeAnimations = new Map<string, boolean>();

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

  // Update route finding to wait for animation
  findRoute = async (path: string) => {
    await this.removeDOMObjectsFromScene();
    // small wait time for visual effect
    await new Promise((resolve) => setTimeout(resolve, 150));
    await this.animateOutScene();
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
    this.sceneObjects.push(shape);
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
    return new Promise<void>((resolve) => {
      if (this.sceneObjects.length === 0) {
        resolve();
        return;
      }

      let totalMeshes = 0;
      let completedAnimations = 0;
      const animationFuncs: Function[] = []; // Track all animation functions

      this.sceneObjects.forEach((group) => {
        if (group instanceof THREE.Group) {
          group.traverse((child) => {
            if (child instanceof THREE.Mesh) totalMeshes++;
          });
        }
      });

      this.sceneObjects.forEach((group) => {
        if (group instanceof THREE.Group) {
          group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const meshId = `${child.uuid}`;

              const material = child.material as THREE.MeshBasicMaterial;
              material.transparent = true;

              // Check if mesh is already being animated
              if (this.activeAnimations.has(meshId)) {
                console.warn(
                  `Duplicate animation detected for mesh: ${meshId}`
                );
                return;
              }

              const animation = anime({
                targets: [child.position, material],
                y: 50,
                opacity: 0,
                duration: 800,
                // delay: child.position.x * 50,
                delay: (child.position.x + child.position.y) * 30,
                // easing: 'cubicBezier(1,0,1,.48)',
                easing: 'cubicBezier(1,-0.05,1,.48)',
                complete: () => {
                  this.activeAnimations.delete(meshId);
                  completedAnimations++;
                  if (completedAnimations === totalMeshes) {
                    // Clean up all animation functions
                    animationFuncs.forEach((func) => {
                      this.removeAnimationFromQueue(func);
                    });

                    // Cleanup scene objects
                    this.sceneObjects.forEach((obj) => {
                      this.app.scene.remove(obj);
                      if (obj instanceof THREE.Group) {
                        obj.traverse((groupChild) => {
                          if (groupChild instanceof THREE.Mesh) {
                            groupChild.geometry.dispose();
                            groupChild.material.dispose();
                          }
                        });
                      }
                    });
                    this.sceneObjects = [];
                    resolve();
                  }
                },
              });

              let start: number | null = null;
              let isPaused = false;

              const animationFunc = (timestamp: number) => {
                if (isPaused) return;
                if (!start) start = timestamp;

                // Directly tick animation
                console.log('animating out');
                animation.tick(timestamp);
              };

              animationFuncs.push(animationFunc);
              this.addAnimationToQueue(animationFunc);
            }
          });
        }
      });
    });
  };
}
