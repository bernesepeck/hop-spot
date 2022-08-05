import { Attribute, LABEL } from '../common/kolibri/presentationModel.js'
import { filterProjector } from './filterProjector.js';

export { Filter, FilterView };

/**
 * Erstellt das Binding Model für den Filter
 * @typedef Filter
 * @returns {Filter}
 */
const Filter = () => {
  const distanceAttr = Attribute(1, 'distanceFilter');
  distanceAttr.getObs(LABEL).setValue('Distanz in KM');

  const drinkPrefAttr = Attribute({beer: true, wine: true, cocktail: false}, 'drinkPref');
  drinkPrefAttr.getObs(LABEL).setValue('Drinkpräverenzen');

  const currentLocation = Attribute('');
  currentLocation.getObs(LABEL).setValue('Aktueller Standort');

  const locationList = Attribute([]);

  return {
    distance: distanceAttr,
    drinkPref: drinkPrefAttr,
    location: currentLocation,
    locationList: locationList
  }
}

/**
 * renders the filter to the root element
 * @param {AppController} appController 
 * @param {HTMLElement} rootElement
 * @param {selectionController} selectionController
 */
const FilterView = (appController, rootElement, filterModel, selectionController) => {
  const render = () => filterProjector(filterModel, appController, rootElement, selectionController);
  render();
}