import {title} from '../common/elements/title.js';
import {button} from '../common/elements/button.js';

export {barProjector};

/**
 * Projector for the bar view
 * @param {SelectionControllerType} selectionController
 * @param {HTMLElement} rootElement
 * @param {Bar} bar
 */
const barProjector = (selectionController, rootElement, bar) => {
  const barElement = document.createElement("DIV");
  barElement.setAttribute('class', 'bar-wrapper');

  /**
   * renders a data item, which is label and value
   * @param {string} label
   * @param {string} value
   */
  const dataItem = (label, value) => {
    const dataItem = document.createElement("DIV");
    dataItem.classList.add('data');
    const labelElement = document.createElement("LABEL");
    labelElement.textContent = label;
    const valueElement = document.createElement("SPAN");
    valueElement.textContent = value;

    dataItem.append(labelElement, valueElement);
    return dataItem;
  }

  const dateToTimeString = (date) => `${date.getHours()}:${date.getMinutes()}`

  const dateStringToDate = (stringDate) => new Date(Number(stringDate));
  

  barElement.appendChild(title(bar.getTitle(), 1));
  barElement.appendChild(dataItem('Öffnungszeiten', `${dateToTimeString(dateStringToDate(bar.getOpenTimes().from))}- ${dateToTimeString(dateStringToDate(bar.getOpenTimes().to))}`));
  barElement.appendChild(dataItem('Distanz', bar.getDistance()));
 
  barElement.appendChild(button('Nächste Bar', () => selectionController(null)))
  rootElement.replaceChildren(barElement);
}