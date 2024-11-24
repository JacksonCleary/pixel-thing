// a minimal pathname router
import { Route } from './Route';
import { ROUTES } from '../constants/routing';
import { Director } from './Director';

export class Router {
  private currentRoute: Route | null = null;

  constructor() {
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
      const path = event.state?.path || '/';
      this.navigate(path, true);
    });
  }

  public navigate(path: string, skipPush = false) {
    if (!skipPush) {
      window.history.pushState({ path }, '', path);
    }
    const director = Director.getInstance();
    if (director) {
      this.route(path);
    }
  }

  route(path: string) {
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
          this.currentRoute = new route.component(route);
          console.log(this.currentRoute);
        } else {
          throw new Error(`Invalid component for route: ${path}`);
        }
      } else {
        window.___debug.log(`No route found for ${path}`, 'error');
        // Navigate to 404 route
        this.route('/404');
      }
    } catch (error) {
      window.___debug.log(`Error rendering route: ${error.message}`, 'error');
      this.route('/404');
    }
  }
}
