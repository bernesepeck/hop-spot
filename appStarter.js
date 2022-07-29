import { AppController } from './appController.js';
import { loadBars } from './service/localService.js';
import { Filter, FilterView } from './filter/filter.js';
import { SelectionController } from './bar/controller.js';
import { BarView } from './bar/bar.js';

const rootElement = document.getElementById('site-wrapper');

const filterModel = Filter();
const appController = AppController();
const selectionController = SelectionController(null);

BarView(selectionController, rootElement);


loadBars().forEach(bar => appController.addBar(bar));

//OpenFilter
document.getElementById('open-filter').addEventListener('click', () => {
  FilterView(appController, rootElement, filterModel, selectionController);
})
