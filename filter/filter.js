import { Attribute, LABEL } from '../common/kolibri/presentationModel.js';
import { filterProjector } from './filterProjector.js';

export { Filter, FilterView };

/**
 * Type for the Current Location
 * @typedef CurrentLocationType
 * @property {import('./controller.js').LocationType} location
 * @property {string} address
 */

/**
 * @typedef DrinkPrefType
 * @property {boolean} beer
 * @property {boolean} wine
 * @property {boolean} cocktail
 */

/**
 * Creates a filter model to bind input to model
 * @typedef FilterType
 * @property {import('../common/kolibri/presentationModel.js').AttributeType<number>} distance in km
 * @property {import('../common/kolibri/presentationModel.js').AttributeType<DrinkPrefType>} drinkPref
 * @property {import('../common/kolibri/presentationModel.js').AttributeType<Array<CurrentLocationType>>} locationList
 * @property {import('../common/kolibri/presentationModel.js').AttributeType<string>} currentAddress
 * @returns {FilterType}
 */
const Filter = () => {
  /** @type {import('../common/kolibri/presentationModel.js').AttributeType<String>} */
  const distanceAttr = Attribute(1, 'distanceFilter');
  distanceAttr.getObs(LABEL).setValue('Distanz in KM');

  const drinkPrefAttr = Attribute(
    { beer: true, wine: true, cocktail: false },
    'drinkPref'
  );
  drinkPrefAttr.getObs(LABEL).setValue('Drinkpräverenzen');

  const currentAddress = Attribute('');
  currentAddress.getObs(LABEL).setValue('Aktueller Standort');

  const locationList = Attribute([]);

  return {
    distance: distanceAttr,
    drinkPref: drinkPrefAttr,
    locationList: locationList,
    currentAddress: currentAddress,
  };
};

/**
 * renders the filter to the root element
 * @param {import('../appController.js').AppControllerType} appController
 * @param {HTMLElement} rootElement
 */
const FilterView = (appController, rootElement) => {
  const render = () => filterProjector(appController, rootElement);
  render();
  appController.onBarSelected((value) => {
    if (!value) {
      render();
    }
  });
};
