import {POINTS_TYPE, CITIES, DESTINATIONS} from "../data.js";
import {getRandomInteger, getRandomElement, getRandomSubArray} from "../utils/common.js";
import {generateTimeInterval} from "../utils/date.js";
import {generateOffer} from "./offer.js";

const DESTINATION_LIMIT = 5;
const PHOTOS_LIMIT = 5;
const PRICE_LIMIT = 600;

const generateType = () => {
  const types = Array.from(POINTS_TYPE.values())
    .reduce((one, two) => one.concat(two), []);

  return getRandomElement(types);
};

const generatePhotos = () => {
  return new Array(getRandomInteger(0, PHOTOS_LIMIT))
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

export const generatePoints = () => {
  const type = generateType();
  const timeInterval = generateTimeInterval();

  return {
    type,
    city: getRandomElement(CITIES),
    offers: generateOffer(type),
    timeStart: timeInterval.start,
    timeEnd: timeInterval.end,
    price: getRandomInteger(0, PRICE_LIMIT),
    isFavorite: Boolean(getRandomInteger()),
    destination: getRandomSubArray(DESTINATIONS, DESTINATION_LIMIT),
    photos: generatePhotos(),
  };
};
