import { TestSuite } from '../../common/kolibri/util/test.js';
import { AppController } from '../appController.js';

const filterSuite = TestSuite('filter');

filterSuite.add('openNow', (assert) => {
  //Arrange
  const now = new Date('08.08.2022');
  now.setHours(17, 15);

  const controller = AppController();

  assert.is(now.getDay(), 1);

  const periods = [
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

  //Assert

  assert.is(controller.isOpenNow(now, periods), true);

  now.setHours(1, 0);

  assert.is(controller.isOpenNow(now, periods), false);

  now.setHours(0, 0);

  assert.is(controller.isOpenNow(now, periods), true);

  now.setDate(12);

  assert.is(controller.isOpenNow(now, periods), false);
});

filterSuite.run();
