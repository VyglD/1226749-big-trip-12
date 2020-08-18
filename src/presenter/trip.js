import SortView from "../view/sort.js";
import DaysListView from "../view/trip-days.js";
import TripDayView from "../view/trip-day.js";
import TripEventsListView from "../view/trip-events-list.js";
import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/trip-event-edit.js";
import NoTripEventsView from "../view/no-trip-events.js";
import {render, RenderPosition, replace, append} from "../utils/render.js";
import {isEscEvent} from "../utils/common.js";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._noTripEventsComponent = new NoTripEventsView();
    this._sortComponent = new SortView();
    this._daysListComponent = new DaysListView();
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

  _getTripEventsByDays() {
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

  _renderTripBoard() {
    const tripDaysSplit = this._getTripEventsByDays();

    for (let i = 0; i < tripDaysSplit.size; i++) {
      const date = Array.from(tripDaysSplit.keys())[i];

      const tripDayComponent = new TripDayView(date, i + 1);
      const tripDaysListComponent = new TripEventsListView(i + 1);

      append(tripDayComponent, tripDaysListComponent);

      for (const tripEventData of tripDaysSplit.get(date)) {
        append(tripDaysListComponent, this._getTripEventElement(tripEventData));
      }

      append(this._daysListComponent, tripDayComponent);
    }

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

    this._renderTrip();
  }
}
