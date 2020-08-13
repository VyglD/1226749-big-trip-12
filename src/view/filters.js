import {createElement} from "../dom-util.js";
import {FILTERS} from "../data.js";

export default class Filter {
  constructor() {
    this._element = null;
  }

  _createFilterItemTemplate(filter, isChecked) {
    return (
      `<div class="trip-filters__filter">
        <input
          id="filter-${filter}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filter}"
          ${isChecked ? `checked` : ``}
        >
        <label class="trip-filters__filter-label" for="filter-${filter}">
          ${filter}
        </label>
      </div>`
    );
  }

  getTemplate() {
    const filterItemsTemplate = FILTERS
      .map((filter, index) => this._createFilterItemTemplate(filter, index === 0))
      .join(``);

    return (
      `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
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

