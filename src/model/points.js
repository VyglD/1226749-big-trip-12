import Observer from "../utils/observer.js";

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = this._sortPoints(points);
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points.splice(index, 1, update);
    this._points = this._sortPoints(this._points);

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points.push(update);
    this._points = this._sortPoints(this._points);

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points.splice(index, 1);

    this._notify(updateType, update);
  }

  _sortPoints(points) {
    return points.slice().sort((a, b) => a.timeStart - b.timeStart);
  }
}
