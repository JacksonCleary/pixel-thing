import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Threeasy from 'threeasy';
import anime from 'animejs/lib/anime.es.js';
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

  app.scene.background = new THREE.Color('dodgerblue');

  // const mat = new THREE.MeshBasicMaterial({ color: 'white' });
  // const geo = new THREE.BoxGeometry();

  // const mesh = new THREE.Mesh(geo, mat);

  // app.scene.add(mesh);

  // // Animate the mesh using animejs
  // const animation = anime({
  //   targets: mesh.position,
  //   x: -1,
  //   y: -1,
  //   z: 0,
  //   duration: 2000,
  //   easing: 'easeInOutQuad',
  //   loop: true,
  //   direction: 'alternate',
  //   autoplay: false, // Disable autoplay
  // });

  // // Render loop
  // const animate = () => {
  //   requestAnimationFrame(animate);
  //   controls.update();
  //   // animation.play();
  //   app.renderer.render(app.scene, app.camera);
  //   console.log('Animating');
  // };

  // animate();

  const director = new Director(app, controls);

  director.start();
};

export default start;
