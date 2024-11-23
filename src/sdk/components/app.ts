import start from './scene';
import { runDebug } from '../util/debug';

runDebug(true);

const initialize = () => {
  const app = document.getElementById('app');
  const scene = document.getElementById('scene');
  if (app && scene) {
    window.___debug.log('App initialized');
    start(scene);
  }
};

export default initialize;
