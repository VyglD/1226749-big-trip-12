import {getSystemFormattedDate, getDateAtShortFormat} from "../utils/date";
import AbstractView from "./abstract.js";

export default class TripDay extends AbstractView {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return (
      `<li class="trip-days__item  day" id="trip-days__item-${this._index}">
        <div class="day__info">
          <span class="day__counter">${this._index}</span>
          <time class="day__date" datetime="${getSystemFormattedDate(this._date)}">
            ${getDateAtShortFormat(new Date(this._date))}
          </time>
        </div>
      </li>`
    );
  }
}
