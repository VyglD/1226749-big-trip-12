import {filter} from "../utils/filter.js";

export default class AbstractPointsPresenter {
  constructor(pointsModel, filtersModel) {
    if (new.target === AbstractPointsPresenter) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

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
