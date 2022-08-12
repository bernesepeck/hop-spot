import { AppController } from './appController.js';
import { loadBars } from './service/localService.js';
import { FilterView } from './filter/filter.js';
import { BarView, LoadBarView } from './bar/bar.js';

const rootElement = document.getElementById('site-wrapper');
const appController = AppController();

BarView(appController, rootElement);
LoadBarView(appController, rootElement);

loadBars().forEach((bar) => appController.addBar(bar));

//OpenFilter
document.getElementById('open-filter').addEventListener('click', () => {
  FilterView(appController, rootElement);
});
