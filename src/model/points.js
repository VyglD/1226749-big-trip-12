import Observer from "../utils/observer.js";
import {EventType} from "../data.js";
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

  setPoints(points) {
    this._points = this._sortPoints(points.map(this._adaptToClient.bind(this)));

    this._notify(EventType.INIT, points);
  }

  updatePoint(update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points.splice(index, 1, update);
    this._points = this._sortPoints(this._points);

    this._notify(EventType.POINT, update);
  }

  addPoint(update) {
    this._points.push(update);
    this._points = this._sortPoints(this._points);

    this._notify(EventType.POINT, update);
  }

  deletePoint(update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points.splice(index, 1);

    this._notify(EventType.POINT, update);
  }

  _adaptToClient(point) {
    return {
      id: point.id,
      type: transformToCapitalize(point.type),
      city: point.destination.name,
      offers: this._offersModel.adaptOffersToClient(
          transformToCapitalize(point.type),
          point.offers
      ),
      timeStart: new Date(point.date_from),
      timeEnd: new Date(point.date_to),
      price: point.base_price,
      isFavorite: point.is_favorite,
      destination: point.destination.description,
      photos: point.destination.pictures,
    };
  }

  adaptToServer(point) {
    return {
      'id': point.id,
      'type': point.type.toLowerCase(),
      'base_price': point.price,
      'date_from': point.timeStart.toISOString(),
      'date_to': point.timeEnd.toISOString(),
      'is_favorite': point.isFavorite,
      'destination': {
        'description': point.destination,
        'name': point.city,
        'pictures': point.photos
      },
      'offers': this._offersModel.adaptOffersToServer(point.offers)
    };
  }

  _sortPoints(points) {
    return points.slice().sort((a, b) => a.timeStart - b.timeStart);
  }
}
