// Shape Class
import { Object3D } from 'three';

export // Interface for Three.js objects that can be added to scene
interface SceneObject extends Object3D {
  isMesh?: boolean;
  isGroup?: boolean;
}

export class Shape {
  x: number = 1;
  y: number = 1;
  z: number = 1;
  color: string = 'gold';

  constructor(x: number, y: number, z: number, color: string) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
  }
}
