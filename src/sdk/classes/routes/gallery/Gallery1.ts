// a child of Route class
import { Route } from '../../Route';
import { routeInstance } from '../../../constants/routing';

export class Gallery1 extends Route {
  constructor(routeInstance: routeInstance) {
    super(routeInstance);
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadTemplate(); // Template loading handled by Route
  }
}
