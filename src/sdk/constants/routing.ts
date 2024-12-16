import { Route } from '../classes/Route';
import { Home } from '../classes/routes/Home';
import { Four04 } from '../classes/routes/404';
import { Gallery1 } from '../classes/routes/gallery/Gallery1';

export type routeInstance = {
  permalink: string;
  component: RouteConstructor;
  title: string;
  templateSrc?: string;
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
  {
    permalink: '/gallery/1',
    component: Gallery1,
    title: 'Gallery: Image Manipulation - Thing',
    templateSrc: 'gallery/gallery1',
  },
];
