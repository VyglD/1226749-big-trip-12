import {POINTS_TYPE, CITIES, DESTINATIONS, DESTINATION_LIMIT, UserAction} from "../data.js";
import {generatePointLabel, getRandomSubArray, generatePhotos} from "../utils/common.js";
import {getFormattedTimeString} from "../utils/date.js";
import {getOffersByType} from "../utils/offers.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import moment from "moment";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  type: POINTS_TYPE.values().next().value[0],
  city: CITIES[0],
  offers: getOffersByType(POINTS_TYPE.values().next().value[0]),
  timeStart: new Date(),
  timeEnd: new Date(),
  price: 0,
  destination: getRandomSubArray(DESTINATIONS),
  photos: generatePhotos()
};

const FLATPICKR_PROPERIES = {
  'dateFormat': `DD/MM/YY HH:mm`,
  'enableTime': true,
  'time_24hr': true,
  'formatDate': (date, format) => {
    return moment(date).format(format);
  },
};

export default class PointEditView extends SmartView {
  constructor(point) {
    super();
    if (!point) {
      point = BLANK_POINT;
      this._isNew = true;
    }

    this._data = Object.assign({}, point);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._pointCityChangeHandler = this._pointCityChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._pointPriceChangeHandler = this._pointPriceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  getTemplate() {
    const {type, timeStart, timeEnd, price} = this._data;

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
            ${this._createTypesListTemplate()}
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
            readonly
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
            readonly
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
            type="number"
            name="event-price"
            value="${price}"
          >
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">
          ${this._isNew ? `Cansel` : `Delete`}
        </button>

        ${this._createTripFavoriteButtonTemplate()}
      </header>

      ${this._createTripDetailsTemplate()}

    </form>`
    );
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._formCloseHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.pointDelete = callback;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteButtonClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);

    if (!this._isNew) {
      this.setFormCloseHandler(this._callback.formClose);
      this.setDeleteClickHandler(this._callback.pointDelete);
    }
  }

  reset(point) {
    this.updateDate(point);
  }

  _setDatepickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign(
            {
              defaultDate: this._data.timeStart,
              onChange: this._startDateChangeHandler
            },
            FLATPICKR_PROPERIES
        )
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign(
            {
              defaultDate: this._data.timeEnd,
              minDate: this._data.timeStart,
              onChange: this._endDateChangeHandler
            },
            FLATPICKR_PROPERIES
        )
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`)
      .addEventListener(`click`, this._pointTypeChangeHandler);
    this.getElement().querySelector(`.event__field-group--destination`)
      .addEventListener(`change`, this._pointCityChangeHandler);
    this.getElement().querySelector(`.event__input--price`)
      .addEventListener(`change`, this._pointPriceChangeHandler);

    if (this._data.offers.length) {
      this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offersChangeHandler);
    }

    if (!this._isNew) {
      this.getElement().querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, this._favoriteClickHandler);
    }
  }

  _createTripFavoriteButtonTemplate() {
    const {isFavorite} = this._data;

    return !this._isNew
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
    const {offers} = this._data;

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
                name="${offer.name}"
                ${offer.checked ? `checked` : ``}
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
    const {destination, photos} = this._data;

    return (destination.length || photos.length)
      ? (
        `<section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">
            Destination
          </h3>
          <p class="event__destination-description">
            ${destination.join(` `)}
          </p>

          ${this._createTripDestinationPhotosTemplate()}
        </section>`
      )
      : ``;
  }

  _createTripDestinationPhotosTemplate() {
    const {photos} = this._data;

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
    const {offers, destination, photos} = this._data;
    return (destination.length || photos.length || offers.length)
      ? (`<section class="event__details">
          ${this._createTripOffersSectionTemplate()}
          ${this._createTripDestinationDescriptionTemplate()}
        </section>`
      )
      : ``;
  }

  _createTripCityTemplate() {
    const {type, city} = this._data;

    return (
      `<div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-1">
          ${generatePointLabel(type)}
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

  _createTypesListItemTemplate(type, isChecked) {
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

  _createTypesListTemplate() {
    const checkedType = this._data.type;

    return Array.from(POINTS_TYPE.entries())
      .map(([kind, types]) => {
        return (
          `<fieldset class="event__type-group">
            <legend class="visually-hidden">${kind}</legend>
            ${types.map((type) => {
            return this._createTypesListItemTemplate(type, type === checkedType);
          }).join(``)}
          </fieldset>`
        );
      }).join(``);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  _favoriteClickHandler() {
    this.updateDate(
        {
          isFavorite: !this._data.isFavorite
        },
        true
    );
  }

  _pointTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    const type = evt.target.value[0].toUpperCase() + evt.target.value.slice(1);

    this.getElement().querySelector(`.event__type-toggle`).checked = false;

    const offers = getOffersByType(type);

    this.updateDate({type, offers});
  }

  _pointCityChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT` && evt.target.value === this._data.city) {
      return;
    }

    const newCity = evt.target.value;

    if (CITIES.includes(newCity)) {
      evt.target.setCustomValidity(``);
    } else {
      evt.target.setCustomValidity(`Выбранный город отсутсвует в списке`);
      return;
    }

    this.updateDate(
        {
          city: newCity,
          destination: getRandomSubArray(DESTINATIONS, DESTINATION_LIMIT)
        }
    );
  }

  _offersChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    const offers = this._data.offers.map((offer) => Object.assign({}, offer));
    const offer = offers.find((it) => it.name === evt.target.name);
    offer.checked = !offer.checked;

    this.updateDate({offers}, true);
  }

  _pointPriceChangeHandler(evt) {
    if (evt.target.value === this._data.price) {
      return;
    }

    this.updateDate(
        {
          price: parseInt(evt.target.value, 10),
        },
        true
    );
  }

  _startDateChangeHandler([userDate]) {
    const timeStart = new Date(userDate);
    const timeEnd = (timeStart > this._data.timeEnd) ? timeStart : this._data.timeEnd;

    this._endDatepicker.set(`minDate`, timeStart);
    this._endDatepicker.setDate(timeEnd);
    this.updateDate({timeStart, timeEnd}, true);
  }

  _endDateChangeHandler([userDate]) {
    this.updateDate(
        {
          timeEnd: new Date(userDate)
        },
        true
    );
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.pointDelete(UserAction.DELETE_POINT, this._data);
  }
}
