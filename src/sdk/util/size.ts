import * as THREE from 'three';

// Convert world to screen coordinates
export const convertToScreenCoords = (
  worldX: number,
  worldY: number,
  camera: THREE.Camera
) => {
  const vector = new THREE.Vector3(worldX, worldY, 0);
  vector.project(camera);
  const x = ((vector.x + 1) * window.innerWidth) / 2;
  const y = ((-vector.y + 1) * window.innerHeight) / 2;
  return { x, y };
};

// Convert screen to world coordinates
export const convertToWorldCoords = (
  screenX: number,
  screenY: number,
  camera: THREE.Camera
) => {
  // Convert screen coordinates to normalized device coordinates (-1 to +1)
  const x = (screenX * 2) / window.innerWidth - 1;
  const y = -(screenY * 2) / window.innerHeight + 1;

  // Create vector and unproject
  const vector = new THREE.Vector3(x, y, 0);
  vector.unproject(camera);

  return { x: vector.x, y: vector.y };
};

// Bidirectional group dimension conversions
export const convertGroupDimensions = (
  group: THREE.Group,
  camera: THREE.Camera,
  direction: 'toScreen' | 'toWorld'
) => {
  const boundingBox = new THREE.Box3().setFromObject(group);

  if (direction === 'toScreen') {
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

    return {
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
      position: topLeft,
    };
  } else {
    // Convert screen dimensions back to world units
    const worldTopLeft = convertToWorldCoords(0, 0, camera);
    const worldBottomRight = convertToWorldCoords(
      window.innerWidth,
      window.innerHeight,
      camera
    );

    return {
      width: worldBottomRight.x - worldTopLeft.x,
      height: worldBottomRight.y - worldTopLeft.y,
      position: worldTopLeft,
    };
  }
};
