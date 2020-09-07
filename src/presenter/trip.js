import SortView from "../view/sort.js";
import DaysListView from "../view/days-list.js";
import DayView from "../view/day.js";
import PointsListView from "../view/points-list.js";
import NoPointsView from "../view/no-points.js";
import LoadingView from "../view/loading.js";
import PointPresenter from "../presenter/point.js";
import PointsPresenter from "../presenter/points.js";
import NewPointPresenter from "../presenter/new-point.js";
import {render, RenderPosition, append, remove} from "../utils/render.js";
import {getTimeInterval} from "../utils/common.js";
import {SortType, UserAction, EventType} from "../data.js";

const SORT_KEY = `sort`;

export default class TripPresenter extends PointsPresenter {
  constructor(tripContainer, tripHeader, pointsModel, offersModel, filtersModel, api) {
    super(pointsModel, filtersModel);
    this._container = tripContainer;
    this._header = tripHeader;
    this._offersModel = offersModel;
    this._api = api;

    this._currentSortType = SortType.DEFAULT;
    this._existPointPresenters = {};
    this._existTripDays = [];
    this._isLoading = true;

    this._noPointsComponent = new NoPointsView();
    this._daysListComponent = new DaysListView();
    this._loadingComponent = new LoadingView();
    this._sortComponent = null;

    this._changePointsSorting = this._changePointsSorting.bind(this);
    this._changePointsData = this._changePointsData.bind(this);
    this._updateViews = this._updateViews.bind(this);
    this._applyNewFilter = this._applyNewFilter.bind(this);
    this._resetDataChanges = this._resetDataChanges.bind(this);

    this._newPointPresenter = new NewPointPresenter(
        pointsModel,
        offersModel,
        this._changePointsData
    );
  }

  init() {
    this._pointsModel.addObserver(this._updateViews);
    this._filtersModel.addObserver(this._applyNewFilter);

    this._createTripSplit();
    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);

    remove(this._daysListComponent);
    remove(this._sortComponent);

    this._pointsModel.removeObserver(this._updateViews);
    this._filtersModel.removeObserver(this._applyNewFilter);
  }

  createPoint(callback) {
    this._newPointPresenter.init(
        (this._sortComponent !== null && this._sortComponent.isRendered())
          ? this._sortComponent
          : this._header,
        callback
    );
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

  _renderLoading() {
    render(this._header, this._loadingComponent, RenderPosition.AFTEREND);
  }

  _createPointPresenter(container, pointData) {
    const pointPresenter = new PointPresenter(
        container,
        this._pointsModel,
        this._offersModel,
        this._changePointsData,
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
      this._createPointPresenter(pointsListComponent, pointData);
    });

    append(this._daysListComponent, tripDayComponent);
    this._existTripDays.push(tripDayComponent);
  }

  _createDaysList() {
    Array.from(this._tripSplit.keys()).forEach((key, index) => {
      this._createDay(key, index + 1);
    });
  }

  _renderTripTable() {
    this._createDaysList();

    render(
        this._container,
        this._daysListComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getPoints().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSortComponent();
    this._renderTripTable();
  }

  _clearTrip(resetSortType = false) {
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    this._newPointPresenter.destroy();

    remove(this._noPointsComponent);
    remove(this._loadingComponent);
    remove(this._sortComponent);

    Object
      .values(this._existPointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._existPointPresenters = {};

    this._existTripDays.forEach(remove);
    this._existTripDays = [];
  }

  _updateViews(eventType) {
    if (eventType === EventType.INIT) {
      this._isLoading = false;
      remove(this._loadingComponent);
    }
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

  _changePointsData(userAction, point) {
    switch (userAction) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(this._pointsModel.adaptToServer(point))
          .then(() => {
            this._pointsModel.updatePoint(point);
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(point);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(point);
        break;
    }
  }

  _resetDataChanges() {
    this._newPointPresenter.destroy();
    Object
      .values(this._existPointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _applyNewFilter(eventType) {
    this._currentSortType = SortType.DEFAULT;
    this._updateViews(eventType);
  }
}
