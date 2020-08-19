import SortView from "../view/sort.js";
import DaysListView from "../view/trip-days.js";
import TripDayView from "../view/trip-day.js";
import TripEventsListView from "../view/trip-events-list.js";
import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/trip-event-edit.js";
import NoTripEventsView from "../view/no-trip-events.js";
import {render, RenderPosition, replace, append} from "../utils/render.js";
import {isEscEvent, getTimeInterval} from "../utils/common.js";
import {SortType} from "../data.js";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;

    this._noTripEventsComponent = new NoTripEventsView();
    this._sortComponent = new SortView();
    this._daysListComponent = new DaysListView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _renderNoTripEvents() {
    render(
        this._tripContainer,
        this._noTripEventsComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderSortComponent() {
    render(
        this._tripContainer,
        this._sortComponent,
        RenderPosition.BEFOREEND
    );

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _getTripEventElement(tripEventData) {
    const tripEventComponent = new TripEventView(tripEventData);
    const tripEventEditComponent = new TripEventEditView(tripEventData);

    const replacePointToForm = () => {
      replace(tripEventEditComponent, tripEventComponent);
    };

    const replaceFormToPoint = () => {
      replace(tripEventComponent, tripEventEditComponent);
    };

    const closeEditForm = () => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        closeEditForm();
      }
    };

    tripEventComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    tripEventEditComponent.setFormSubmitHandler(closeEditForm);
    tripEventEditComponent.setFormCloseHandler(closeEditForm);

    return tripEventComponent;
  }

  _getSplitByDays() {
    const tripDays = new Map();

    for (const tripEvent of this._tripEvents.slice()) {
      const date = new Date(tripEvent.timeStart).setHours(0, 0, 0, 0);

      if (tripDays.has(date)) {
        tripDays.get(date).push(tripEvent);
      } else {
        tripDays.set(date, [tripEvent]);
      }
    }

    return tripDays;
  }

  _createDayTrip(date, index) {
    if (date === `sort`) {
      index = ``;
    }

    const tripDayComponent = new TripDayView(date, index);
    const tripEventsListComponent = new TripEventsListView(index);

    append(tripDayComponent, tripEventsListComponent);

    this._tripEventsSplit.get(date).forEach((tripEventData) => {
      append(tripEventsListComponent, this._getTripEventElement(tripEventData));
    });

    append(this._daysListComponent, tripDayComponent);
  }

  _createTripByDays() {
    Array.from(this._tripEventsSplit.keys()).forEach((key, index) => {
      this._createDayTrip(key, index + 1);
    });
  }

  _getSplitBySort(tripEvents) {
    return new Map([[`sort`, tripEvents]]);
  }

  _renderTripBoard() {
    this._createTripByDays();

    render(
        this._tripContainer,
        this._daysListComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderTrip() {
    if (!this._tripEvents.length) {
      this._renderNoTripEvents();
      return;
    }

    this._renderSortComponent();
    this._renderTripBoard();
  }

  init(tripEvents) {
    this._tripEvents = tripEvents.slice();
    this._tripEventsSplit = this._getSplitByDays();

    this._renderTrip();
  }

  _getEventsByPrice() {
    return this._tripEvents.slice()
      .sort((eventA, eventB) => eventB.price - eventA.price);
  }

  _getEventsByTime() {
    return this._tripEvents.slice()
      .sort((eventA, eventB) => getTimeInterval(eventB) - getTimeInterval(eventA));
  }

  _sortTripEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._tripEventsSplit = this._getSplitBySort(this._getEventsByTime());
        break;
      case SortType.PRICE:
        this._tripEventsSplit = this._getSplitBySort(this._getEventsByPrice());
        break;
      default:
        this._tripEventsSplit = this._getSplitByDays();
    }

    this._currentSortType = sortType;
  }

  _clearTrip() {
    this._daysListComponent.getElement().innerHTML = ``;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearTrip();
    this._sortTripEvents(sortType);
    this._renderTripBoard();
  }
}
