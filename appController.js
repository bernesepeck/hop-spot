/**
 * @module AppController
 */

import { Observable } from './common/kolibri/observable.js';
import { VALUE } from './common/kolibri/presentationModel.js';

export {AppController}

/**
 * AppController
 * @returns 
 */
const AppController = () => {

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
/**@type {Array<Bar>} */
  const barList = [];

  /** 
   * @param {Bar} barData 
   * */
  const addBar = barData => {
    const bar = Bar();
    bar.setTitle(barData.title);
    bar.setOpenTimes(barData.openTimes);
    bar.setCoordinates(barData.coordinates);
    bar.setMenu(barData.menu);
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
    return {lat:46.941130, lng: 7.430470}
  }

  /**
   * @typedef {Object} Location
   * @property {number} lag
   * @property {number} lng
   * @param {Location} location1 
   * @param {Location} location2 
   * @return {number} distance
   */
  const getDistance = (location1, location2) => {
    const loc1 = {...location1};
    const loc2 = {...location2};
    console.log(loc1, loc2);
    loc1.lat = loc1.lat * Math.PI / 180;
    loc1.lng = loc1.lng * Math.PI / 180;
    loc2.lat = loc2.lat * Math.PI / 180;
    loc2.lng = loc2.lng * Math.PI / 180;

     // Haversine formula
     let dlon = loc2.lng  - loc1.lng;
     let dlat = loc2.lat  - loc1.lat;
     let a = Math.pow(Math.sin(dlat / 2), 2)
              + Math.cos(loc1.lat) * Math.cos(loc2.lat)
              * Math.pow(Math.sin(dlon / 2),2);
            
     let c = 2 * Math.asin(Math.sqrt(a));

      // Radius of earth in kilometers.
      let r = 6371;
   
      // calculate the result
      return(c * r);
  }

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
      setSelectedBar: setSelectedBar
    }
  }

  /**
   * Findet zufällig eine Bar mit den Filterkriterien
   * @param {*} filterModel 
   */
  const findBar = (filterModel) => {
    const filteredBars = barList.filter(b => JSON.stringify(filterModel.drinkPref.getObs(VALUE).getValue()) === JSON.stringify(b.getMenu()) && filterModel.distance.getObs(VALUE).getValue() >= getDistance(getCurrentLocation(), b.getCoordinates()))
    const bar =  filteredBars[Math.floor(Math.random()*barList.length)];
    bar?.setDistance(getDistance(bar.getCoordinates(), getCurrentLocation()));
    return bar;
  }



  return {
    addBar:             addBar,
    removeBar:          barList.del,
    onBarAdd:           barList.onAdd,
    onBarRemove:        barList.onDel,
    getCurrentLocation: getCurrentLocation,
    findBar:            findBar,
    selectedBar:        selectedBar
}
}