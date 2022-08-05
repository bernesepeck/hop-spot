import { Observable } from '../common/kolibri/observable.js';
export {LocationController};

const LocationController = noLocation => {

  const selectedLocationModelObs = Observable(noLocation);

  return {
      setSelectedLocationModel : selectedLocationModelObs.setValue,
      getSelectedLocationModel : selectedLocationModelObs.getValue,
      onLocationModelSelected:   selectedLocationModelObs.onChange,
      clearLocation:     () => selectedLocationModelObs.setValue(noLocation),
  }
};