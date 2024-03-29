import { title } from '../common/elements/title.js';
import { button } from '../common/elements/button.js';

export { barProjector, loadingProjector };

/**
 * Projector for the bar view
 * @param {import('../appController.js').AppControllerType} appController
 * @param {HTMLElement} rootElement
 * @param {import('./controller.js').BarType} bar
 */
const barProjector = (appController, rootElement, bar) => {
  const barElement = document.createElement('DIV');
  barElement.setAttribute('class', 'bar');
  const dataWrapperElement = document.createElement('DIV');
  dataWrapperElement.setAttribute('class', 'data-wrapper');

  /**
   * renders a data item, which is label and value
   * @param {string} label
   * @param {string} value
   */
  const dataItem = (label, value) => {
    const dataItem = document.createElement('DIV');
    dataItem.classList.add('data');
    const labelElement = document.createElement('LABEL');
    labelElement.textContent = label;
    const valueElement = document.createElement('SPAN');
    valueElement.textContent = value;

    dataItem.append(labelElement, valueElement);
    return dataItem;
  };

  const image = (src) => {
    const image = document.createElement('IMG');
    image.setAttribute('src', src);
    return image;
  };

  /**
   * Converts date to HH:mm
   * @param {Date} date
   * @returns {string} time in HH:mm
   */
  const dateToTimeString = (date) =>
    date.toTimeString().split(' ')[0].slice(0, -3);

  /**
   * Converts date string to number
   * @param {Date} stringDate
   * @returns
   */
  const dateStringToDate = (stringDate) => new Date(Number(stringDate));

  const roundDecimal = (number) => Math.round(number * 100) / 100;

  barElement.appendChild(title(bar.getTitle(), 1));
  barElement.appendChild(image(bar.getImage()));
  dataWrapperElement.appendChild(
    dataItem('Öffnungszeiten', bar.getTodaysOpeningTimes())
  );
  dataWrapperElement.appendChild(
    dataItem('Distanz', `${roundDecimal(bar.getDistance())}km`)
  );
  barElement.appendChild(dataWrapperElement);

  barElement.appendChild(
    button('Nächste Bar', () => appController.clearBarSelection())
  );
  rootElement.replaceChildren(barElement);
};

const loadingProjector = (rootElement) => {
  const loadingWrapper = document.createElement('DIV');
  loadingWrapper.classList.add('loading-wrapper');
  const svg = document.createElement('OBJECT');
  svg.setAttribute('data', '/hop-spot/assets/beertapglas.svg');
  svg.setAttribute('width', '300px');
  svg.setAttribute('height', '600px');
  loadingWrapper.appendChild(svg);
  rootElement.replaceChildren(loadingWrapper);
};
