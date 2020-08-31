import FilterView from "../view/filters.js";
import {render, RenderPosition} from "../utils/render.js";

export default class FiltersPreseter {
  constructor(filterHeader, filtersModel) {
    this._filterHeader = filterHeader;
    this._filtersModel = filtersModel;

    this._changeTypeFilter = this._changeTypeFilter.bind(this);
  }

  init() {
    this._filterComponent = new FilterView(this._filtersModel.getFilter());

    this._filterComponent.setFilterTypeChangeHandler(this._changeTypeFilter);

    render(
        this._filterHeader,
        this._filterComponent,
        RenderPosition.AFTEREND
    );
  }

  _changeTypeFilter(filterType) {
    this._filtersModel.setFilter(filterType);
  }
}
