import { Attribute, LABEL } from '../common/kolibri/presentationModel.js'

export { Filter };

/**
 * Erstellt das Binding Model für den Filter
 * @typedef Filter
 * @returns {Filter}
 */
const Filter = () => {
  const distanceAttr = Attribute(10, 'distanceFilter');
  distanceAttr.getObs(LABEL).setValue('Distanz in Meter');

  const drinkPrefAttr = Attribute({beer: true, wine: false, cocktail: false}, 'drinkPref');
  drinkPrefAttr.getObs(LABEL).setValue('Drinkpräverenzen');

  return {
    distance: distanceAttr,
    drinkPref: drinkPrefAttr
  }
}