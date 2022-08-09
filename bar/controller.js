import { Observable } from '../common/kolibri/observable.js';

export { SelectionController, Bar };

/**
 * @typedef BarType
 * @property {() => string} getTitle
 * @property {(string) => {}} setTitle
 * @property {() => OpenTimesType} getOpenTimes
 * @property {(OpenTimesType) => {}} setOpenTimes
 * @property {() => import('../filter/controller.js').LocationType} getCoordinates
 * @property {(location: import('../filter/controller.js').LocationType) => {}} setCoordinates
 * @property {() => number} getDistance
 * @property {(number) => {}} setDistance
 * @property {() => MenuType} getMenu
 * @property {(MenuType) => {}} setMenu
 * @property {() => string} getImage
 * @property {(string) => {}} setImage
 * @property {(value: OpeningTimesType[]) => {}} setOpeningTimes
 * @property {() => OpeningTimesType[]} getOpeningTimes
 */

/**
 * @typedef OpenTimesType
 * @property {Date} from
 * @property {Date} to
 */

/**
 * @typedef MenuType
 * @property {boolean} beer
 * @property {boolean} wine
 * @property {boolean} cocktail
 */

/**
 * @typedef OpeningTimesType
 * @property {OpeningDayTimesType} [close]
 * @property {OpeningDayTimesType} open
 */

/**
 * @typedef OpeningDayTimesType
 * @property {number} day
 * @property {string} time
 */

/**
 * @returns {BarType}
 */
const Bar = () => {
  let title = '';
  let openTimes = {
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(new Date().setHours(0, 0, 0, 0)),
  };
  let coordinates = { lat: 0, lng: 0 };
  let distance = 0;
  let menu = { beer: false, wine: false, cocktail: false };
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

/**
 * This controller manages the current selected bar or if there was no bar found
 * @typedef SelectionControllerType
 * @property {(BarType) => {}} setSelectedModel
 * @property {() => BarType} getSelectedModel
 * @property {(CallableFunction) => BarType} onModelSelected
 * @property {(boolean) => {}} setNoBarFound
 * @property {() => boolean} getNoBarFound
 * @property {() => boolean} onNoBarFoundChange
 * @property {() => {}} clearSelection
 * @param {*} noSelection
 * @returns {SelectionControllerType}
 */
const SelectionController = (noSelection) => {
  const selectedModelObs = Observable(noSelection);
  const noBarFound = Observable(false);

  return {
    setSelectedModel: selectedModelObs.setValue,
    getSelectedModel: selectedModelObs.getValue,
    onModelSelected: selectedModelObs.onChange,
    setNoBarFound: noBarFound.setValue,
    getNoBarFound: noBarFound.getValue,
    onNoBarFoundChange: noBarFound.onChange,
    clearSelection: () => selectedModelObs.setValue(noSelection),
  };
};
