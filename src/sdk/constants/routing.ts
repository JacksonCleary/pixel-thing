import home from '../components/routes/home';
import { IDirector } from '../classes/Director';
import { Home } from '../classes/routes/Home';
import { Route } from '../classes/Route';

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
];
