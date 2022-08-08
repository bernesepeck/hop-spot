
export { toBar }

const toBar = (jsonDev, idx) => (
    {
        id:   idx,
        title: jsonDev.title, 
        openTimes: jsonDev.openTimes,
        coordinates: jsonDev.coordinates,
        menu: jsonDev.menu,
        image: jsonDev.image,
        openingTimes: jsonDev.openingTimes
    }
);