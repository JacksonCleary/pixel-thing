// a child of Route class
import { Route } from '../Route';
import { routeInstance } from '../../constants/routing';
import { typewriterInit } from '../../animation/typewriter';

export class Home extends Route {
  constructor(routeInstance: routeInstance) {
    super(routeInstance);
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadTemplate(); // Template loading handled by Route
    // const typewriterItems = document.querySelectorAll('#home > .typewriter');
    // await Promise.all(
    //   Array.from(typewriterItems).map(
    //     (item, index) =>
    //       new Promise((resolve) => {
    //         setTimeout(async () => {
    //           await typewriterInit(item);
    //           resolve(null);
    //         }, index * 500);
    //       })
    //   )
    // );
    await typewriterInit('#home > .typewriter');
  }
}
