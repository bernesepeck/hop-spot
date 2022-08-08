import { total } from '../common/kolibri/util/test.js';
import { versionInfo } from '../common/kolibri/version.js';

import './filterTestSuite.js';

total.onChange(
  (value) =>
    (document.getElementById('grossTotal').textContent =
      '' + value + ' tests done.')
);

document.querySelector('footer').textContent =
  'Built with Kolibri ' + versionInfo;
