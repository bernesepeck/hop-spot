import { AppController } from './appController.js';
import { loadBars } from './service/localService.js';
import { Filter, FilterView } from './filter/filter.js';
import { SelectionController } from './bar/controller.js';
import { BarView } from './bar/bar.js';
import { LocationController } from './filter/controller.js';
import { VALUE } from './common/kolibri/presentationModel.js';

const rootElement = document.getElementById('site-wrapper');

const filterModel = Filter();
const selectionController = SelectionController(null);
const locationController = LocationController(null);
const appController = AppController(locationController, filterModel, selectionController);


BarView(selectionController, rootElement);


loadBars().forEach(bar => appController.addBar(bar));

//OpenFilter
document.getElementById('open-filter').addEventListener('click', () => {
  FilterView(appController, rootElement, filterModel, selectionController, locationController);
})
