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

export const OFFERS = new Map([
  [`Taxi`, [
    {
      name: `Order Uber`,
      cost: 20,
    }
  ]],
  [`Bus`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Train`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Ship`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Transport`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Drive`, [
    {
      name: `Rent a car`,
      cost: 200,
    }
  ]],
  [`Flight`, [
    {
      name: `Add luggage`,
      cost: 30,
    },
    {
      name: `Switch to comfort class`,
      cost: 100,
    },
    {
      name: `Add meal`,
      cost: 15,
    },
    {
      name: `Choose seats`,
      cost: 5,
    },
    {
      name: `Travel by train`,
      cost: 40,
    }
  ]],
  [`Check-in`, [
    {
      name: `Add breakfast`,
      cost: 50,
    }
  ]],
  [`Sightseeing`, [
    {
      name: `Book tickets`,
      cost: 40,
    },
    {
      name: `Lunch in city`,
      cost: 30,
    }
  ]],
  [`Restaurant`, [
    {
      name: `Musical accompaniment`,
      cost: 10,
    }
  ]],
]);

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
