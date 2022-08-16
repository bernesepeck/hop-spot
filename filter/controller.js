import { Observable } from '../common/kolibri/observable.js';
import { VALUE } from '../common/kolibri/presentationModel.js';
export { LocationController };
import { locationService } from '../service/locationService.js';

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
 * @property {() => void} clearLocation
 * @property {() => void} getCurrentLocation
 * @property {(location1: LocationType, location2: LocationType) => number} getDistance
 * @property {(searchString: string) => void} onLocationSearched
 * @property {() => boolean} isCurrentLocationSet
 * @param {import('./filter.js').FilterType} filterModel
 * @param {any} noLocation
 *
 * @returns {LocationControllerType}
 */
const LocationController = (filterModel, noLocation) => {
  const selectedLocationModelObs = Observable(noLocation);
  let isCurrentLocation = false;
  selectedLocationModelObs.onChange(() => (isCurrentLocation = false));

  /**
   * Gets the current user position with the navigator API
   */
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    /**@type {LocationType} */
    const location = { lat: 0, lng: 0 };
    // handle success case
    function onSuccess(position) {
      location.lat = position.coords.latitude;
      location.lng = position.coords.longitude;
      setCurrentUserLocation(location);
    }

    // handle error case
    function onError() {
      setCurrentUserLocation(undefined);
    }
  };

  const setCurrentUserLocation = (location) => {
    selectedLocationModelObs.setValue({
      location: location,
      address: location
        ? 'Aktueller Standort'
        : 'Aktueller Standort nicht gefunden',
    });
    isCurrentLocation = true;
  };

  /**
   *
   * @param {LocationType} location1
   * @param {LocationType} location2
   * @return {number} distance
   */
  const getDistance = (location1, location2) => {
    const loc1 = { ...location1 };
    const loc2 = { ...location2 };
    loc1.lat = (loc1.lat * Math.PI) / 180;
    loc1.lng = (loc1.lng * Math.PI) / 180;
    loc2.lat = (loc2.lat * Math.PI) / 180;
    loc2.lng = (loc2.lng * Math.PI) / 180;

    // Haversine formula
    let dlon = loc2.lng - loc1.lng;
    let dlat = loc2.lat - loc1.lat;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(loc1.lat) * Math.cos(loc2.lat) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers.
    let r = 6371;

    // calculate the result
    return c * r;
  };

  /**
   * Calls the location auto complete service with the value
   * @param {string} value
   */
  const onLocationSearched = (value) => {
    const updateLocationList = (value) =>
      filterModel.locationList.getObs(VALUE).setValue(value);
    if (value.length > 3) {
      locationService().getLocationAutoCompleteList(value, updateLocationList);
    } else {
      updateLocationList([]);
    }
  };

  /**
   * Clears the location
   */
  const clearLocation = () => {
    selectedLocationModelObs.setValue(noLocation);
    filterModel.currentAddress.getObs(VALUE).setValue('');
  };

  return {
    setSelectedLocationModel: selectedLocationModelObs.setValue,
    getSelectedLocationModel: selectedLocationModelObs.getValue,
    onLocationModelSelected: selectedLocationModelObs.onChange,
    clearLocation: clearLocation,
    getCurrentLocation: getCurrentLocation,
    getDistance: getDistance,
    onLocationSearched: onLocationSearched,
    isCurrentLocationSet: () => isCurrentLocation,
  };
};
