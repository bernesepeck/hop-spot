import { AppController } from './appController.js';
import { loadBars } from './service/localService.js';
import { filterProjector } from './filter/filterProjector.js';

const appController = AppController();

loadBars().forEach(bar => appController.addBar(bar));

//OpenFilter
document.getElementById('open-filter').addEventListener('click', () => {
  document.getElementById('site-wrapper').replaceChildren(filterProjector());
})
