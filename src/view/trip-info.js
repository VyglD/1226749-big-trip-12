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
  if (tripEvents.length > 3) {
    return `${tripEvents[0].target} &mdash; ... &mdash; ${tripEvents[tripEvents.length - 1].target}`;
  }

  return tripEvents.map((it) => it.target).join(` &mdash; `);
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
