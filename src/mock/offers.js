import {getRandomInteger} from "../utils/common.js";
import {getOffersByType} from "../utils/offers.js";

export const generateOffers = (type) => {
  const offers = getOffersByType(type);

  offers.forEach((offer) => {
    offer.checked = Boolean(getRandomInteger());
  });

  return offers;
};
