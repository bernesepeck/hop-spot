export { toBar };

const toBar = (jsonDev, idx) => ({
  id: idx,
  title: jsonDev.title,
  coordinates: jsonDev.coordinates,
  menu: jsonDev.menu,
  image: jsonDev.image,
  openingTimes: jsonDev.openingTimes,
});
