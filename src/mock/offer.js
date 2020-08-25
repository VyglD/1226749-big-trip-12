import {getRandomInteger} from "../utils/common.js";
import {OFFERS} from "../data.js";

export const generateOffer = (type) => {
  return OFFERS.get(type).map((offer) => {
    return Object.assign(
        {checked: Boolean(getRandomInteger())},
        offer
    );
  });
};
