import { AppController } from './appController.js';
import { loadBars } from './service/localService.js';

const appController = AppController();

loadBars().forEach(bar => appController.addBar(bar));

