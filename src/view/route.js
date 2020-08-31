import {getTripDateInterval} from "../utils/date.js";
import AbstractView from "./abstract.js";

const LIMIT_ROUTE_CITY = 3;

export default class RouteView extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">
          ${this._getTripRoute()}
        </h1>

        <p class="trip-info__dates">${getTripDateInterval(this._points)}</p>
      </div>`
    );
  }

  _getTripRoute() {
    const points = this._points;
    const route = [];

    for (const point of points) {
      if (route[route.length - 1] !== point.city) {
        route.push(point.city);
      }

      if (route.length > LIMIT_ROUTE_CITY) {
        return `${points[0].city} &mdash; ... &mdash; ${points[points.length - 1].city}`;
      }
    }

    return route.join(` &mdash; `);
  }
}
