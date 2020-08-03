import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripCostTemplate} from "./view/trip-cost.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createSortTemplate} from "./view/sort.js";
import {createTripDaysListTemplate} from "./view/trip-days.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripEventTemplate} from "./view/trip-event.js";
import {createTripEventEditTemplate} from "./view/trip-event-edit.js";

const TRIP_EVENT_COUNT = 3;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const bodyContainerNode = document.querySelector(`.trip-events`);
const sortHeaderNode = bodyContainerNode.querySelector(`.trip-events h2`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerNode, createTripInfoTemplate(), `afterBegin`);

const tripInfoNode = headerNode.querySelector(`.trip-info`);

render(tripInfoNode, createTripCostTemplate(), `beforeEnd`);

render(menuHeaderNode, createMenuTemplate(), `afterEnd`);
render(filtersHeaderNode, createFiltersTemplate(), `afterEnd`);

render(sortHeaderNode, createSortTemplate(), `afterEnd`);

const sortNode = bodyContainerNode.querySelector(`.trip-sort`);

render(sortNode, createTripEventEditTemplate(), `afterEnd`);

const formEditNode = bodyContainerNode.querySelector(`.event--edit`);

render(formEditNode, createTripDaysListTemplate(), `afterEnd`);

const daysListNode = bodyContainerNode.querySelector(`.trip-days`);

render(daysListNode, createTripDayTemplate(), `afterBegin`);

const tripEventsListNode = daysListNode.querySelector(`.trip-events__list`);

for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
  render(tripEventsListNode, createTripEventTemplate(), `afterBegin`);
}

