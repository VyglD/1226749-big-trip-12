import SortView from "../view/sort.js";
import DaysListView from "../view/days-list.js";
import DayView from "../view/day.js";
import PointsListView from "../view/points-list.js";
import NoPointsView from "../view/no-points.js";
import PointPresenter from "../presenter/point.js";
import {render, RenderPosition, append, remove} from "../utils/render.js";
import {getTimeInterval} from "../utils/common.js";
import {filter} from "../utils/filter.js";
import {SortType, FilterType} from "../data.js";

const SORT_KEY = `sort`;

export default class TripPresenter {
  constructor(tripContainer, pointsModel, filtersModel) {
    this._container = tripContainer;
    this._pointsModel = pointsModel;
    this._filtersModel = filtersModel;

    this._currentSortType = SortType.DEFAULT;
    this._existPointPresenters = {};
    this._existTripDays = [];

    this._noPointsComponent = new NoPointsView();
    this._daysListComponent = new DaysListView();
    this._sortComponent = null;

    this._changePointsSorting = this._changePointsSorting.bind(this);
    this._changePointData = this._changePointData.bind(this);
    this._updateViews = this._updateViews.bind(this);
    this._applyNewFilter = this._applyNewFilter.bind(this);
    this._resetDataChanges = this._resetDataChanges.bind(this);

    this._pointsModel.addObserver(this._updateViews);
    this._filtersModel.addObserver(this._applyNewFilter);

    this._createTripSplit();
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    const filterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();

    if (filterType !== FilterType.EVERYTHING) {
      return filter[filterType](points);
    }

    return points;
  }

  _getPointsByPrice() {
    return this._getPoints().slice()
      .sort((point1, point2) => point2.price - point1.price);
  }

  _getPointsByTime() {
    return this._getPoints().slice()
      .sort((point1, point2) => getTimeInterval(point2) - getTimeInterval(point1));
  }

  _createSplitBySort(points) {
    this._tripSplit = new Map([[SORT_KEY, points]]);
  }

  _createSplitByDays() {
    const tripDays = new Map();

    for (const point of this._getPoints()) {
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

  _renderNoPoints() {
    render(
        this._container,
        this._noPointsComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderSortComponent() {
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._changePointsSorting);

    render(
        this._container,
        this._sortComponent,
        RenderPosition.BEFOREEND
    );
  }

  _createPoint(container, pointData) {
    const pointPresenter = new PointPresenter(
        container,
        this._changePointData,
        this._resetDataChanges
    );
    pointPresenter.init(pointData);
    this._existPointPresenters[pointData.id] = pointPresenter;
  }

  _createDay(date, index) {
    const isSort = date === SORT_KEY ? true : false;
    const tripDayComponent = new DayView(date, index, !isSort);
    const pointsListComponent = new PointsListView(index);

    append(tripDayComponent, pointsListComponent);

    this._tripSplit.get(date).forEach((pointData) => {
      this._createPoint(pointsListComponent, pointData);
    });

    append(this._daysListComponent, tripDayComponent);
    this._existTripDays.push(tripDayComponent);
  }

  _createDaysList() {
    Array.from(this._tripSplit.keys()).forEach((key, index) => {
      this._createDay(key, index + 1);
    });
  }

  _renderTripBoard() {
    this._createDaysList();

    render(
        this._container,
        this._daysListComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderTrip() {
    if (!this._getPoints().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSortComponent();
    this._renderTripBoard();
  }

  _clearTrip() {
    Object
      .values(this._existPointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._existPointPresenters = {};

    this._existTripDays.forEach(remove);
    this._existTripDays = [];
  }

  _updateViews() {
    this._clearTrip();
    this._createTripSplit();
    this._renderTrip();
  }

  _changePointsSorting(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._updateViews();
  }

  _changePointData(modifiedPoint) {
    this._pointsModel.updatePoint(modifiedPoint);
  }

  _resetDataChanges() {
    Object
      .values(this._existPointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _applyNewFilter() {
    this._currentSortType = SortType.DEFAULT;
    this._updateViews();
  }
}
