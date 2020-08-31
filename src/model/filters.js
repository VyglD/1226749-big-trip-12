import Observer from "../utils/observer.js";
import {FilterType, UPDATE_TYPE} from "../data.js";

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._currentFilter = FilterType.EVERYTHING;
  }

  setFilter(filter) {
    this._currentFilter = filter;
    this._notify(UPDATE_TYPE, filter);
  }

  getFilter() {
    return this._currentFilter;
  }
}
