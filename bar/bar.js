import { barProjector } from './barProjector.js';
export { BarView };

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
