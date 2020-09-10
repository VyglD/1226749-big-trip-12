import PointsModel from "../model/points.js";
import {isOnline} from "../utils/common.js";
import {nanoid} from "nanoid";

const SYNC_ERROR_MESSAGE = `Sync data failed`;

const StoreTitle = {
  OFFERS: `Offers`,
  DESTINATIONS: `Destinations`,
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = this._createStoreStructure(
              points.map(PointsModel.adaptToServer)
          );
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(
              updatedPoint.id,
              PointsModel.adaptToServer(updatedPoint)
          );

          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));

          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.setItem(localNewPoint.id, PointsModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    this._store.removeItem(point.id);

    return Promise.resolve();
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destination) => {
          this._store.setStaticDataByKey(StoreTitle.DESTINATIONS, destination);
          return destination;
        });
    }

    return Promise.resolve(
        this._store.getStaticDataByKey(StoreTitle.DESTINATIONS)
    );
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setStaticDataByKey(StoreTitle.OFFERS, offers);
          return offers;
        });
    }

    return Promise.resolve(
        this._store.getStaticDataByKey(StoreTitle.OFFERS)
    );
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = response.created;
          const updatedPoints = this._getSyncedPoints(response.updated);

          const items = this._createStoreStructure(
              [...createdPoints, ...updatedPoints]
          );

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(SYNC_ERROR_MESSAGE));
  }

  _getSyncedPoints(items) {
    return items.filter(({success}) => success)
      .map(({payload}) => {
        return payload.point;
      });
  }

  _createStoreStructure(items) {
    return items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {});
  }
}
