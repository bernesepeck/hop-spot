/**
 * @module AppController
 */

import { Bar } from './bar/controller.js';
import { Observable } from './common/kolibri/observable.js';
import { VALUE } from './common/kolibri/presentationModel.js';
import { locationService } from './service/locationService.js';

export { AppController };

/**
 * @typedef BarDataType
 * @property {string} title
 * @property {import('./bar/controller.js').OpenTimesType} openTimes
 * @property {import('./filter/controller.js').LocationType} coordinates
 * @property {import('./bar/controller.js').MenuType} menu
 * @property {string} image
 * @property {import('./bar/controller.js').OpeningTimesType[]} openingTimes
 */

/**
 * @typedef AppControllerType
 * @property {(bar: BarDataType) => void} addBar
 * @property {(onlyCheck: Boolean) => void} findBar
 * @property {(searchString: string) => void} onLocationSearched
 * @property {() => void} onMountFilterView
 * @property {() => void} setCurrentUserLocation
 * @property {(date: Date, openTimes: import('./bar/controller.js').OpeningTimesType[]) => Boolean} isOpenNow
 */

/**
 * AppController
 * @param {import('./filter/controller.js').LocationControllerType} locationController
 * @param {import('./filter/filter.js').FilterType} filterModel
 * @param {import('./bar/controller.js').SelectionControllerType} selectionController
 * @returns {AppControllerType}
 */
const AppController = (
  locationController,
  filterModel,
  selectionController
) => {
  /**@type {Array<import('./bar/controller.js').BarType>} */
  const barList = [];

  /**
   * @param {BarDataType} barData
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

  /**
   *
   * @param {import('./filter/controller.js').LocationType} location1
   * @param {import('./filter/controller.js').LocationType} location2
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
   * Returns boolean if the location is open in the time provided
   * @param {Date} date to check if location is open then
   * @param {Array<import('./bar/controller.js').OpeningTimesType>} periods when the location is open
   * @returns  {boolean}
   */
  const isOpenNow = (date, periods) => {
    if (!periods.length) return false;
    const weekdayNow = date.getDay();
    const todaysOpenTimes = periods?.filter(
      (p) => p.open.day === weekdayNow || p.close?.day === weekdayNow
    );
    if (!todaysOpenTimes.length) return false;
    const openAt = todaysOpenTimes.find((t) => t.open.day === weekdayNow)?.open
      .time;
    const closeAt = todaysOpenTimes.find((t) => t.close?.day === weekdayNow)
      ?.close.time;
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
   * @return {void}
   */
  const findBar = (onlyCheck = false) => {
    const currentLocation = locationController.getSelectedLocationModel();
    const compareDrinkpref = (bar) => {
      const filter = filterModel.drinkPref.getObs(VALUE).getValue();
      const selectedFilter = Object.entries(filter)
        .filter((item) => item[1])
        .some((item) => bar.getMenu()[item[0]]);
      return selectedFilter;
    };
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
      locationService().getLocationAutoCompleteList(value, updateLocationList);
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
    findBar: findBar,
    onLocationSearched: onLocationSearched,
    onMountFilterView: onMountFilterView,
    setCurrentUserLocation: locationController.setCurrentUserLocation,
    isOpenNow: isOpenNow,
  };
};
