import {POINTS_TYPE, CITIES, DESTINATIONS, DESTINATION_LIMIT} from "../data.js";
import {
  getRandomInteger,
  getRandomElement,
  getRandomSubArray,
  generateId,
  generatePhotos
} from "../utils/common.js";
import {generateTimeInterval} from "../utils/date.js";
import {generateOffers} from "./offers.js";

const PRICE_LIMIT = 600;

const generateType = () => {
  const types = Array.from(POINTS_TYPE.values())
    .reduce((one, two) => one.concat(two), []);

  return getRandomElement(types);
};

export const generatePoints = () => {
  const type = generateType();
  const timeInterval = generateTimeInterval();

  return {
    id: generateId(),
    type,
    city: getRandomElement(CITIES),
    offers: generateOffers(type),
    timeStart: timeInterval.start,
    timeEnd: timeInterval.end,
    price: getRandomInteger(0, PRICE_LIMIT),
    isFavorite: Boolean(getRandomInteger()),
    destination: getRandomSubArray(DESTINATIONS, DESTINATION_LIMIT),
    photos: generatePhotos(),
  };
};
