import { bars } from './bars.js';
import { toBar } from './jsonToModel.js';

export { loadBars };

const loadBars = () => bars.map((bar) => toBar(bar));
