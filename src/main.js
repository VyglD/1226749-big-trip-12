import TripInfoView from "./view/trip-info.js";
import TripCostView from "./view/trip-cost.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filters.js";
import SortView from "./view/sort.js";
import DaysListView from "./view/trip-days.js";
import TripDayView from "./view/trip-day.js";
import TripEventsListView from "./view/trip-events-list.js";
import TripEventView from "./view/trip-event.js";
import TripEventEditView from "./view/trip-event-edit.js";
import NoTripEventsView from "./view/no-trip-events.js";
import {generateTripEvent} from "./mock/trip-event.js";
import {render, RenderPosition, replace, append} from "./utils/render.js";
import {isEscEvent} from "./utils/common.js";

const TRIP_EVENT_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);

const getTripEventsByDays = (tripPoints) => {
  const tripDays = new Map();

  for (const tripEvent of tripPoints) {
    const date = new Date(tripEvent.timeStart).setHours(0, 0, 0, 0);

    if (tripDays.has(date)) {
      tripDays.get(date).push(tripEvent);
    } else {
      tripDays.set(date, [tripEvent]);
    }
  }

  return tripDays;
};

const getTripEventElement = (tripEventData) => {
  const tripEventNode = new TripEventView(tripEventData);
  const tripEventEditNode = new TripEventEditView(tripEventData);

  const replacePointToForm = () => {
    replace(tripEventEditNode, tripEventNode);
  };

  const replaceFormToPoint = () => {
    replace(tripEventNode, tripEventEditNode);
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

  tripEventNode.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  tripEventEditNode.setFormSubmitHandler(closeEditForm);
  tripEventEditNode.setFormCloseHandler(closeEditForm);

  return tripEventNode;
};

const renderBoard = (container, boardTripEvents) => {
  if (!boardTripEvents.length) {
    render(
        container,
        new NoTripEventsView(),
        RenderPosition.BEFOREEND
    );
    return;
  }

  const daysListNode = new DaysListView();
  const tripDays = getTripEventsByDays(boardTripEvents);

  for (let i = 0; i < tripDays.size; i++) {
    const date = Array.from(tripDays.keys())[i];

    const tripDay = new TripDayView(date, i + 1);
    const tripDayList = new TripEventsListView(i + 1);

    append(tripDay, tripDayList);

    for (const tripEventData of tripDays.get(date)) {
      append(tripDayList, getTripEventElement(tripEventData));
    }

    append(daysListNode, tripDay);
  }

  render(
      container,
      new SortView(),
      RenderPosition.BEFOREEND
  );
  render(
      container,
      daysListNode,
      RenderPosition.BEFOREEND
  );
};

const tripEvents = new Array(TRIP_EVENT_COUNT)
  .fill()
  .map(generateTripEvent)
  .sort((a, b) => a.timeStart - b.timeStart);


const tripInfoNode = new TripInfoView(tripEvents);
const tripCostNode = new TripCostView(tripEvents);

append(tripInfoNode, tripCostNode);

render(
    headerNode,
    tripInfoNode,
    RenderPosition.AFTERBEGIN
);
render(
    menuHeaderNode,
    new MenuView(),
    RenderPosition.AFTEREND
);
render(
    filtersHeaderNode,
    new FilterView(),
    RenderPosition.AFTEREND
);
renderBoard(boardContainerNode, tripEvents);
