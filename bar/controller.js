import { Observable } from '../common/kolibri/observable.js';
export { SelectionController };

const SelectionController = (noSelection) => {
  const selectedModelObs = Observable(noSelection);
  const noBarFound = Observable(false);

  return {
    setSelectedModel: selectedModelObs.setValue,
    getSelectedModel: selectedModelObs.getValue,
    onModelSelected: selectedModelObs.onChange,
    setNoBarFound: noBarFound.setValue,
    getNoBarFound: noBarFound.getValue,
    onNoBarFoundChange: noBarFound.onChange,
    clearSelection: () => selectedModelObs.setValue(noSelection),
  };
};
