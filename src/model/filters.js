import Observer from "../utils/observer.js";
import {FilterType, EventType} from "../const.js";

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._currentFilter = FilterType.EVERYTHING;
  }

  setFilter(filter) {
    this._currentFilter = filter;
    this._notify(EventType.FILTER, filter);
  }

  getFilter() {
    return this._currentFilter;
  }
}
