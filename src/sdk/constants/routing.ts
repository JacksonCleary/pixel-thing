import home from '../components/routes/home';
import { IDirector } from '../classes/Director';
import { Route } from '../classes/Route';
import { Home } from '../classes/routes/Home';
import { Four04 } from '../classes/routes/404';

type RouteConstructor = new (name: string, director: IDirector) => Route;

type route = {
  permalink: string;
  component: RouteConstructor;
  title: string;
};

export const ROUTES: route[] = [
  {
    permalink: '/',
    component: Home,
    title: 'Home - Thing',
  },
  {
    permalink: '/404',
    component: Four04,
    title: '404 - Thing',
  },
];
