/**
 * @module AppController
 */

import { Observable } from './common/kolibri/observable.js';
import { VALUE } from './common/kolibri/presentationModel.js';
import { LocationController } from './filter/controller.js';
import { locationService } from './service/locationService.js';

export { AppController };

/**
 * AppController
 * @param {LocationControllerType} locationController
 * @param {FilterModel} filterModel
 * @param {SelectionController} selectionController
 * @returns
 */
const AppController = (
  locationController,
  filterModel,
  selectionController
) => {
  /**
   *
   * @typedef Bar
   * @property {Function} getTitle
   * @property {Function} getOpenTimes
   * @property {Function} getCoordinates
   * @property {Function} getDistance
   * @property {Function} getMenu
   * @returns {Bar}
   */
  const Bar = () => {
    let title = '';
    let openTimes = {
      from: new Date(new Date().setHours(0, 0, 0, 0)),
      to: new Date(new Date().setHours(0, 0, 0, 0)),
    };
    let coordinates = { lat: 0, lng: 0 };
    let distance = 0;
    let menu = { beer: false, wine: false, food: false };
    let image = '';
    let openingTimes = [];

    return {
      getTitle: () => title,
      setTitle: (value) => (title = value),
      getOpenTimes: () => openTimes,
      setOpenTimes: (value) => (openTimes = value),
      getCoordinates: () => coordinates,
      setCoordinates: (value) => (coordinates = value),
      getDistance: () => distance,
      setDistance: (value) => (distance = value),
      getMenu: () => menu,
      setMenu: (value) => (menu = value),
      getImage: () => image,
      setImage: (value) => (image = value),
      getOpeningTimes: () => openingTimes,
      setOpeningTimes: (value) => (openingTimes = value),
    };
  };
  /**@type {Array<Bar>} */
  const barList = [];

  /**
   * @param {Bar} barData
   * */
  const addBar = (barData) => {
    const bar = Bar();
    bar.setTitle(barData.title);
    bar.setOpenTimes(barData.openTimes);
    bar.setCoordinates(barData.coordinates);
    bar.setMenu(barData.menu);
    bar.setImage(barData.image);
    bar.setOpeningTimes(barData.openingTimes);
    barList.push(bar);
  };

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
    locationController.setSelectedLocationModel({
      location: getCurrentLocation(),
      address: 'Aktueller Standort',
    });
  };

  /**
   * @typedef {Object} Location
   * @property {number} lag
   * @property {number} lng
   * @param {Location} location1
   * @param {Location} location2
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
   * The current selectedBar
   * @returns {Observable<Bar>}
   */
  const selectedBar = () => {
    /**@type {Observable<Bar>} */
    const selectedBar = Observable();
    getSelectedBar = () => selectedBar.getValue();
    setSelectedBar = (bar) => selectedBar.setValue(bar);

    return {
      getSelectedBar: getSelectedBar,
      setSelectedBar: setSelectedBar,
    };
  };

  /**
   * Returns boolean if the location is open in the time provided
   * @param {Date} date to check if location is open then
   * @param {Array} periods when the location is open
   * @returns  {boolean}
   */
  const isOpenNow = (date, periods) => {
    if (!periods.length) return false;
    const weekdayNow = date.getDay();
    const todaysOpenTimes = periods?.filter(
      (p) => p.open.day === weekdayNow || p.close.day === weekdayNow
    );
    if (!todaysOpenTimes.length) return false;
    const openAt = todaysOpenTimes.find((t) => t.open.day === weekdayNow)?.open
      .time;
    const closeAt = todaysOpenTimes.find((t) => t.close.day === weekdayNow)
      .close.time;
    const timeNow = dateToTimeString(date);
    //Validate if location is open now
    if (Number(timeNow) > Number(openAt)) {
      return !closeAt || Number(openAt) > Number(closeAt);
    } else if (Number(timeNow) < Number(closeAt)) {
      return true;
    }
    return false;
  };

  const dateToTimeString = (date) => {
    const addZeros = (time) => (time.length < 2 ? '0' + time : time);
    return [
      addZeros(date.getHours().toString()),
      addZeros(date.getMinutes().toString()),
    ].join('');
  };

  /**
   * Returns randomly a bar from the list which matches the current set filters
   * @param onlyCheck
   */
  const findBar = (onlyCheck = false) => {
    const currentLocation = locationController.getSelectedLocationModel();
    const compareDrinkpref = (bar) =>
      JSON.stringify(filterModel.drinkPref.getObs(VALUE).getValue()) ===
      JSON.stringify(bar.getMenu());
    const compareDistance = (bar) =>
      filterModel.distance.getObs(VALUE).getValue() >=
      getDistance(currentLocation?.location, bar.getCoordinates());
    const filteredBars = barList.filter(
      (b) =>
        isOpenNow(new Date(), b.getOpeningTimes()) &&
        compareDrinkpref(b) &&
        compareDistance(b)
    );
    const bar = filteredBars[Math.floor(Math.random() * barList.length)];
    bar?.setDistance(
      getDistance(bar.getCoordinates(), currentLocation?.location)
    );
    if (bar) {
      if (!onlyCheck) selectionController.setSelectedModel(bar);
      selectionController.setNoBarFound(false);
    } else {
      selectionController.setNoBarFound(true);
    }
  };

  /**
   * Calls the location auto complete service with the value
   * @param {string} value
   */
  const onLocationSearched = (value) => {
    const updateLocationList = (value) =>
      filterModel.locationList.getObs(VALUE).setValue(value);
    if (value.length > 3) {
      //TODO: Timeout funktioniert nicht, hier muss ein debounce sein.
      setTimeout(
        locationService().getLocationAutoCompleteList(
          value,
          updateLocationList
        ),
        500
      );
    } else {
      updateLocationList([]);
    }
  };

  /**
   * Called when the filter projector is rendered
   */
  const onMountFilterView = () => {
    locationController.onLocationModelSelected((location) => {
      filterModel.currentAddress.setConvertedValue(location?.address ?? '');
      findBar(true);
    });
    filterModel.distance.getObs(VALUE).onChange(() => findBar(true));
    filterModel.drinkPref.getObs(VALUE).onChange(() => findBar(true));
  };

  return {
    addBar: addBar,
    removeBar: barList.del,
    onBarAdd: barList.onAdd,
    onBarRemove: barList.onDel,
    getCurrentLocation: getCurrentLocation,
    findBar: findBar,
    selectedBar: selectedBar,
    onLocationSearched: onLocationSearched,
    onMountFilterView: onMountFilterView,
    setCurrentUserLocation: setCurrentUserLocation,
    isOpenNow: isOpenNow,
  };
};
