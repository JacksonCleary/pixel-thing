// a child of Route class
import { Route } from '../Route';
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js';
import { routeInstance } from '../../constants/routing';
import { Box } from '../shapes/box';
import { convertToScreenCoords, convertGroupDimensions } from '../../util/size';

export class Home extends Route {
  group: THREE.Group;
  animationCompleteTick: number = 0;

  constructor(routeInstance: routeInstance) {
    super(routeInstance);
    this.render();
  }

  createAnimation(mesh: THREE.Mesh, x: number, y: number, height: number) {
    // Type assertion to specify material type
    const material = mesh.material as THREE.MeshBasicMaterial; // Or other specific material type
    material.transparent = true;
    material.opacity = 0; // Start invisible

    const animation = anime({
      targets: [mesh.position, mesh.material],
      y: y - height / 2,
      opacity: 1,
      duration: 500,
      delay: (x + y) * 50,
      easing: 'easeOutQuad',
      autoplay: false,
      complete: () => {
        this.animationCompleteTick++;
        animation.pause();
        this.director.removeAnimationFromQueue(animationFunc);
        // Check if all animations are complete
        const allComplete =
          this.animationCompleteTick === this.group?.children?.length;
        if (allComplete) {
          console.log('All animations complete!');
          this.animationComplete();
        }
      },
    });

    let start: number | null = null;
    const animationFunc = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      animation.tick(elapsed);
    };
    this.director.addAnimationToQueue(animationFunc);
  }

  createBoxRectangle() {
    const width = 20;
    const height = 8;
    const boxes: THREE.Mesh[][] = [];
    const group = new THREE.Group();

    for (let y = 0; y < height; y++) {
      const row: THREE.Mesh[] = [];
      for (let x = 0; x < width; x++) {
        const isFirstRow = y < 1;
        const mainColor = isFirstRow
          ? this.director.colorScheme.accent
          : this.director.colorScheme.primary;
        const box = new Box({
          width: 1,
          height: 1,
          depth: 1,
          color: mainColor,
          x: x - width / 2,
          //   y: y - height / 2 - 20, // Start offscreen
          y: 50,
          z: 0,
        });

        const mesh = box.createMesh();
        group.add(mesh);
        this.createAnimation(mesh, x, y, height);
        row.push(mesh);
      }
      boxes.push(row);
    }

    this.director.addShapeToScene(group);

    // for use on animation complete
    console.log('Group:', group);
    this.group = group;
  }

  render() {
    super.render();
    this.createBoxRectangle();
  }

  animationComplete() {
    const boundingBox = new THREE.Box3().setFromObject(this.group);
    const topLeft = {
      x: boundingBox.min.x,
      y: boundingBox.max.y,
    };
    console.log('Group top left:', topLeft);
    const screenPos = convertToScreenCoords(
      topLeft.x,
      topLeft.y,
      this.director.app.camera
    );
    console.log('Screen position:', screenPos);
    const dimensions = convertGroupDimensions(
      this.group,
      this.director.app.camera,
      'toScreen'
    );
    console.log('Group dimensions:', dimensions);
    const button = document.getElementById('start');
    if (button) {
      button.style.position = 'absolute';
      button.style.left = `${screenPos.x}px`;
      button.style.top = `${screenPos.y}px`;
      button.style.width = `${dimensions.width}px`;
      button.style.height = `${dimensions.height}px`;
    }
  }
}
