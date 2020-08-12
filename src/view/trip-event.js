import {generateTripEventLabel} from "../util.js";
import {getHumanizeTime, getHumanizeTimeInterval} from "../date-util.js";

const createTripEventOffersTemplate = (offers) => {
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.cost}</span>
      </li>`
    );
  }).join(``);
};

const createTimeTemplate = (start, end) => {
  return (
    `<p class="event__time">
      <time class="event__start-time" datetime="${start.toISOString()}">
        ${getHumanizeTime(start)}
      </time>
      &mdash;
      <time class="event__end-time" datetime="${end.toISOString()}">
        ${getHumanizeTime(end)}
      </time>
    </p>
    <p class="event__duration">${getHumanizeTimeInterval(end - start)}</p>`
  );
};

export const createTripEventTemplate = (tripEvent) => {
  const {
    type,
    city,
    offers,
    timeStart,
    timeEnd,
    price,
  } = tripEvent;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img
            class="event__type-icon"
            width="42"
            height="42"
            src="img/icons/${type.toLowerCase()}.png"
            alt="Event type icon"
          >
        </div>
        <h3 class="event__title">${generateTripEventLabel(type)} ${city}</h3>

        <div class="event__schedule">
          ${createTimeTemplate(timeStart, timeEnd)}
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createTripEventOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
