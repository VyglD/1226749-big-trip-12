import SortView from "../view/sort.js";
import DaysListView from "../view/days-list.js";
import DayView from "../view/day.js";
import PointsListView from "../view/points-list.js";
import NoPointsView from "../view/no-points.js";
import PointPresenter from "../presenter/point.js";
import {render, RenderPosition, append} from "../utils/render.js";
import {getTimeInterval, updateItemArray} from "../utils/common.js";
import {SortType} from "../data.js";

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._currentSortType = SortType.DEFAULT;
    this._existPointPresenters = {};

    this._noPointsComponent = new NoPointsView();
    this._sortComponent = new SortView();
    this._daysListComponent = new DaysListView();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._pointDataChangeHandler = this._pointDataChangeHandler.bind(this);
    this._resetDataChangesHandler = this._resetDataChangesHandler.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._createTripSplit();

    this._renderTrip();
  }

  _renderNoPoints() {
    render(
        this._tripContainer,
        this._noPointsComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderSortComponent() {
    render(
        this._tripContainer,
        this._sortComponent,
        RenderPosition.BEFOREEND
    );

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _createPoint(container, pointData) {
    const pointPresenter = new PointPresenter(
        container,
        this._pointDataChangeHandler,
        this._resetDataChangesHandler
    );
    pointPresenter.init(pointData);
    this._existPointPresenters[pointData.id] = pointPresenter;
  }

  _createDay(date, index) {
    const isSort = date === `sort` ? true : false;
    const tripDayComponent = new DayView(date, index, !isSort);
    const pointsListComponent = new PointsListView(index);

    append(tripDayComponent, pointsListComponent);

    this._tripSplit.get(date).forEach((pointData) => {
      this._createPoint(pointsListComponent, pointData);
    });

    append(this._daysListComponent, tripDayComponent);
  }

  _createDaysList() {
    Array.from(this._tripSplit.keys()).forEach((key, index) => {
      this._createDay(key, index + 1);
    });
  }

  _createSplitBySort(points) {
    this._tripSplit = new Map([[`sort`, points]]);
  }

  _renderTripBoard() {
    this._createDaysList();

    render(
        this._tripContainer,
        this._daysListComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderTrip() {
    if (!this._points.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSortComponent();
    this._renderTripBoard();
  }

  _createSplitByDays() {
    const tripDays = new Map();

    for (const point of this._points.slice()) {
      const date = new Date(point.timeStart).setHours(0, 0, 0, 0);

      if (tripDays.has(date)) {
        tripDays.get(date).push(point);
      } else {
        tripDays.set(date, [point]);
      }
    }

    this._tripSplit = tripDays;
  }

  _createTripSplit() {
    switch (this._currentSortType) {
      case SortType.TIME:
        this._createSplitBySort(this._getPointsByTime());
        break;
      case SortType.PRICE:
        this._createSplitBySort(this._getPointsByPrice());
        break;
      default:
        this._createSplitByDays();
    }
  }

  _getPointsByPrice() {
    return this._points.slice()
      .sort((point1, point2) => point2.price - point1.price);
  }

  _getPointsByTime() {
    return this._points.slice()
      .sort((point1, point2) => getTimeInterval(point2) - getTimeInterval(point1));
  }

  _clearTrip() {
    this._daysListComponent.getElement().innerHTML = ``;
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearTrip();
    this._currentSortType = sortType;
    this._createTripSplit();
    this._renderTripBoard();
  }

  _pointDataChangeHandler(updatedPoint) {
    this._points = updateItemArray(this._points, updatedPoint);
    this._existPointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _resetDataChangesHandler() {
    Object
      .values(this._existPointPresenters)
      .forEach((presenter) => presenter.resetView());
  }
}
