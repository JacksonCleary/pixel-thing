// a minimal pathname router
import { Route } from './Route';
import { ROUTES } from '../constants/routing';
import { Director } from './Director';

export class Router {
  private currentRoute: Route | null = null;

  route(path: string, director: Director) {
    const route = ROUTES.find((r) => r.permalink === path);

    try {
      // Cleanup previous route if exists
      if (this.currentRoute) {
        this.currentRoute.deregister();
      }

      if (route) {
        window.___debug.log(`Navigating to ${route.title}`);

        // Type guard to ensure component is valid
        if (typeof route.component === 'function') {
          this.currentRoute = new route.component(route.title, director);
          console.log(this.currentRoute);
        } else {
          throw new Error(`Invalid component for route: ${path}`);
        }
      } else {
        window.___debug.log(`No route found for ${path}`, 'error');
        // Navigate to 404 route
        this.route('/404', director);
      }
    } catch (error) {
      window.___debug.log(`Error rendering route: ${error.message}`, 'error');
      this.route('/404', director);
    }
  }
}
