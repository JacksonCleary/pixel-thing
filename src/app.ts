import './styles.scss';
import initialize from './sdk/components/app';
import { registerServiceWorker } from './sdk/services/registerSW';
import { typewriterInit } from './sdk/animation/typewriter';

// start the engine
(() => {
  document.addEventListener('DOMContentLoaded', async function () {});
  // Usage
  document.addEventListener('DOMContentLoaded', async () => {
    await registerServiceWorker();
    document.body.classList.add('ready');
    await typewriterInit('#title');
    await typewriterInit('.nav-item, nav span');
    initialize();
  });
})();
