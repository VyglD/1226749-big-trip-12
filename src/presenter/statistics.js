import StatisticsView from "../view/statistics.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {getTimeInterval} from "../utils/common.js";
import {TypeEmoji, POINTS_TYPE, ChartType} from "../data.js";

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

  _getMoneyData() {
    const pointTypes = {};

    this._pointsModel.getPoints().forEach((point) => {
      if (pointTypes[point.type]) {
        pointTypes[point.type] += point.price;
      } else {
        pointTypes[point.type] = point.price;
      }
    });

    return this._getFormattedStructure(pointTypes, ChartType.MONEY);
  }

  _getTransportData() {
    const transportTypes = POINTS_TYPE.get(`Transfer`);
    const pointsTransport = {};

    this._pointsModel.getPoints().forEach((point) => {
      if (pointsTransport[point.type]) {
        pointsTransport[point.type]++;
      } else {
        if (transportTypes.includes(point.type)) {
          pointsTransport[point.type] = 1;
        }
      }
    });

    return this._getFormattedStructure(pointsTransport, ChartType.TRANSPORT);
  }

  _getTimeSpentData() {
    const pointTypes = {};

    this._pointsModel.getPoints().forEach((point) => {
      if (pointTypes[point.type]) {
        pointTypes[point.type] += getTimeInterval(point);
      } else {
        pointTypes[point.type] = getTimeInterval(point);
      }
    });

    return this._getFormattedStructure(pointTypes, ChartType.TIME_SPENT);
  }

  _getFormattedStructure(items, name) {
    return [...Object.entries(items)]
    .sort((a, b) => b[1] - a[1])
    .reduce((result, [key, value]) => {
      result[name].labels.push(`${TypeEmoji.get(key)} ${key.toUpperCase()}`);
      result[name].data.push(value);
      return result;
    }, {[name]: {labels: [], data: []}});
  }
}
