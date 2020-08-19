import {generateTripEventLabel} from "../utils/common.js";
import {getHumanizeTime, getHumanizeTimeInterval} from "../utils/date.js";
import AbstractView from "./abstract.js";

export default class TripEvent extends AbstractView {
  constructor(tripEvent) {
    super();
    this._tripEvent = tripEvent;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _createTimeTemplate() {
    const {timeStart, timeEnd} = this._tripEvent;
    return (
      `<p class="event__time">
        <time class="event__start-time" datetime="${timeStart.toISOString()}">
          ${getHumanizeTime(timeStart)}
        </time>
        &mdash;
        <time class="event__end-time" datetime="${timeEnd.toISOString()}">
          ${getHumanizeTime(timeEnd)}
        </time>
      </p>
      <p class="event__duration">${getHumanizeTimeInterval(timeEnd - timeStart)}</p>`
    );
  }

  _createTripEventOffersTemplate() {
    return this._tripEvent.offers.map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.cost}</span>
        </li>`
      );
    }).join(``);
  }

  getTemplate() {
    const {
      type,
      city,
      price,
    } = this._tripEvent;

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
            ${this._createTimeTemplate()}
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._createTripEventOffersTemplate()}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._editClickHandler);
  }
}
