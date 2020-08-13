import TripInfoView from "./view/trip-info.js";
import TripCostView from "./view/trip-cost.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filters.js";
import SortView from "./view/sort.js";
import DaysListView from "./view/trip-days.js";
import TripDayView from "./view/trip-day.js";
import TripEventView from "./view/trip-event.js";
import TripEventEditView from "./view/trip-event-edit.js";
import {generateTripEvent} from "./mock/trip-event.js";
import {render, RenderPosition} from "./dom-util.js";

const TRIP_EVENT_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const bodyContainerNode = document.querySelector(`.trip-events`);
const sortHeaderNode = bodyContainerNode.querySelector(`.trip-events h2`);

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

const tripEvents = new Array(TRIP_EVENT_COUNT)
  .fill()
  .map(generateTripEvent)
  .sort((a, b) => a.timeStart - b.timeStart);

const tripDays = getTripEventsByDays(tripEvents.slice(1));

render(
    headerNode,
    new TripInfoView(tripEvents.slice(1)).getElement(),
    RenderPosition.AFTERBEGIN
);

const tripInfoNode = headerNode.querySelector(`.trip-info`);

render(
    tripInfoNode,
    new TripCostView(tripEvents.slice(1)).getElement(),
    RenderPosition.BEFOREEND
);

render(
    menuHeaderNode,
    new MenuView().getElement(),
    RenderPosition.AFTEREND
);
render(
    filtersHeaderNode,
    new FilterView().getElement(),
    RenderPosition.AFTEREND
);
render(
    sortHeaderNode,
    new SortView().getElement(),
    RenderPosition.AFTEREND
);

const sortNode = bodyContainerNode.querySelector(`.trip-sort`);

render(
    sortNode,
    new TripEventEditView(tripEvents[0]).getElement(),
    RenderPosition.AFTEREND
);

const formEditNode = bodyContainerNode.querySelector(`.event--edit`);

render(
    formEditNode,
    new DaysListView().getElement(),
    RenderPosition.AFTEREND
);

const daysListNode = bodyContainerNode.querySelector(`.trip-days`);

for (let i = 0; i < tripDays.size; i++) {
  const date = Array.from(tripDays.keys())[i];

  const tripDay = new TripDayView(date, i + 1).getElement();
  const tripDayList = tripDay.querySelector(`#trip-events__list-${i + 1}`);

  for (const tripEvent of tripDays.get(date)) {
    tripDayList.append(new TripEventView(tripEvent).getElement());
  }

  render(
      daysListNode,
      tripDay,
      RenderPosition.BEFOREEND
  );
}
