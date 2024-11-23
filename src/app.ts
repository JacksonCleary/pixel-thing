import './styles.scss';
import initialize from './sdk/components/app';

// start the engine
(() => {
  document.addEventListener('DOMContentLoaded', function () {
    initialize();
  });
})();
