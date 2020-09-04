import StatisticsView from "../view/statistics.js";
import {render, RenderPosition, remove} from "../utils/render.js";

export default class StatisticsPresenter {
  constructor(header, pointsModel) {
    this._header = header;
    this._pointsModel = pointsModel;
    this._statisticsComponent = null;
  }

  init() {
    if (this._statisticsComponent !== null) {
      this.destroy();
    }

    this._statisticsComponent = new StatisticsView(this._pointsModel.getPoints());
    render(this._header, this._statisticsComponent, RenderPosition.AFTEREND);
  }

  destroy() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }
}
