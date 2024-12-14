import * as THREE from 'three';

export const convertToScreenCoords = (
  worldX: number,
  worldY: number,
  camera: THREE.Camera
) => {
  const canvas = document.querySelector('canvas');
  if (!canvas) throw new Error('Canvas not found');

  const canvasRect = canvas.getBoundingClientRect();

  // Project world coordinates to NDC
  const vector = new THREE.Vector3(worldX, worldY, 0);
  vector.project(camera);

  // Calculate canvas position
  const canvasX = ((vector.x + 1) * canvasRect.width) / 2;
  const canvasY = ((-vector.y + 1) * canvasRect.height) / 2;

  return {
    x: canvasX,
    y: canvasY,
  };
};

export const convertToWorldCoords = (
  screenX: number,
  screenY: number,
  camera: THREE.Camera
) => {
  const canvas = document.querySelector('canvas');
  if (!canvas) throw new Error('Canvas not found');
  const canvasRect = canvas.getBoundingClientRect();

  // Convert to canvas-relative coordinates
  const canvasX = screenX - canvasRect.left;
  const canvasY = screenY - canvasRect.top;

  // Convert to NDC
  const x = (canvasX * 2) / canvasRect.width - 1;
  const y = -(canvasY * 2) / canvasRect.height + 1;

  const vector = new THREE.Vector3(x, y, 0);
  vector.unproject(camera);

  return { x: vector.x, y: vector.y };
};

export const convertGroupDimensions = (
  group: THREE.Group,
  camera: THREE.Camera,
  direction: 'toScreen' | 'toWorld'
) => {
  const boundingBox = new THREE.Box3().setFromObject(group);

  if (direction === 'toScreen') {
    // Get screen coordinates once for each corner
    const topLeft = convertToScreenCoords(
      boundingBox.min.x,
      boundingBox.max.y,
      camera
    );

    const bottomRight = convertToScreenCoords(
      boundingBox.max.x,
      boundingBox.min.y,
      camera
    );

    // Calculate dimensions from screen coordinates
    return {
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
      position: topLeft,
    };
  }
};
