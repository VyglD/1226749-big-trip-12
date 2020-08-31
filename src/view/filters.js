import {FilterType} from "../data.js";
import AbstractView from "./abstract.js";

export default class FilterView extends AbstractView {
  constructor(currentFilterType) {
    super();
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    const filterItemsTemplate = Object.values(FilterType)
      .map((filter) => {
        return this._createFilterItemTemplate(filter, filter === this._currentFilter);
      })
      .join(``);

    return (
      `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.changeFilter = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
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

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._callback.changeFilter(evt.target.value);
  }
}

