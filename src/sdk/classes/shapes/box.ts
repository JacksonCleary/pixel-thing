import * as THREE from 'three';
import { Shape } from './shape';

export class Box extends Shape {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshBasicMaterial;

  constructor({
    x = 0,
    y = 0,
    z = 0,
    color = 'red',
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1,
  }) {
    super(x, y, z, color);

    // Validate parameters
    if (
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      !Number.isFinite(depth)
    ) {
      throw new Error('Invalid box dimensions');
    }

    // Create geometry with correct parameters
    this.geometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments
    );

    this.material = new THREE.MeshBasicMaterial({ color });
  }

  createMesh(): THREE.Mesh {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.set(this.x, this.y, this.z);
    return mesh;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

// // Usage:
// const box = new Box({
//   x: 1,
//   y: 1,
//   z: 0,
//   color: 'red',
//   width: 1,
//   height: 0.5,
//   depth: 0.5,
// });
