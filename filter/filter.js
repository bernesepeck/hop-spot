import { Attribute, LABEL } from '../common/kolibri/presentationModel.js'
import { filterProjector } from './filterProjector.js';

export { Filter, FilterView };

/**
 * @typedef LocationType
 * @property {number} lat
 * @property {number} lng
 * 
 * @typedef CurrentLocationType
 * @property {LocationType} location
 * @property {string} address
 */

/**
 * Creates a filter model to bind input to model
 * @typedef Filter
 * @property {number} distance in km
 * @property {Object} drinkPref
 * @property {CurrentLocationType} location
 * @property {Array<CurrentLocationType>} locationList for the location auto complete
 * @returns {Filter}
 */
const Filter = () => {
  const distanceAttr = Attribute(1, 'distanceFilter');
  distanceAttr.getObs(LABEL).setValue('Distanz in KM');

  const drinkPrefAttr = Attribute({beer: true, wine: true, cocktail: false}, 'drinkPref');
  drinkPrefAttr.getObs(LABEL).setValue('Drinkpräverenzen');

  const currentLocation = Attribute('');

  const currentAddress = Attribute('');
  currentAddress.getObs(LABEL).setValue('Aktueller Standort');

  const locationList = Attribute([]);

  return {
    distance: distanceAttr,
    drinkPref: drinkPrefAttr,
    location: currentLocation,
    locationList: locationList,
    currentAddress: currentAddress
  }
}

/**
 * renders the filter to the root element
 * @param {AppController} appController 
 * @param {HTMLElement} rootElement
 * @param {selectionController} selectionController
 */
const FilterView = (appController, rootElement, filterModel, selectionController, locationController) => {
  const render = () => filterProjector(filterModel, appController, rootElement, selectionController, locationController);
  render();
}