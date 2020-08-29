import InformationView from "./view/information.js";
import CostView from "./view/cost.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filters.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import {generatePoints} from "./mock/point.js";
import {render, RenderPosition, append} from "./utils/render.js";

const POINTS_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);

const points = new Array(POINTS_COUNT).fill().map(generatePoints);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripInfoNode = new InformationView(points);
const tripCostNode = new CostView(points);

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

const tripPresenter = new TripPresenter(boardContainerNode, pointsModel);
tripPresenter.init();
