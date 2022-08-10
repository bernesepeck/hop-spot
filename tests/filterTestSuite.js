import { TestSuite } from '../../common/kolibri/util/test.js';
import { AppController } from '../appController.js';
import { VALUE } from '../common/kolibri/presentationModel.js';

const filterSuite = TestSuite('filter');

//OpenNow Tests
const getPeriods = (alwaysOpen = false) => {
  return alwaysOpen
    ? [
        {
          open: { day: 0, time: '0000' },
        },
        {
          open: { day: 1, time: '0000' },
        },
        {
          open: { day: 2, time: '0000' },
        },
        {
          open: { day: 3, time: '0000' },
        },
        {
          open: { day: 4, time: '0000' },
        },
        {
          open: { day: 5, time: '0000' },
        },
        {
          open: { day: 6, time: '0000' },
        },
      ]
    : [
        {
          close: { day: 1, time: '0030' },
          open: { day: 0, time: '1100' },
        },
        {
          close: { day: 2, time: '0030' },
          open: { day: 1, time: '1100' },
        },
        {
          close: { day: 3, time: '0030' },
          open: { day: 2, time: '1100' },
        },
      ];
};

filterSuite.add(
  'openNow: should return boolean if the bar is open now',
  (assert) => {
    //Arrange
    const now = new Date('08.08.2022');
    now.setHours(17, 15);

    assert.is(now.getDay(), 1);

    const periods = getPeriods();

    const controller = AppController();

    //Assert
    assert.is(controller.isOpenNow(now, periods), true);

    now.setHours(1, 0);

    assert.is(controller.isOpenNow(now, periods), false);

    now.setHours(0, 0);

    assert.is(controller.isOpenNow(now, periods), true);

    now.setDate(12);

    assert.is(controller.isOpenNow(now, periods), false);
  }
);

//FindBar Tests

/**@type {import('../appController.js').BarDataType} */
const bar = {
  title: 'tramdepot',
  openTimes: { from: new Date(), to: new Date() },
  openingTimes: getPeriods(),
  //Coordinates of Tscharnerstrasse 5, Bern
  coordinates: { lat: 46.94113, lng: 7.43047 },
  menu: { beer: true, wine: true, cocktail: false },
  image: '',
};

filterSuite.add(
  'findBar: should set noBarFound in selectionController when no Bar matched the filter',
  (assert) => {
    //Arrange
    const controller = AppController();
    controller.addBar(bar);

    //Action
    controller.findBar(true);

    //Assert
    assert.is(controller.getNoBarFound(), true);
  }
);

filterSuite.add(
  'findBar: should return bar when all filter match and distance within filter',
  (assert) => {
    //Arrange
    const controller = AppController();

    //Match all other Filters
    controller.filterModel.drinkPref.getObs(VALUE).setValue(bar.menu);
    bar.openingTimes = getPeriods(true);
    controller.addBar(bar);

    //Set Distance of currentLocation within 2km of radius
    controller.setSelectedLocationModel({
      location: { lat: 46.94847, lng: 7.436773 }, //coordinates of Bern Bahnhof
      address: '',
    });

    controller.filterModel.distance.getObs(VALUE).setValue(2);

    //Action
    controller.findBar(false);

    //Assert
    assert.is(controller.getNoBarFound(), false);
    assert.is(controller.getSelectedBar().getTitle(), bar.title);
  }
);

filterSuite.add(
  'findBar: should set barNotFound when all filter match expect distance within filter',
  (assert) => {
    //Arrange
    const controller = AppController();

    //Match all other Filters
    controller.filterModel.drinkPref.getObs(VALUE).setValue(bar.menu);
    bar.openingTimes = getPeriods(true);
    controller.addBar(bar);

    controller.setSelectedLocationModel({
      location: { lat: 45.706539, lng: 4.795532 }, //coordinates far away in lyon
      address: '',
    });

    controller.filterModel.distance.getObs(VALUE).setValue(1);

    //Action
    controller.findBar(false);

    //Assert
    assert.is(controller.getNoBarFound(), true);
  }
);

filterSuite.add(
  'findBar: should return bar when all filter match and one of the drinkPref matches within filter',
  (assert) => {
    //Arrange
    const controller = AppController();
    //Match all other Filters
    bar.openingTimes = getPeriods(true);
    controller.addBar(bar);
    controller.setSelectedLocationModel({
      location: bar.coordinates,
      address: '',
    });

    //Match one drink with the drinkPref
    controller.filterModel.drinkPref
      .getObs(VALUE)
      .setValue({ beer: true, wine: false, cocktail: false });

    controller.filterModel.distance.getObs(VALUE).setValue(2);

    //Action
    controller.findBar(false);

    //Assert
    assert.is(controller.getNoBarFound(), false);
    assert.is(controller.getSelectedBar().getTitle(), bar.title);
  }
);

filterSuite.run();
