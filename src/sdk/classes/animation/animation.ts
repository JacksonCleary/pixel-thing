// Animation.ts
import anime from 'animejs/lib/anime.es.js';
import * as THREE from 'three';
import { IDirector } from '../Director';

export class Animation {
  private activeAnimations = new Map<string, boolean>();
  private animationFuncs = new Map<string, Function>();

  private director: IDirector;

  constructor(director: IDirector) {
    this.director = director;
  }

  createMeshAnimation(params: {
    mesh: THREE.Mesh;
    position: { x: number; y: number };
    delay: number;
    duration?: number;
    isEntry?: boolean;
    onComplete?: () => void;
  }) {
    const meshId = params.mesh.uuid;
    const material = params.mesh.material as THREE.MeshBasicMaterial;
    material.transparent = true;
    material.opacity = params.isEntry ? 0 : 1;

    const animation = anime({
      targets: [params.mesh.position, material],
      y: params.isEntry ? params.position.y : params.position.y + 50,
      opacity: params.isEntry ? 1 : 0,
      duration: params.duration || 800,
      delay: params.delay,
      easing: params.isEntry ? 'easeOutQuad' : 'cubicBezier(1,-0.05,1,.48)',
      autoplay: false,
      complete: () => {
        // Remove from queue when complete
        const func = this.animationFuncs.get(meshId);
        if (func) {
          this.director.removeAnimationFromQueue(func);
          this.animationFuncs.delete(meshId);
        }
        params.onComplete?.();
      },
    });

    let start: number | null = null;
    const animationFunc = (timestamp: number) => {
      if (!start) start = timestamp;
      animation.tick(timestamp);
    };

    this.director.addAnimationToQueue(animationFunc);
    return { animation, animationFunc };
  }

  animateScene(params: {
    sceneObjects: THREE.Object3D[];
    isEntry: boolean;
    onComplete?: () => void;
  }) {
    let totalMeshes = 0;
    let completedAnimations = 0;

    params.sceneObjects.forEach((group) => {
      if (group instanceof THREE.Group) {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh) totalMeshes++;
        });
      }
    });

    params.sceneObjects.forEach((group) => {
      if (group instanceof THREE.Group) {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const meshId = child.uuid;
            if (this.activeAnimations.has(meshId)) return;

            this.activeAnimations.set(meshId, true);
            this.createMeshAnimation({
              mesh: child,
              position: { x: child.position.x, y: child.position.y },
              delay: (child.position.x + child.position.y) * 30,
              isEntry: params.isEntry,
              onComplete: () => {
                this.activeAnimations.delete(meshId);
                completedAnimations++;
                if (completedAnimations === totalMeshes) {
                  this.cleanupScene(params.sceneObjects);
                  params.onComplete?.();
                }
              },
            });
          }
        });
      }
    });
  }

  private cleanupScene(objects: THREE.Object3D[]) {
    // Remove any remaining animations
    this.animationFuncs.forEach((func) => {
      this.director.removeAnimationFromQueue(func);
    });
    this.animationFuncs.clear();
    objects.forEach((obj) => {
      if (obj instanceof THREE.Group) {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }
    });
  }
}
