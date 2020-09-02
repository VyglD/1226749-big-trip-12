import {filter} from "../utils/filter.js";

export default class PointsPresenter {
  constructor(pointsModel, filtersModel) {
    this._pointsModel = pointsModel;
    this._filtersModel = filtersModel;
  }

  _getPoints() {
    const filterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();

    return filter[filterType](points);
  }

  _getAllPoints() {
    return this._pointsModel.getPoints();
  }
}
