// a child of Route class
import home from '../../components/routes/home';
import { Director } from '../Director';
import { Route } from '../Route';
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js';

export class Home extends Route {
  constructor(name: string) {
    super(name);
    this.render();
  }
  render() {
    super.render();
    const mat = new THREE.MeshBasicMaterial({ color: 'white' });
    const geo = new THREE.BoxGeometry();

    const mesh = new THREE.Mesh(geo, mat);

    this.director.app.scene.add(mesh);

    // Animate the mesh using animejs
    const createAnimation = (mesh: THREE.Mesh) => {
      const animation = anime({
        targets: mesh.position,
        x: -1,
        y: -1,
        z: 0,
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: false,
        direction: 'alternate',
        autoplay: false,
      });

      // Return function that checks condition and plays/stops animation
      return () => {
        // Example condition: stop when mesh reaches target position
        if (mesh.position.x <= -1 && mesh.position.y <= -1) {
          animation.pause(); // Pause the animation
          this.director.removeAnimationFromQueue(animationFn); // Remove from queue
          return;
        }
        animation.play();
      };
    };

    // add to animations
    const animationFn = createAnimation(mesh);
    this.director.addAnimationToQueue(animationFn);
  }
}
