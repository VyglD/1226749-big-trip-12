import {tripEventTypes} from "./data.js";

export const generateTripEventLabel = (type) => {
  if (tripEventTypes.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};

export const getDateAtShortFormat = (date) => {
  return date.toLocaleString(`en-US`, {month: `short`, day: `2-digit`});
};
