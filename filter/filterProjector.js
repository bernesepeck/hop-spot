import {  VALUE, LABEL } from '../common/kolibri/presentationModel.js';
import { button } from '../common/elements/button.js';
import {title} from '../common/elements/title.js';
export {filterProjector};

/**
 * Projector to create the view for the filter
 * @param filterModel
 * @param appController
 * @param {SelectionController} selectionController
 * @param {LocationController} locationController
 * @return {HTMLElement}
 */
 const filterProjector = (filterModel, appController, rootElement, selectionController, locationController) => {
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
   * @param {AttributeType<T>} Attr
   * @param {number} min
   * @param {number} max
   * @return {HTMLElement}
   */
  const rangeInput = (Attr, min = 0, max = 100) => {
    const wrapper = document.createElement('DIV');
    const rangeInput = document.createElement("INPUT");
    rangeInput.setAttribute('type', 'range');
    rangeInput.setAttribute('id', Attr.getQualifier());
    rangeInput.setAttribute('min', min);
    rangeInput.setAttribute('max', max);
    
    const labelElement = label(Attr.getObs(LABEL).getValue(), Attr.getQualifier());
    //binding data to input
    bindTextInput(Attr, rangeInput, labelElement);

    //sets the css costum property to show value when sliding the slider
    Attr.getObs(VALUE).onChange(value => {
      const newPosition = ((value - min) * 100) / (max - min);
      rangeInput.style.setProperty("--current-value", value);
      rangeInput.style.setProperty("--current-position", `calc(${newPosition}% + (${8 - newPosition * 0.20}px))`);
    })

    wrapper.appendChild(labelElement);
    wrapper.appendChild(rangeInput)
    return wrapper;
  };

  const autoComplete = (AttrInput, AttrList, AttrCurrentListItem) => {
    const wrapper = document.createElement('DIV');
    const inputElement = document.createElement('INPUT');
    const autoCompleteWrapper = document.createElement('DIV');
    const listElement = document.createElement('DIV');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('id', AttrInput.getQualifier());
    autoCompleteWrapper.setAttribute('class', 'auto-complete');
    listElement.setAttribute('class', 'auto-complete-list');
    

    const labelElement = label(AttrInput.getObs(LABEL).getValue(), AttrInput.getQualifier());
    //binding data to input
    bindTextInput(AttrInput, inputElement, labelElement);

    //Bind Event to Input to get locations for the autocomplete list
    inputElement.addEventListener('input', () => appController.onLocationSearched(inputElement.value, filterModel));
    //Add the auto complete list
    AttrList.getObs(VALUE).onChange(value => {
      listElement.innerHTML = '';
      if(value.length) {
        listElement.style.display = 'block';
        value.forEach(location => {
          const item = document.createElement('LI');
          item.addEventListener('click', () => {locationController.setSelectedLocationModel(location); listElement.style.display = 'none';});
          item.textContent = location.address;
          listElement.appendChild(item);
        })
      } else {
        listElement.style.display = 'none';
      }
    });
    autoCompleteWrapper.appendChild(listElement);
    autoCompleteWrapper.appendChild(inputElement);
    wrapper.appendChild(labelElement);
    wrapper.appendChild(autoCompleteWrapper)
    return wrapper;
  }

  filter.appendChild(title('Was ist dir wichtig?', 1));
  filter.appendChild(autoComplete(filterModel.currentAddress, filterModel.locationList, filterModel.location));
  filter.appendChild(rangeInput(filterModel.distance, 0, 10));
  filter.appendChild(buttonList(label('Drinkpräverenzen', 'drink-filter'), filterModel.drinkPref));
  filter.appendChild(button('Finde Bar', () => selectionController.setSelectedModel(appController.findBar(filterModel))));
  

  rootElement.replaceChildren(filter);
  appController.onMountFilterView();
}


