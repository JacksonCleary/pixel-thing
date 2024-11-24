import { Route } from '../classes/Route';
import { Home } from '../classes/routes/Home';
import { Four04 } from '../classes/routes/404';

export type routeInstance = {
  permalink: string;
  component: RouteConstructor;
  title: string;
};

type RouteConstructor = new (routeInstance: routeInstance) => Route;

export const ROUTES: routeInstance[] = [
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
