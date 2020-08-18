import {TRIP_EVENT_TYPES, CITIES} from "../data.js";
import {generateTripEventLabel} from "../util.js";
import {getFormattedTimeString} from "../date-util.js";
import AbstractView from "./abstract.js";

const BLANK_TRIP_EVENT = {
  type: `Flight`,
  city: ``,
  offers: [],
  timeStart: new Date(),
  timeEnd: new Date(),
  price: ``,
  isFavorite: `new`,
  destination: [],
  photos: []
};

export default class TripEventEdit extends AbstractView {
  constructor(tripEvent = BLANK_TRIP_EVENT) {
    super();
    this._tripEvent = tripEvent;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
  }

  _createTripFavoriteButtonTemplate() {
    const {isFavorite} = this._tripEvent;

    return isFavorite !== `new`
      ? (
        `<input
          id="event-favorite-1"
          class="event__favorite-checkbox visually-hidden"
          type="checkbox"
          name="event-favorite"
          ${isFavorite ? `checked` : ``}
        >
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path
              d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"
            />
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
      )
      : ``;
  }

  _createTripOffersSectionTemplate() {
    const {offers} = this._tripEvent;

    return offers.length
      ? (
        `<section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
        ${offers.map((offer) => {
          return (
            `<div class="event__offer-selector">
              <input
                class="event__offer-checkbox visually-hidden"
                id="event-offer-${offer.name}-1"
                type="checkbox"
                name="event-offer-${offer.name}"
              >
              <label class="event__offer-label" for="event-offer-${offer.name}-1">
                <span class="event__offer-title">${offer.name}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.cost}</span>
              </label>
            </div>`
          );
        }).join(``)}
          </div>
        </section>`
      )
      : ``;
  }

  _createTripDestinationDescriptionTemplate() {
    const {destination, photos} = this._tripEvent;

    return (destination.length || photos.length)
      ? (
        `<section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination.join(` `)}
          </p>

          ${this._createTripDestinationPhotosTemplate()}

        </section>`
      )
      : ``;
  }

  _createTripDestinationPhotosTemplate() {
    const {photos} = this._tripEvent;

    return photos.length
      ? (
        `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${photos.map((src) => `<img class="event__photo" src="${src}" alt="Event photo">`)
              .join(``)}
          </div>
        </div>`
      )
      : ``;
  }

  _createTripDetailsTemplate() {
    const {offers, destination, photos} = this._tripEvent;
    return (destination.length || photos.length || offers.length)
      ? (`<section class="event__details">
          ${this._createTripOffersSectionTemplate()}
          ${this._createTripDestinationDescriptionTemplate()}
        </section>`
      )
      : ``;
  }

  _createTripCityTemplate() {
    const {type, city} = this._tripEvent;

    return (
      `<div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-1">
          ${generateTripEventLabel(type)}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${city}"
          list="destination-list-1"
        >
        <datalist id="destination-list-1">
          ${CITIES.map((it) => `<option value="${it}"></option>`).join(``)}
        </datalist>
      </div>`
    );
  }

  _createTypeItemTripEventTemplate(type, isChecked) {
    return (
      `<div class="event__type-item">
        <input
          id="event-type-${type.toLowerCase()}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type.toLowerCase()}"
          ${isChecked ? `checked` : ``}
        >
        <label
          class="event__type-label event__type-label--${type.toLowerCase()}"
          for="event-type-${type.toLowerCase()}-1"
        >${type}</label>
      </div>`
    );
  }

  _createTypesListTripEventTemplate() {
    const checkedType = this._tripEvent.type;

    return Array.from(TRIP_EVENT_TYPES.entries())
      .map(([kind, types]) => {
        return (
          `<fieldset class="event__type-group">
          <legend class="visually-hidden">${kind}</legend>
          ${types.map((type) => {
            return this._createTypeItemTripEventTemplate(type, type === checkedType);
          }).join(``)}
          </fieldset>`
        );
      }).join(``);
  }

  getTemplate() {
    const {type, timeStart, timeEnd, price} = this._tripEvent;

    return (
      `<form class="trip-events__item event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${type.toLowerCase()}.png"
              alt="Event type icon"
            >
          </label>
          <input
            class="event__type-toggle visually-hidden"
            id="event-type-toggle-1"
            type="checkbox"
          >
          <div class="event__type-list">
            ${this._createTypesListTripEventTemplate()}
          </div>
        </div>

        ${this._createTripCityTemplate()}

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text" name="event-start-time"
            value="${getFormattedTimeString(timeStart)}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
            <input
            class="event__input event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${getFormattedTimeString(timeEnd)}"
          >
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${price}"
          >
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>

        ${this._createTripFavoriteButtonTemplate()}
      </header>

      ${this._createTripDetailsTemplate()}

    </form>`
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._formCloseHandler);
  }
}
