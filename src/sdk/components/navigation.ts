import { Director } from '../classes/Director';

const activeClass = 'active';

export const initNavigation = async () => {
  const director = Director.getInstance();
  if (!director) {
    throw new Error('Director not initialized');
  }
  // Navigation logic
  const navItems = document.querySelectorAll('[data-route]');

  navItems.forEach((item) => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!item.classList.contains(activeClass)) {
        const route = item.getAttribute('data-route');
        await director.findRoute(route);
      }
    });
  });

  // Set active flag for CSS
  director.on('route:initialized', () => {
    initRouteEventChange();
  });
};

const initRouteEventChange = async () => {
  const director = Director.getInstance();
  if (!director) {
    throw new Error('Director not initialized');
  }
  const currentRoute = director.getCurrentRoute();
  if (!currentRoute) {
    throw new Error('Current route not initialized');
  }
  const { permalink } = currentRoute;
  document.querySelectorAll('[data-route]').forEach((item) => {
    const route = item.getAttribute('data-route');
    item.classList.toggle(activeClass, route === permalink);
  });
};
