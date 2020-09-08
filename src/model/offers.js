import Observer from "../utils/observer";
import {transformToCapitalize} from "../utils/common.js";

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = new Map();
  }

  setOffersFromServer(serverOffers) {
    serverOffers.forEach(({type, offers}) => {
      this._offers.set(
          transformToCapitalize(type),
          offers
      );
    });
  }

  getOffers() {
    return this._offers;
  }
}
