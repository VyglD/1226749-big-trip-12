import AbstractView from "./abstract.js";

export default class CostView extends AbstractView {
  constructor(points) {
    super();
    this._totalCost = this._getTotalTripCost(points);
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

  _getTotalTripCost(points) {
    let totalTripCost = 0;

    for (const point of points) {
      totalTripCost += point.price;

      if (point.offers) {
        for (const offer of point.offers) {
          if (offer.checked) {
            totalTripCost += offer.price;
          }
        }
      }
    }

    return totalTripCost;
  }
}
