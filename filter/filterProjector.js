import { VALUE, LABEL } from '../common/kolibri/presentationModel.js';
import { button } from '../common/elements/button.js';
import { title } from '../common/elements/title.js';
import { debounce } from '../helpers.js';
export { filterProjector };

/**
 * Projector to create the view for the filter
 * @param {import('../appController.js').AppControllerType} appController
 * @param {HTMLElement} rootElement
 * @return {HTMLElement}
 */
const filterProjector = (appController, rootElement) => {
  const filter = document.createElement('DIV');
  filter.setAttribute('class', 'filter-wrapper');

  /**
   * Binds Input and Label to Data
   * @param {import('../common/kolibri/presentationModel.js').AttributeType<string>} Attr
   * @param {HTMLElement} inputElement
   * @param {HTMLElement} labelElement
   */
  const bindTextInput = (Attr, inputElement, labelElement) => {
    inputElement.oninput = () => Attr.setConvertedValue(inputElement.value);
    Attr.getObs(VALUE).onChange((value) => (inputElement.value = value));
    Attr.getObs(LABEL).onChange((label) => {
      inputElement.setAttribute('title', label);
      labelElement.textContent = label;
    });
  };

  /**
   * Erstellt ein Label mit dem Text und label
   * @param {string} text
   * @param {string} id
   * @returns {HTMLLabelElement}
   */
  const label = (text, id) => {
    const label = document.createElement('LABEL');
    label.textContent = text;
    label.setAttribute('id', id);
    return label;
  };

  /**
   * Binds Button Group to Data Model
   * @param {*} Attr
   * @param {*} buttonGroup
   */
  const bindButtonGroup = (Attr, buttonGroup) => {
    Array.from(buttonGroup.children).forEach((b) =>
      b.addEventListener('click', (event) => {
        const value = { ...Attr.getObs(VALUE).getValue() };
        const key = event.currentTarget.id.replace(
          `${Attr.getQualifier()}-`,
          ''
        );

        //toggle class active and toggle value
        event.currentTarget.classList.toggle('active');
        value[key] = Array.from(event.currentTarget.classList).some(
          (c) => c === 'active'
        );
        Attr.setConvertedValue(value);
      })
    );
  };

  /**
   * Create a button list
   * @param {HTMLLabelElement} label
   * @param {import('../common/kolibri/presentationModel.js').AttributeType<import('../bar/controller.js').MenuType>} Attr
   * @return {HTMLElement}
   */
  const buttonList = (label, Attr) => {
    const wrapper = document.createElement('DIV');
    const buttonGroup = document.createElement('DIV');
    buttonGroup.setAttribute('class', 'button-list');
    const buttons = [];
    const attrValue = { ...Attr.getObs(VALUE).getValue() };
    Object.keys(attrValue).forEach((key) => {
      const buttonWrapper = document.createElement('DIV');
      buttonWrapper.innerHTML = `<button id="${Attr.getQualifier()}-${key}" class="icon-button ${
        attrValue[key] ? 'active' : ''
      }"><span class="icon-${key}"></span></button>`;
      buttonGroup.appendChild(buttonWrapper.firstChild);
    });
    buttonGroup.append(buttons);
    bindButtonGroup(Attr, buttonGroup);

    wrapper.appendChild(label);
    wrapper.appendChild(buttonGroup);
    return wrapper;
  };

  /**
   * Erstellt ein RangeInput
   * @param {import('../common/kolibri/presentationModel.js').AttributeType<number>} attr
   * @param {number} min
   * @param {number} max
   * @return {HTMLElement}
   */
  const rangeInput = (attr, min = 0, max = 100) => {
    const wrapper = document.createElement('DIV');
    const rangeInput = document.createElement('INPUT');
    rangeInput.setAttribute('type', 'range');
    rangeInput.setAttribute('id', attr.getQualifier());
    rangeInput.setAttribute('min', min.toString());
    rangeInput.setAttribute('max', max.toString());

    const labelElement = label(
      attr.getObs(LABEL).getValue(),
      attr.getQualifier()
    );
    //binding data to input
    bindTextInput(attr, rangeInput, labelElement);

    //sets the css costum property to show value when sliding the slider
    attr.getObs(VALUE).onChange((value) => {
      const newPosition = ((value - min) * 100) / (max - min);
      rangeInput.style.setProperty('--current-value', value);
      rangeInput.style.setProperty(
        '--current-position',
        `calc(${newPosition}% + (${8 - newPosition * 0.2}px))`
      );
    });

    wrapper.appendChild(labelElement);
    wrapper.appendChild(rangeInput);
    return wrapper;
  };

  /**
   * Creates location auto complete
   * @param {import('../common/kolibri/presentationModel.js').AttributeType<string>} AttrInput
   * @param {import('../common/kolibri/presentationModel.js').AttributeType<Array<import('./controller.js').LocationAddressType>>} AttrList
   * @returns
   */
  const autoComplete = (AttrInput, AttrList) => {
    const wrapper = document.createElement('DIV');
    //Create Input Element
    const inputElement = document.createElement('INPUT');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('id', AttrInput.getQualifier());
    //Create autocomplete wrapper
    const autoCompleteWrapper = document.createElement('DIV');
    autoCompleteWrapper.setAttribute('class', 'auto-complete');
    //Create Current Location Button
    const currentLocationButton = document.createElement('BUTTON');
    currentLocationButton.classList.add('icon-location');
    currentLocationButton.addEventListener('click', () =>
      appController.setCurrentUserLocation()
    );
    //Create Clear Location Button
    const clearLocationButton = document.createElement('BUTTON');
    clearLocationButton.classList.add('icon-cross');
    clearLocationButton.addEventListener('click', () =>
      appController.clearLocation()
    );
    //Create Listeelement for the autocomplete suggestions
    const listElement = document.createElement('DIV');
    listElement.setAttribute('class', 'auto-complete-list');

    const labelElement = label(
      AttrInput.getObs(LABEL).getValue(),
      AttrInput.getQualifier()
    );
    //binding data to input
    bindTextInput(AttrInput, inputElement, labelElement);

    //Bind Event to Input to get locations for the autocomplete list
    inputElement.addEventListener(
      'input',
      debounce(() => appController.onLocationSearched(inputElement.value), 500)
    );
    //when the current location is set, clear input on focus
    inputElement.addEventListener('focus', () => {
      if (appController.isCurrentLocationSet()) {
        appController.clearLocation();
      }
    });

    //closes the dropdown when clicked beside the dropdown
    rootElement.addEventListener('click', (event) => {
      if (
        AttrList.getObs(VALUE).getValue().length &&
        !(event.target.id === AttrInput.getQualifier())
      ) {
        listElement.style.display = 'none';
      }
    });

    //Add the auto complete list
    AttrList.getObs(VALUE).onChange((value) => {
      listElement.innerHTML = '';
      if (value.length) {
        listElement.style.display = 'block';
        value.forEach((location) => {
          const item = document.createElement('LI');
          item.addEventListener('click', () => {
            appController.setSelectedLocationModel(location);
            listElement.style.display = 'none';
          });
          item.textContent = location.address;
          listElement.appendChild(item);
        });
      } else {
        listElement.style.display = 'none';
      }
    });
    //Append all children
    autoCompleteWrapper.appendChild(listElement);
    autoCompleteWrapper.appendChild(inputElement);
    autoCompleteWrapper.appendChild(currentLocationButton);
    autoCompleteWrapper.appendChild(clearLocationButton);
    wrapper.appendChild(labelElement);
    wrapper.appendChild(autoCompleteWrapper);
    return wrapper;
  };

  /**
   * Toggelt die Error Message
   * @param {HTMLElement} button
   * @param {boolean} showError
   * @param {HTMLElement} errorElement
   */
  const toggleError = (button, showError, errorElement) => {
    if (showError) {
      errorElement.textContent = 'Keine Bar mit diesen Filtern vorhanden';
      button.setAttribute('disabled', 'true');
    } else {
      errorElement.textContent = '';
      button.removeAttribute('disabled');
    }
  };

  const errorMessage = () => {
    const errorMessage = document.createElement('SPAN');
    return errorMessage;
  };

  filter.appendChild(title('Was ist dir wichtig?', 1));
  filter.appendChild(
    autoComplete(
      appController.filterModel.currentAddress,
      appController.filterModel.locationList
    )
  );
  filter.appendChild(rangeInput(appController.filterModel.distance, 0, 10));
  filter.appendChild(
    buttonList(
      label('Drinkpräverenzen', 'drink-filter'),
      appController.filterModel.drinkPref
    )
  );

  const findBarButton = button('Finde Bar', () => appController.findBar());
  const errorMessageElement = errorMessage();
  filter.appendChild(errorMessageElement);
  filter.appendChild(findBarButton);

  appController.onNoBarFoundChange((isBar) =>
    toggleError(findBarButton, isBar, errorMessageElement)
  );

  rootElement.replaceChildren(filter);
  appController.onMountFilterView();
};
