import {POINTS_TYPE} from "../data.js";

const ESC_KEYCODE = 27;
const PHOTOS_LIMIT = 5;

const TagName = {
  INPUT: `INPUT`,
  A: `A`
};

const isTagName = (evt, tag) => {
  return evt.target.tagName === tag;
};

const shuffleArray = (arr) => {
  return arr.slice().sort(() => {
    return 0.5 - Math.random();
  });
};

export const generatePointLabel = (type) => {
  if (POINTS_TYPE.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomSubArray = (arr, length = arr.length) => {
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

export const isEscEvent = (evt) => {
  return evt.keyCode === ESC_KEYCODE;
};

export const getTimeInterval = (point) => {
  return point.timeEnd - point.timeStart;
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generatePhotos = () => {
  return new Array(getRandomInteger(0, PHOTOS_LIMIT))
    .fill()
    .map(() => {
      return {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: `Event photo`
      };
    });
};

export const isInputTag = (evt) => {
  return isTagName(evt, TagName.INPUT);
};

export const isATag = (evt) => {
  return isTagName(evt, TagName.A);
};

export const transformToCapitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};
