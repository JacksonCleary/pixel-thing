import './styles.scss';
import initialize from './sdk/components/app';
import { registerServiceWorker } from './sdk/services/registerSW';

// start the engine
(() => {
  document.addEventListener('DOMContentLoaded', async function () {
    await registerServiceWorker();
    document.body.classList.add('ready');
    initialize();
  });
})();
