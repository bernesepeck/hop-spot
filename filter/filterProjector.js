import {  VALUE, LABEL } from '../common/kolibri/presentationModel.js';
export {filterProjector};

/**
 * Projector to create the view for the filter
 * @param filterModel
 * @param appController
 * @return {HTMLElement}
 */
 const filterProjector = (filterModel, appController) => {
  const filter = document.createElement("DIV");
  filter.setAttribute('class', 'filter-wrapper');

  /**
   * Binds Input and Label to Data
   * @param {import('../common/kolibri/presentationModel.js').AttributeType} Attr
   * @param {HTMLElement} inputElement 
   * @param {HTMLElement} labelElement 
   */
  const bindTextInput = (Attr, inputElement, labelElement) => {
    inputElement.oninput = () => Attr.setConvertedValue(inputElement.value);
    Attr.getObs(VALUE).onChange(value => inputElement.value = value);
    Attr.getObs(LABEL).onChange(label => { inputElement.setAttribute('title', label); labelElement.textContent = label; });
  }

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
   * Binds Button Group to Data Model
   * @param {*} Attr 
   * @param {*} buttonGroup 
   */
  const bindButtonGroup = (Attr, buttonGroup) => {
    Array.from(buttonGroup.children).forEach(b => b.addEventListener('click', (event) => {
      const value = Attr.getObs(VALUE).getValue();
      const key = event.currentTarget.id.replace(`${Attr.getQualifier()}-`,'')
      
      //toggle class active and toggle value
      event.currentTarget.classList.toggle('active');
      value[key] = Array.from(event.currentTarget.classList).some(c => c === 'active');
      
      Attr.setConvertedValue(value);
    }));
  }

   /**
   * Create a button list
   * @param {string} label
   * @param {Attr} Attr
   * @return {HTMLElement}
   */
  const buttonList = (label, Attr) => {
    const wrapper = document.createElement('DIV');
    const buttonGroup = document.createElement("DIV");
    buttonGroup.setAttribute('class', 'button-list');
    const buttons = []
    const attrValue = Attr.getObs(VALUE).getValue();
    Object.keys(attrValue).forEach(key => {
      const buttonWrapper = document.createElement("DIV");
      buttonWrapper.innerHTML = `<button id="${Attr.getQualifier()}-${key}" class="icon-button ${attrValue[key] ? 'active' : ''}"><span class="icon-${key}"></span></button>`
      buttonGroup.appendChild(buttonWrapper.firstChild)
    });
    buttonGroup.append(buttons);
    bindButtonGroup(Attr, buttonGroup);

    wrapper.appendChild(label);
    wrapper.appendChild(buttonGroup);
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
    //binding data to input
    bindTextInput(Attr, rangeInput, labelElement);

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
  filter.appendChild(buttonList(label('Drinkpräverenzen', 'drink-filter'), filterModel.drinkPref));
  filter.appendChild(button('Finde Bar', () => appController.findBar(filterModel)));
  

  return filter;
}


