import {  VALUE, LABEL } from '../common/kolibri/presentationModel.js';
export {filterProjector};

/**
 * Projector zum erstellen von der View für die Filter
 * @return {HTMLElement}
 */
 const filterProjector = (filterModel) => {
   console.log(filterModel);
  const filter = document.createElement("DIV");
  filter.setAttribute('class', 'filter-wrapper');

  /**
   * Erstellt ein Label mit dem Text und label
   * @param {string} text 
   * @param {string} id 
   * @returns {HTMLElement}
   */
  const label = (text, id) => {
    const label = document.createElement("LABEL");
    label.textContent = text;
    label.setAttribute('id', id)
    return label;
  }

   /**
    * Erstellt eine Button List
   * @param {string} label
   * @return {HTMLElement}
   */
  const buttonList = (label) => {
    const wrapper = document.createElement('DIV');
    const buttonGroup = document.createElement("DIV");
    const template = 
    `<div class="button-list">
      <button class="icon-button active"><span class="icon-beer"></span></button>
      <button class="icon-button"><span class="icon-wine"></span></button>
      <button class="icon-button"><span class="icon-cocktail"></span></button>
    </div>`

    buttonGroup.innerHTML = template;
    wrapper.appendChild(label);
    wrapper.appendChild(buttonGroup.firstChild)
    return wrapper;
  };

  /**
   * Erstellt ein RangeInput
   * @param {HTMLElement} label
   * @param {AttributeType<T>} Attr
   * @return {HTMLElement}
   */
  const rangeInput = (Attr) => {
    const wrapper = document.createElement('DIV');
    const rangeInput = document.createElement("INPUT");
    rangeInput.setAttribute('type', 'range');
    rangeInput.setAttribute('id', Attr.getQualifier());
    const labelElement = label(Attr.getObs(LABEL).getValue(), Attr.getQualifier());
    //Binding der Daten auf das Input
    Attr.getObs(VALUE).onChange(value => rangeInput.value = value);
    Attr.getObs(LABEL).onChange(label => {rangeInput.setAttribute('title', label); labelElement.textContent = label});

    wrapper.appendChild(labelElement);
    wrapper.appendChild(rangeInput)
    return wrapper;
  };

  /**
   * Erstellt einen Button
   * @param {*} text 
   * @param {*} callFunction 
   * @returns 
   */
  const button = (text, callFunction) => {
    const button = document.createElement('BUTTON');
    button.setAttribute('class', 'button');
    button.addEventListener('click', callFunction)
    button.textContent = text;
    return button;
  }

  const title = (text, size) => {
    const title = document.createElement(`h${size}`, text);
    title.textContent = text;
    return title;
  }

  filter.appendChild(title('Was ist dir wichtig?', 1));
  filter.appendChild(rangeInput(filterModel.distance));
  filter.appendChild(buttonList(label('Drinkpräverenzen', 'drink-filter')));
  filter.appendChild(button('Finde Bar', () => {}));
  

  return filter;
}