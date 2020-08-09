import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripCostTemplate} from "./view/trip-cost.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortTemplate} from "./view/sort.js";
import {createTripDaysListTemplate} from "./view/trip-days.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripEventTemplate} from "./view/trip-event.js";
import {createTripEventEditTemplate} from "./view/trip-event-edit.js";
import {generateTripEvent} from "./mock/trip-event.js";

const TRIP_EVENT_COUNT = 20;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const bodyContainerNode = document.querySelector(`.trip-events`);
const sortHeaderNode = bodyContainerNode.querySelector(`.trip-events h2`);

const tripEvents = new Array(TRIP_EVENT_COUNT)
  .fill()
  .map(generateTripEvent)
  .sort((a, b) => a.timeStart - b.timeStart);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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

const renderTripEventsList = (tripPoints) => {
  const daysListNode = document.querySelector(`.trip-days`);
  const tripDays = getTripEventsByDays(tripPoints.slice(1));

  let currentTripDayIndex = 1;

  for (const date of tripDays.keys()) {
    render(daysListNode, createTripDayTemplate(date, currentTripDayIndex), `beforeEnd`);

    const currentTripEventsListNode = daysListNode.querySelector(
        `#trip-events__list-${currentTripDayIndex}`
    );

    render(
        currentTripEventsListNode,
        tripDays.get(date).map(createTripEventTemplate).join(``),
        `beforeEnd`
    );

    currentTripDayIndex++;
  }
};

render(headerNode, createTripInfoTemplate(tripEvents.slice(1)), `afterBegin`);

const tripInfoNode = headerNode.querySelector(`.trip-info`);

render(tripInfoNode, createTripCostTemplate(tripEvents.slice(1)), `beforeEnd`);

render(menuHeaderNode, createMenuTemplate(), `afterEnd`);
render(filtersHeaderNode, createFiltersTemplate(), `afterEnd`);

render(sortHeaderNode, createSortTemplate(), `afterEnd`);

const sortNode = bodyContainerNode.querySelector(`.trip-sort`);

render(sortNode, createTripEventEditTemplate(tripEvents[0]), `afterEnd`);

const formEditNode = bodyContainerNode.querySelector(`.event--edit`);

render(formEditNode, createTripDaysListTemplate(), `afterEnd`);

renderTripEventsList(tripEvents);
