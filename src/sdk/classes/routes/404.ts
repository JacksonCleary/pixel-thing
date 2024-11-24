// a child of Route class
import home from '../../components/routes/home';
import { IDirector } from '../Director';
import { Route } from '../Route';
import { routeInstance } from '../../constants/routing';

export class Four04 extends Route {
  constructor(routeInstance: routeInstance) {
    super(routeInstance);
    this.render();
  }
  render() {
    super.render();
    window.___debug.log('404 route', 'success');
  }
}
