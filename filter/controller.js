import { Observable } from '../common/kolibri/observable.js';
export { LocationController };

/**
 * @typedef LocationType
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef LocationAddressType
 * @property {string} address
 * @property {LocationType} location
 * @param {*} noLocation
 * @returns
 */

/**
 * Holds the selected location
 * @typedef LocationControllerType
 * @property {(location: LocationAddressType) => {}} setSelectedLocationModel
 * @property {() => {location: LocationAddressType}} getSelectedLocationModel
 * @property {CallableFunction} onLocationModelSelected
 * @property {() => {}} clearLocation
 * @param {any} noLocation
 *
 * @returns {LocationControllerType}
 */
const LocationController = (noLocation) => {
  const selectedLocationModelObs = Observable(noLocation);

  return {
    setSelectedLocationModel: selectedLocationModelObs.setValue,
    getSelectedLocationModel: selectedLocationModelObs.getValue,
    onLocationModelSelected: selectedLocationModelObs.onChange,
    clearLocation: () => selectedLocationModelObs.setValue(noLocation),
  };
};
