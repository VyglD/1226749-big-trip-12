const LIMIT_ROUTE_TARGET = 3;

import {getDateAtShortFormat} from "../util.js";

const getTripDateInterval = (tripEvents) => {
  const start = getDateAtShortFormat(tripEvents[0].timeStart).split(` `);
  const end = getDateAtShortFormat(tripEvents[tripEvents.length - 1].timeStart).split(` `);

  if (start[0] === end[0]) {
    end[0] = ``;
  }

  return `${start[0]} ${start[1]}&nbsp;&mdash;&nbsp;${end[1]} ${end[0]}`;
};

const getTripRoute = (tripEvents) => {
  const route = [];
  for (const tripEvent of tripEvents) {
    if (route[route.length - 1] !== tripEvent.target) {
      route.push(tripEvent.target);
    }

    if (route.length > LIMIT_ROUTE_TARGET) {
      return `${tripEvents[0].target} &mdash; ... &mdash; ${tripEvents[tripEvents.length - 1].target}`;
    }
  }

  return route.join(` &mdash; `);
};

export const createTripInfoTemplate = (tripEvents) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${getTripRoute(tripEvents)}
        </h1>

        <p class="trip-info__dates">${getTripDateInterval(tripEvents)}</p>
      </div>
    </section>`
  );
};
