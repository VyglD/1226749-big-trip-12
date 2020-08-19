import AbstractView from "./abstract.js";

export default class TripCost extends AbstractView {
  constructor(tripEvents) {
    super();
    this._totalCost = this._getTotalTripCost(tripEvents);
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
          Total: &euro;&nbsp;
          <span class="trip-info__cost-value">
            ${this._totalCost}
          </span>
        </p>`
    );
  }
}
