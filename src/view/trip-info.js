import {getTripDateInterval} from "../date-util.js";
import AbstractView from "./abstract.js";

const LIMIT_ROUTE_CITY = 3;

export default class TripInfo extends AbstractView {
  constructor(tripEvents) {
    super();
    this._tripEvents = tripEvents;
  }


  _getTripRoute() {
    const points = this._tripEvents;
    const route = [];

    for (const tripEvent of points) {
      if (route[route.length - 1] !== tripEvent.city) {
        route.push(tripEvent.city);
      }

      if (route.length > LIMIT_ROUTE_CITY) {
        return `${points[0].city} &mdash; ... &mdash; ${points[points.length - 1].city}`;
      }
    }

    return route.join(` &mdash; `);
  }

  getTemplate() {
    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">
            ${this._getTripRoute()}
          </h1>

          <p class="trip-info__dates">${getTripDateInterval(this._tripEvents)}</p>
        </div>
      </section>`
    );
  }
}
