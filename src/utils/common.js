import {POINT_TYPES} from "../const.js";

const ESC_KEYCODE = 27;

const TagName = {
  INPUT: `INPUT`,
  A: `A`
};

const isTagName = (evt, tag) => {
  return evt.target.tagName === tag;
};

export const generatePointLabel = (type) => {
  if (POINT_TYPES.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};

export const isEscEvent = (evt) => {
  return evt.keyCode === ESC_KEYCODE;
};

export const getTimeInterval = (point) => {
  return point.timeEnd - point.timeStart;
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

export const isOnline = () => {
  return window.navigator.onLine;
};
