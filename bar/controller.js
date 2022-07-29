import { Observable } from '../common/kolibri/observable.js';
export {SelectionController};

const SelectionController = noSelection => {

  const selectedModelObs = Observable(noSelection);

  return {
      setSelectedModel : selectedModelObs.setValue,
      getSelectedModel : selectedModelObs.getValue,
      onModelSelected:   selectedModelObs.onChange,
      clearSelection:     () => selectedModelObs.setValue(noSelection),
  }
};