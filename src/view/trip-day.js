import {getSystemFormattedDate, getDateAtShortFormat} from "../date-util";
import {createElement} from "../dom-util.js";

export default class TripDay {
  constructor(date, index) {
    this._date = date;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._index}</span>
          <time class="day__date" datetime="${getSystemFormattedDate(this._date)}">
            ${getDateAtShortFormat(new Date(this._date))}
          </time>
        </div>

        <ul class="trip-events__list" id="trip-events__list-${this._index}">
        </ul>
      </li>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
