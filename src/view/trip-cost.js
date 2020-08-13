import {createElement} from "../dom-util.js";

export default class TripCost {
  constructor(tripEvents) {
    this._totalCost = this._getTotalTripCost(tripEvents);
    this._element = null;
  }

  _getTotalTripCost(tripEvents) {
    let totalTripCost = 0;

    for (const tripEvent of tripEvents) {
      totalTripCost += tripEvent.price;

      for (const offer of tripEvent.offers) {
        totalTripCost += offer.cost;
      }
    }

    return totalTripCost;
  }

  getTemplate() {
    return (
      `<p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._totalCost}</span>
        </p>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
