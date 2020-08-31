import MenuView from "./view/menu.js";
import TripPresenter from "./presenter/trip.js";
import FiltersPreseter from "./presenter/filters.js";
import InformationPresenter from "./presenter/information.js";
import PointsModel from "./model/points.js";
import FiltersModel from "./model/filters.js";
import {generatePoints} from "./mock/point.js";
import {render, RenderPosition} from "./utils/render.js";

const POINTS_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);

const points = new Array(POINTS_COUNT).fill().map(generatePoints);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const filtersModel = new FiltersModel();

render(
    menuHeaderNode,
    new MenuView(),
    RenderPosition.AFTEREND
);

const filtersPreseter = new FiltersPreseter(filtersHeaderNode, filtersModel);
const tripPresenter = new TripPresenter(boardContainerNode, pointsModel, filtersModel);
const informationPresenter = new InformationPresenter(headerNode, pointsModel, filtersModel);

informationPresenter.init();
filtersPreseter.init();
tripPresenter.init();


