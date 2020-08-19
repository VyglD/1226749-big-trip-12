import TripInfoView from "./view/trip-info.js";
import TripCostView from "./view/trip-cost.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filters.js";
import {generateTripEvent} from "./mock/trip-event.js";
import {render, RenderPosition, append} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";

const TRIP_EVENT_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);

const tripEvents = new Array(TRIP_EVENT_COUNT)
  .fill()
  .map(generateTripEvent)
  .sort((a, b) => a.timeStart - b.timeStart);


const tripInfoNode = new TripInfoView(tripEvents);
const tripCostNode = new TripCostView(tripEvents);
const tripPresenter = new TripPresenter(boardContainerNode);

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

tripPresenter.init(tripEvents);
