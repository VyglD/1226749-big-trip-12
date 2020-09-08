import {generatePointLabel, getTimeInterval} from "../utils/common.js";
import {getHumanizeTime, getHumanizeTimeInterval} from "../utils/date.js";
import AbstractView from "./abstract.js";

export default class PointView extends AbstractView {
  constructor(offersByType, point) {
    super();
    this._offersByType = offersByType;
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    const {
      type,
      city,
      price,
    } = this._point;

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
          <h3 class="event__title">${generatePointLabel(type)} ${city}</h3>

          <div class="event__schedule">
            ${this._createTimeTemplate()}
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._createPointOffersTemplate()}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._editClickHandler);
  }

  _createTimeTemplate() {
    const {timeStart, timeEnd} = this._point;

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
      <p class="event__duration">
        ${getHumanizeTimeInterval(getTimeInterval(this._point))}
      </p>`
    );
  }

  _createPointOffersTemplate() {
    return this._point.offers
      ? this._point.offers.map((offer) => {
        return offer
          ? (
            `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`
          )
          : ``;
      }).join(``)
      : ``;
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
}
