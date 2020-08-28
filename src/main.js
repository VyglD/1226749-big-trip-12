import InformationView from "./view/information.js";
import CostView from "./view/cost.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filters.js";
import {generatePoints} from "./mock/point.js";
import {render, RenderPosition, append} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";

const POINTS_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);

const points = new Array(POINTS_COUNT)
  .fill()
  .map(generatePoints)
  .sort((a, b) => a.timeStart - b.timeStart);


const tripInfoNode = new InformationView(points);
const tripCostNode = new CostView(points);
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

tripPresenter.init(points);
