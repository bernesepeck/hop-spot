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
 * @property {() => LocationType} getCurrentLocation
 * @property {() => void} setCurrentUserLocation
 * @param {any} noLocation
 *
 * @returns {LocationControllerType}
 */
const LocationController = (noLocation) => {
  const selectedLocationModelObs = Observable(noLocation);

  /**
   * Gets the current user position with the navigator API
   * @returns {LocationType}
   */
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // handle success case
    function onSuccess(position) {
      console.log(position);
    }

    // handle error case
    function onError() {
      console.log('error');
    }
    //Mock as geolocation only works with https
    return { lat: 46.94113, lng: 7.43047 };
  };

  const setCurrentUserLocation = () => {
    selectedLocationModelObs.setValue({
      location: getCurrentLocation(),
      address: 'Aktueller Standort',
    });
  };

  return {
    setSelectedLocationModel: selectedLocationModelObs.setValue,
    getSelectedLocationModel: selectedLocationModelObs.getValue,
    onLocationModelSelected: selectedLocationModelObs.onChange,
    clearLocation: () => selectedLocationModelObs.setValue(noLocation),
    getCurrentLocation: getCurrentLocation,
    setCurrentUserLocation: setCurrentUserLocation,
  };
};
