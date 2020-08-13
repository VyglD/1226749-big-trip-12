import {TRIP_EVENT_TYPES} from "./data.js";

const ESC_KEYCODE = 27;

const shuffleArray = function (arr) {
  return arr.slice().sort(function () {
    return 0.5 - Math.random();
  });
};

export const generateTripEventLabel = (type) => {
  if (TRIP_EVENT_TYPES.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomSubArray = function (arr, length = arr.length) {
  // Проверка допустимости использования переданного числа вместо длины массива
  length = Math.min(length, arr.length);

  const half = Math.floor(length / 2);
  const start = getRandomInteger(0, half);
  const end = getRandomInteger(half, length);

  return shuffleArray(arr).slice(start, end);
};

export const getRandomElement = (list) => {
  const randomIndex = getRandomInteger(0, list.length - 1);

  return list[randomIndex];
};

export const isEscEvent = function (evt) {
  return evt.keyCode === ESC_KEYCODE;
};
