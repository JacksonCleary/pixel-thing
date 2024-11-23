// a child of Route class
import home from '../../components/routes/home';
import { IDirector } from '../Director';
import { Route } from '../Route';

export class Four04 extends Route {
  constructor(name: string) {
    super(name);
    this.render();
  }
  render() {
    super.render();
    window.___debug.log('404 route', 'success');
  }
}
