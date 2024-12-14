// a minimal pathname router
import { Route } from './Route';
import { ROUTES } from '../constants/routing';
import { Director } from './Director';

export class Router {
  private popstateHandler: (event: PopStateEvent) => void;

  constructor() {
    // Remove any existing listeners first
    // if (this.popstateHandler) {
    //   window.removeEventListener('popstate', this.popstateHandler);
    // }
    // // Create bound handler
    // this.popstateHandler = (event: PopStateEvent) => {
    //   console.log('Popstate triggered by:', {
    //     state: event.state,
    //     referrer: document.referrer,
    //     currentURL: window.location.href,
    //   });
    //   const path = event.state?.path || '/';
    //   this.navigate(path, true);
    // };
    // // Add single listener
    // window.addEventListener('popstate', this.popstateHandler);
  }

  destroy() {
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
    }
  }

  public async navigate(path: string, skipPush = false) {
    try {
      if (!skipPush) {
        window.history.pushState({ path }, '', path);
      }
      const director = Director.getInstance();
      if (director) {
        await director.findRoute(path);
      }
    } catch (error) {
      console.error('Navigation failed:', error);
      // Handle navigation errors appropriately
    }
  }

  route(path: string) {
    const route = ROUTES.find((r) => r.permalink === path);
    const director = Director.getInstance();
    if (!director) {
      throw new Error('Director not initialized');
    }
    try {
      // Cleanup previous route if exists

      const currentRoute = director.getCurrentRoute();
      if (currentRoute) {
        currentRoute.deregister();
      }

      if (route) {
        window.___debug.log(`Navigating to ${route.title}`);
        // Type guard to ensure component is valid
        if (typeof route.component === 'function') {
          director.setCurrentRoute(new route.component(route));
        } else {
          throw new Error(`Invalid component for route: ${path}`);
        }
      } else {
        window.___debug.log(`No route found for ${path}`, 'error');
        // Navigate to 404 route
        this.route('/404');
      }
    } catch (error) {
      console.log('error', error);
      window.___debug.log(`Error rendering route: ${error.message}`, 'error');
      this.route('/404');
    }

    const newRoute = director.getCurrentRoute();

    // Update page title
    document.title = newRoute?.title || 'Thing';

    // Update URL
    this.updateURL(path);
  }

  public updateURL(
    path: string,
    options?: {
      queryParams?: Record<string, string>;
      hash?: string;
      replace?: boolean; // true = replace history, false = push new entry
    }
  ) {
    // Build full URL
    let url = path;

    // Add query params if any
    if (options?.queryParams) {
      const params = new URLSearchParams(options.queryParams);
      url += `?${params.toString()}`;
    }

    // Add hash if any
    if (options?.hash) {
      url += `#${options.hash}`;
    }

    // Update browser history
    if (options?.replace) {
      window.history.replaceState({ path }, '', url);
    } else {
      window.history.pushState({ path }, '', url);
    }
  }
}
