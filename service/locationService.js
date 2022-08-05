export {locationService};

/**
 * Location Service is used to do all the API Calls to get location related data
 * @typedef LocationServiceType
 * @property {Function} getLocationAutoCompleteList gets the location auto complete list for a search string
 * @returns 
 */
const locationService = () => {

  /**
   * Gets a list for the location auto complete
   * @param {string} value search value
   * @param {Function} withLocations callback function which is called with the data
   */
  const getLocationAutoCompleteList = (value, withLocations) => {
    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=f177b317cd6e4aa88eec0949d83e3ae2`, {
      method: 'GET',
    })
  .then(response => response.json())
  .then(result => result.features.map(address => ({address: address.properties.formatted, location: {lat: address.properties.lat, lng: address.properties.lon}})))
  .then(result => withLocations(result))
  .catch(error => console.log('error', error));
    
  
  }
  return {
    getLocationAutoCompleteList: getLocationAutoCompleteList
  }
}
