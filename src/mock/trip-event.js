const DESTINATION_LIMIT = 5;
const PHOTOS_LIMIT = 5;
const PRICE_LIMIT = 600;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const shuffleArray = function (arr) {
  return arr.slice().sort(function () {
    return 0.5 - Math.random();
  });
};

const getRandomSubArray = function (arr, length = arr.length) {
  // Проверка допустимости использования переданного числа вместо длины массива
  length = Math.min(length, arr.length);

  const half = Math.floor(length / 2);
  const start = getRandomInteger(0, half);
  const end = getRandomInteger(half, length);

  return shuffleArray(arr).slice(start, end);
};

const generateType = () => {
  const types = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`,
  ];

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateTarget = () => {
  const targets = [
    `Amsterdam`,
    `Chamonix`,
    `Geneva`,
    `Berlin`,
    `Vena`,
    `Paris`
  ];

  const randomIndex = getRandomInteger(0, targets.length - 1);

  return targets[randomIndex];
};

const generateOffers = (type) => {
  const offers = new Map([
    [`Taxi`, [
      {
        name: `Order Uber`,
        cost: 20,
      }
    ]],
    [`Bus`, []],
    [`Train`, []],
    [`Ship`, []],
    [`Transport`, []],
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

  return getRandomSubArray(offers.get(type));
};

const generateDestination = () => {
  const destinations = [
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

  return getRandomSubArray(destinations, DESTINATION_LIMIT);
};

const generatePhotos = () => {
  return new Array(getRandomInteger(0, PHOTOS_LIMIT))
    .fill(`http://picsum.photos/248/152?r=${Math.random()}`);
};

const generateTimeInterval = () => {
  const start = new Date();
  const end = new Date();

  start.setHours(
      getRandomInteger(1, 23),
      getRandomInteger(0, 59),
      getRandomInteger(0, 59),
      getRandomInteger(0, 999)
  );

  end.setHours(
      getRandomInteger(start.getHours(), 23),
      getRandomInteger(start.getMinutes(), 59),
      getRandomInteger(0, 59),
      getRandomInteger(0, 999)
  );

  return {
    start,
    end,
  };
};

export const generateTripEvent = () => {
  const type = generateType();
  const offers = generateOffers(type);
  const timeInterval = generateTimeInterval();

  return {
    type,
    target: generateTarget(),
    offers,
    destination: generateDestination(),
    photos: generatePhotos(),
    timeStart: timeInterval.start,
    timeEnd: timeInterval.end,
    price: getRandomInteger(0, PRICE_LIMIT),
    isFavorite: Boolean(getRandomInteger()),
  };
};

