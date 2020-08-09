import {tripEventTypes} from "./data.js";

export const generateTripEventLabel = (type) => {
  if (tripEventTypes.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};
