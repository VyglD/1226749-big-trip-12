export const TRIP_EVENT_TYPES = new Map([
  [`Transfer`, [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ]],
  [`Activity`, [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ]]
]);

export const CITIES = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`,
];

export const DESTINATIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

export const FILTERS = [
  `everything`,
  `future`,
  `past`
];

export const SortType = {
  DEFAULT: `Event`,
  TIME: `Time`,
  PRICE: `Price`
};
