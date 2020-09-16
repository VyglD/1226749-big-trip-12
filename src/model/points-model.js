import Observer from "../utils/observer.js";
import {transformToCapitalize} from "../utils/common.js";

export default class PointsModel extends Observer {
  constructor(offersModel) {
    super();
    this._offersModel = offersModel;

    this._points = [];
    this._destinations = new Map();
  }

  getPoints() {
    return this._points;
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    destinations.forEach(({name, description, pictures}) => {
      this._destinations.set(name, {description, photos: pictures});
    });
  }

  setPoints(eventType, updateType, points) {
    this._points = this._sortPoints(points);

    this._notify({eventType, updateType}, points);
  }

  updatePoint(eventType, updateType, point) {
    const index = this._points.findIndex((item) => point.id === item.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points.splice(index, 1, point);
    this._points = this._sortPoints(this._points);

    this._notify({eventType, updateType}, point);
  }

  addPoint(eventType, updateType, point) {
    this._points.push(point);
    this._points = this._sortPoints(this._points);

    this._notify({eventType, updateType}, point);
  }

  deletePoint(eventType, updateType, point) {
    const index = this._points.findIndex((item) => point.id === item.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points.splice(index, 1);

    this._notify({eventType, updateType}, point);
  }

  _sortPoints(points) {
    return points.slice().sort((a, b) => a.timeStart - b.timeStart);
  }

  static adaptToClient(point) {
    return {
      id: point.id,
      type: transformToCapitalize(point.type),
      city: point.destination.name,
      offers: point.offers,
      timeStart: new Date(point.date_from),
      timeEnd: new Date(point.date_to),
      price: point.base_price,
      isFavorite: point.is_favorite,
      destination: point.destination.description,
      photos: point.destination.pictures,
    };
  }

  static adaptToServer(point) {
    return {
      'id': point.id,
      'type': point.type.toLowerCase(),
      'base_price': point.price,
      'date_from': point.timeStart.toISOString(),
      'date_to': point.timeEnd.toISOString(),
      'is_favorite': Boolean(point.isFavorite),
      'destination': {
        'description': point.destination,
        'name': point.city,
        'pictures': point.photos
      },
      'offers': point.offers
    };
  }
}
