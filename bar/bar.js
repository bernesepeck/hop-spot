import { AppController } from '../appController.js';
import { barProjector, loadingProjector } from './barProjector.js';
export { BarView, LoadBarView };

/**
 * Renders the view for the selected bar
 * @param {import('../appController.js').AppControllerType} appController
 * @param {HTMLElement} rootElement
 */
const BarView = (appController, rootElement) => {
  const render = (bar) => barProjector(appController, rootElement, bar);

  appController.onBarSelected((bar) => {
    if (bar) render(bar);
  });
};

const LoadBarView = (appController, rootElement) => {
  const render = () => loadingProjector(rootElement);
  appController.onBarLoading((loading) => {
    if (loading) render();
  });
};
