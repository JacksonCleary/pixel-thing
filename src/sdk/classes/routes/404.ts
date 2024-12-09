// a child of Route class
import { Route } from '../Route';
import * as THREE from 'three';
import { routeInstance } from '../../constants/routing';
import { Box } from '../shapes/box';
import { convertToScreenCoords, convertGroupDimensions } from '../../util/size';
import { Button } from '../elements/ButtonElement';
import { Animation } from '../animation/animation';

export class Four04 extends Route {
  group: THREE.Group;
  interactiveGroupArray: THREE.Mesh[] = [];
  animationCompleteTick: number = 0;
  button: Button;

  constructor(routeInstance: routeInstance) {
    super(routeInstance);
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadTemplate(); // Template loading handled by Route
    await this.setupButton();
    this.setupButtonEvents();
    this.start();
  }

  private async setupButton(): Promise<void> {
    const buttonElement = document.getElementById(
      '404-home-button'
    ) as HTMLButtonElement;
    if (!buttonElement) {
      throw new Error('404 Home Button not found in template');
    }

    this.button = new Button(
      buttonElement,
      'home-gallery-button',
      'interactive-button'
    );
  }

  private setupButtonEvents(): void {
    this.button.addEventListener('mouseenter', () => {
      this.interactiveGroupArray.forEach((mesh: THREE.Mesh) => {
        mesh.position.y -= 1;
      });
    });

    this.button.addEventListener('mouseleave', () => {
      this.interactiveGroupArray.forEach((mesh: THREE.Mesh) => {
        mesh.position.y += 1;
      });
    });

    this.button.addEventListener('click', async () => {
      await this.director.findRoute('/');
    });
  }

  createAnimation(mesh: THREE.Mesh, x: number, y: number, height: number) {
    const animator = new Animation(this.director);
    animator.createMeshAnimation({
      mesh,
      position: { x, y: y - height / 2 },
      duration: 500,
      delay: (x + y) * 50,
      isEntry: true,
      onComplete: () => {
        this.animationCompleteTick++;
        if (this.animationCompleteTick === this.group?.children?.length) {
          this.animationComplete();
        }
      },
    });
  }

  createBoxRectangle() {
    const width = 20;
    const height = 8;
    const boxes: THREE.Mesh[][] = [];
    const group = new THREE.Group();

    this.interactiveGroupArray = [];

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
          y: 50,
          z: 0,
        });

        const mesh = box.createMesh();
        group.add(mesh);
        this.createAnimation(mesh, x, y, height);
        row.push(mesh);

        if (!isFirstRow) {
          this.interactiveGroupArray.push(mesh);
        }
      }
      boxes.push(row);
    }

    this.director.addShapeToScene(group);
    this.director.addDOMObjectToDOMObjects(this.button);

    // for use on animation complete
    console.log('Group:', group);
    this.group = group;
  }

  start() {
    if (this.button) {
      this.createBoxRectangle();
    }
  }

  // Method to position button after animation
  animationComplete(): void {
    const boundingBox = new THREE.Box3().setFromObject(this.group);
    const topLeft = {
      x: boundingBox.min.x,
      y: boundingBox.max.y,
    };

    const screenPos = convertToScreenCoords(
      topLeft.x,
      topLeft.y,
      this.director.app.camera
    );

    const dimensions = convertGroupDimensions(
      this.group,
      this.director.app.camera,
      'toScreen'
    );

    this.button.setPosition(screenPos.x, screenPos.y);
    this.button.setDimensions(dimensions.width, dimensions.height);
    this.button.addClass('ready');
  }
}
