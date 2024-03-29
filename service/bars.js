export { bars };

const bars = [
  {
    title: 'Tramdepot',
    openTimes: { from: '1658581943', to: '1658610000' },
    coordinates: { lat: 46.947498, lng: 7.45966 },
    menu: { beer: true, wine: false, cocktail: true },
    image: '/hop-spot/assets/pub.jpg',
    openingTimes: [
      {
        close: { day: 1, time: '0030' },
        open: { day: 0, time: '1100' },
      },
      {
        close: { day: 2, time: '0030' },
        open: { day: 1, time: '1100' },
      },
      {
        close: { day: 3, time: '0030' },
        open: { day: 2, time: '1100' },
      },
      {
        close: { day: 4, time: '0030' },
        open: { day: 3, time: '1100' },
      },
      {
        close: { day: 5, time: '0030' },
        open: { day: 4, time: '1100' },
      },
      {
        close: { day: 6, time: '0030' },
        open: { day: 5, time: '1100' },
      },
      {
        close: { day: 0, time: '0030' },
        open: { day: 6, time: '0800' },
      },
    ],
  },
];
