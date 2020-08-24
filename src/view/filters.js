import {FILTERS} from "../data.js";
import AbstractView from "./abstract.js";

export default class FilterView extends AbstractView {
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
}

