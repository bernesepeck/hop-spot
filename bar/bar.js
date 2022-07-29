import {barProjector} from './barProjector.js';
export {BarView};

/**
 * Renders the view for the selected bar
 * @param {*} selectionController 
 * @param {HTMLElement} rootElement 
 */
const BarView = (selectionController, rootElement) => {

  const render = bar =>
      barProjector(selectionController, rootElement, bar);

  selectionController.onModelSelected(bar => {if(bar) render(bar)});
};