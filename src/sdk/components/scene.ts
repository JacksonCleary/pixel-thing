import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Threeasy from 'threeasy';
import { Director } from '../classes/Director';
import {
  SHIMThreeasy,
  SHIMThreeasySettings,
} from '../third-party/models/threeasy';

const start = (sceneEl: HTMLElement) => {
  const threeasySettings: SHIMThreeasySettings = {
    domElement: sceneEl,
  };
  const app: SHIMThreeasy = new Threeasy(THREE, threeasySettings);

  const scale = 100;

  app.camera.position.x = 0;
  app.camera.position.y = 0;
  app.camera.position.z = 1 * scale;

  const controls = new OrbitControls(app.camera, app.renderer.domElement);
  //controls.update() must be called after any manual changes to the camera's transform
  controls.enablePan = false;
  controls.enableRotate = false;
  // controls.enableZoom = false;

  const director = Director.getInstance(app, controls);
  const tertiaryColor = director.colorScheme.tertiary;
  app.scene.background = new THREE.Color(tertiaryColor);

  director.start();
};

export default start;
