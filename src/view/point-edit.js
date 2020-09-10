import {POINT_TYPES, PointCategory} from "../const.js";
import {
  generatePointLabel,
  isInputTag,
  transformToCapitalize,
  isOnline
} from "../utils/common.js";
import {getFormattedTimeString} from "../utils/date.js";
import AbstractSmartView from "./abstract-smart.js";
import flatpickr from "flatpickr";
import moment from "moment";
import he from "he";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  type: POINT_TYPES.get(PointCategory.TRANSFER)[0],
  city: ``,
  offers: [],
  timeStart: new Date(),
  timeEnd: new Date(),
  price: 0,
  destination: [],
  photos: []
};

const FLATPICKR_PROPERTIES = {
  'dateFormat': `DD/MM/YY HH:mm`,
  'enableTime': true,
  'time_24hr': true,
  'formatDate': (date, format) => {
    return moment(date).format(format);
  },
};

const CLASS_NODE = {
  CITY: `event__field-group--destination`,
  PRICE: `event__input--price`,
};

export default class PointEditView extends AbstractSmartView {
  constructor(destinations, offersByType, point) {
    super();
    this._destinations = destinations.size ? destinations : new Map();
    this._offersByType = offersByType.size ? offersByType : new Map();

    if (!point) {
      point = BLANK_POINT;
      this._isNew = true;
    }

    this._data = PointEditView.convertPointToData(point);
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
    this._checkFormValidity();
  }

  getTemplate() {
    const {
      type,
      timeStart,
      timeEnd,
      price,
      isDisabled,
      isSaving,
      isDeleting
    } = this._data;

    const nameDeleteButton = isDeleting ? `Deleting...` : `Delete`;

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
            ${isDisabled ? `disabled` : ``}
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
            ${isDisabled ? `disabled` : ``}
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
            ${isDisabled ? `disabled` : ``}
            readonly
          >
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input ${CLASS_NODE.PRICE}"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${price}"
            ${isDisabled ? `disabled` : ``}
          >
        </div>

        <button
          class="event__save-btn btn btn--blue"
          type="submit"
          ${isDisabled ? `disabled` : ``}
        >
          ${isSaving ? `Saving...` : `Save`}
        </button>
        <button
          class="event__reset-btn"
          type="reset"
          ${isDisabled ? `disabled` : ``}
        >
          ${this._isNew ? `Cansel` : nameDeleteButton}
        </button>

        ${this._createTripFavoriteButtonTemplate()}
      </header>

      ${this._createTripDetailsTemplate()}

    </form>`
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.pointDelete);

    if (!this._isNew) {
      this.setFormCloseHandler(this._callback.formClose);
    }
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

  reset(point) {
    this.updateData(
        PointEditView.convertPointToData(point)
    );
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
            FLATPICKR_PROPERTIES
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
            FLATPICKR_PROPERTIES
        )
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`)
      .addEventListener(`click`, this._pointTypeChangeHandler);
    this.getElement().querySelector(`.${CLASS_NODE.CITY}`)
      .addEventListener(`change`, this._pointCityChangeHandler);
    this.getElement().querySelector(`.${CLASS_NODE.PRICE}`)
      .addEventListener(`change`, this._pointPriceChangeHandler);

    if (this._offersByType.get(this._data.type)
      && this._offersByType.get(this._data.type).length) {
      this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offersChangeHandler);
    }

    if (!this._isNew) {
      this.getElement().querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, this._favoriteClickHandler);
    }
  }

  _createTripFavoriteButtonTemplate() {
    const {isFavorite, isDisabled} = this._data;

    return !this._isNew
      ? (
        `<input
          id="event-favorite-1"
          class="event__favorite-checkbox visually-hidden"
          type="checkbox"
          name="event-favorite"
          ${isFavorite ? `checked` : ``}
          ${isDisabled ? `disabled` : ``}
        >
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path
              d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"
            />
          </svg>
        </label>

        <button
          class="event__rollup-btn"
          type="button"
          ${isDisabled ? `disabled` : ``}
        >
          <span class="visually-hidden">Open event</span>
        </button>`
      )
      : ``;
  }

  _createInnardsOfOffersSection(offersList) {
    const {offers, isDisabled} = this._data;

    const checkedOffers = offers.reduce((result, offer) => {
      return result.set(offer.title, offer);
    }, new Map());

    return offersList
      .map((offer) => {
        return (
          `<div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offer.title}-1"
              type="checkbox"
              name="${offer.title}"
              ${checkedOffers.has(offer.title) ? `checked` : ``}
              ${isDisabled ? `disabled` : ``}
            >
            <label class="event__offer-label" for="event-offer-${offer.title}-1">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`
        );
      })
      .join(``);
  }

  _createTripOffersSectionTemplate() {
    const {type} = this._data;

    const offersList = this._offersByType.get(type);

    return (offersList && offersList.length)
      ? `<section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${this._createInnardsOfOffersSection(offersList)}
          </div>
        </section>`
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
            ${destination}
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
            ${photos.map((photo, index) => `<img
                class="event__photo"
                src="${isOnline() ? photo.src : `./img/photos/${Math.min(index + 1, 5)}.jpg`}"
                alt="${photo.description}">`).join(``)}
          </div>
        </div>`
      )
      : ``;
  }

  _createTripDetailsTemplate() {
    const {destination, photos} = this._data;

    const offersExisting = (this._offersByType.get(this._data.type)
      && this._offersByType.get(this._data.type).length);

    return ((destination && destination.length)
     || (photos && photos.length)
     || offersExisting)
      ? (`<section class="event__details">
          ${this._createTripOffersSectionTemplate()}
          ${this._createTripDestinationDescriptionTemplate()}
        </section>`
      )
      : ``;
  }

  _createTripCityTemplate() {
    const {type, city, isDisabled} = this._data;

    return (
      `<div class="event__field-group ${CLASS_NODE.CITY}">
        <label class="event__label event__type-output" for="event-destination-1">
          ${generatePointLabel(type)}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${he.encode(city)}"
          list="destination-list-1"
          ${isDisabled ? `disabled` : ``}
        >
        <datalist id="destination-list-1">
          ${Array.from(this._destinations.keys())
            .map((it) => {
              return `<option value="${it}"></option>`;
            })
            .join(``)}
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

    return Array.from(POINT_TYPES.entries())
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

  _checkCityValidity() {
    const cityNode = this.getElement().querySelector(`.${CLASS_NODE.CITY} input`);
    let cityMessage = ``;
    let validity = true;

    if (cityNode.value.length === 0) {
      cityMessage = `Не указан пункт назначения`;
      validity = false;
    } else if (this._destinations.size
      && ![...this._destinations.keys()].includes(cityNode.value)) {
      cityMessage = `Выбранный пункт назначения отсутсвует в предложенном списке`;
      validity = false;
    }

    cityNode.setCustomValidity(cityMessage);

    return validity;
  }

  _checkPriceValidity() {
    const priceNode = this.getElement().querySelector(`.${CLASS_NODE.PRICE}`);
    let priceMessage = ``;
    let validity = true;

    if (!(parseInt(priceNode.value, 10))) {
      priceMessage = `Стоимость должны быть больше ноля`;
      validity = false;
    }

    priceNode.setCustomValidity(priceMessage);

    return validity;
  }

  _checkFormValidity() {
    return this._checkCityValidity() && this._checkPriceValidity();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (this._checkFormValidity()) {
      this._callback.formSubmit(PointEditView.convertDataToPoint(this._data));
    }
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  _favoriteClickHandler() {
    this.updateData(
        {
          isFavorite: !this._data.isFavorite
        },
        true
    );
  }

  _pointTypeChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    const type = transformToCapitalize(evt.target.value);

    this.getElement().querySelector(`.event__type-toggle`).checked = false;

    this.updateData({type, offers: []});
  }

  _pointCityChangeHandler(evt) {
    if (!isInputTag(evt) && evt.target.value === this._data.city) {
      return;
    }

    const newCity = evt.target.value;
    const destination = this._destinations.get(newCity);

    if (destination) {
      const {description, photos} = destination;
      this.updateData(
          {
            city: newCity,
            destination: description,
            photos
          }
      );
    } else {
      this.updateData(
          {
            city: newCity,
          }
      );
    }

    this._checkFormValidity();
  }

  _offersChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    const offers = this._data.offers.map((offer) => Object.assign({}, offer));
    const offerIndex = offers.findIndex((it) => it.title === evt.target.name);

    if (offerIndex < 0) {
      const offersList = this._offersByType.get(this._data.type);
      const newOffer = offersList.find((it) => it.title === evt.target.name);
      if (newOffer) {
        offers.push(newOffer);
      }
    } else {
      offers.splice(offerIndex, 1);
    }

    this.updateData({offers}, true);
  }

  _pointPriceChangeHandler(evt) {
    if (evt.target.value === this._data.price) {
      return;
    }

    this.updateData(
        {
          price: parseInt(evt.target.value, 10),
        },
        true
    );

    this._checkFormValidity();
  }

  _startDateChangeHandler([userDate]) {
    const timeStart = new Date(userDate);
    const timeEnd = (timeStart > this._data.timeEnd) ? timeStart : this._data.timeEnd;

    this._endDatepicker.set(`minDate`, timeStart);
    this._endDatepicker.setDate(timeEnd);
    this.updateData({timeStart, timeEnd}, true);
  }

  _endDateChangeHandler([userDate]) {
    this.updateData(
        {
          timeEnd: new Date(userDate)
        },
        true
    );
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.pointDelete(PointEditView.convertDataToPoint(this._data));
  }

  static convertPointToData(point) {
    return Object.assign(point, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static convertDataToPoint(pointData) {
    delete pointData.isDisabled;
    delete pointData.isSaving;
    delete pointData.isDeleting;

    return pointData;
  }
}
