import { ObservableList } from "./common/kolibri/observable.js";

/**
 * @module AppController
 */

export {AppController}

const AppController = () => {

  const Bar = () => {
    let title = '';
    let openTimes = {from: new Date(new Date().setHours(0,0,0,0)), to: new Date(new Date().setHours(0,0,0,0))};
    let coordinates = {lat: 0, lng: 0};
    let distance = 0;
    let menu = {beer: false, wine: false, food: false}

    return {
      getTitle: () => title,
      setTitle: (value) => title = value,
      getOpenTimes: () => openTimes, 
      setOpenTimes: (value) => openTimes = value,
      getCoordinates: () => coordinates, 
      setCoordinates: (value) => coordinates = value, 
      getDistance: () => distance, 
      setDistance: (value) => distance = value,
      getMenu: () => menu, 
      setMenu: (value) => menu = value
    }
  }

  const barList = ObservableList([]);

  /** @param {Bar} barData */
  const addBar = barData => {
    const bar = Bar();
    bar.setTitle(barData.title);
    bar.setOpenTimes(barData.openTimes);
    bar.setCoordinates(barData.coordinates);
    bar.setMenu(barData.menu);
    barList.add(bar);
};

  return {
    addBar:             addBar,
    removeBar:          barList.del,
    onBarAdd:           barList.onAdd,
    onBarRemove:        barList.onDel,
}
}