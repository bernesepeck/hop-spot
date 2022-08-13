/**
 * @module AppController
 */

import { Bar, SelectionController } from './bar/controller.js';
import { VALUE } from './common/kolibri/presentationModel.js';
import { LocationController } from './filter/controller.js';
import { Filter } from './filter/filter.js';

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
 * @property {(onlyCheck?: Boolean) => void} findBar
 * @property {(searchString: string) => void} onLocationSearched
 * @property {() => void} onMountFilterView
 * @property {() => void} setCurrentUserLocation
 * @property {(date: Date, openTimes: import('./bar/controller.js').OpeningTimesType[]) => Boolean} isOpenNow
 * @property {(location: import('./filter/controller.js').LocationAddressType) => {}} setSelectedLocationModel
 * @property {import('./filter/filter.js').FilterType} filterModel
 * @property {(callback: CallableFunction) => import('./bar/controller.js').BarType} onBarSelected
 * @property {() => void} clearBarSelection
 * @property {(CallableFunction) => {}} onNoBarFoundChange
 * @property {() => boolean} getNoBarFound
 * @property {() => import('./bar/controller.js').BarType} getSelectedBar
 * @property {(CallableFunction) => boolean} onBarLoading
 * @property {() => void} clearLocation
 * @property {() => boolean} isCurrentLocationSet
 */

/**
 * AppController
 * @returns {AppControllerType}
 */
const AppController = () => {
  const filterModel = Filter();
  const locationController = LocationController(filterModel, {});
  const selectionController = SelectionController(null);

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
   * @param {boolean} [onlyCheck]
   * @return {void}
   */
  const findBar = (onlyCheck = false) => {
    if (!onlyCheck) selectionController.setBarLoading(true);

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
      locationController.getDistance(
        currentLocation?.location,
        bar.getCoordinates()
      );
    const filteredBars = barList.filter(
      (b) =>
        isOpenNow(new Date(), b.getOpeningTimes()) &&
        compareDrinkpref(b) &&
        compareDistance(b)
    );
    const bar = filteredBars[Math.floor(Math.random() * barList.length)];
    bar?.setDistance(
      locationController.getDistance(
        bar.getCoordinates(),
        currentLocation?.location
      )
    );
    if (bar) {
      if (!onlyCheck) {
        setTimeout(() => {
          selectionController.setBarLoading(false);
          selectionController.setSelectedModel(bar);
        }, 4000);
      }
      selectionController.setNoBarFound(false);
    } else {
      selectionController.setNoBarFound(true);
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
    onLocationSearched: locationController.onLocationSearched,
    onMountFilterView: onMountFilterView,
    setCurrentUserLocation: locationController.setCurrentUserLocation,
    isOpenNow: isOpenNow,
    setSelectedLocationModel: locationController.setSelectedLocationModel,
    filterModel: filterModel,
    onBarSelected: selectionController.onModelSelected,
    clearBarSelection: selectionController.clearSelection,
    onNoBarFoundChange: selectionController.onNoBarFoundChange,
    getNoBarFound: selectionController.getNoBarFound,
    getSelectedBar: selectionController.getSelectedModel,
    onBarLoading: selectionController.onBarLoading,
    clearLocation: locationController.clearLocation,
    isCurrentLocationSet: locationController.isCurrentLocationSet,
  };
};
