import MenuView from "./view/menu-view.js";
import TripPresenter from "./presenter/trip-presenter.js";
import FiltersPresenter from "./presenter/filters-presenter.js";
import InformationPresenter from "./presenter/information-presenter.js";
import StatisticsPresenter from "./presenter/statistics-presenter.js";
import OffersModel from "./model/offers-model.js";
import PointsModel from "./model/points-model.js";
import FilterModel from "./model/filter-model.js";
import {render, RenderPosition} from "./utils/render.js";
import {FilterType, MenuItem, EventType, UpdateType} from "./const.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic io380cs93mlfrq1ii8sdfhurdy67k`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const OFFLINE_TITLE = ` [offline]`;

const header = document.querySelector(`.trip-main`);
const menuHeader = header.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeader = header.querySelectorAll(`.trip-controls h2`)[1];
const boardContainer = document.querySelector(`.trip-events`);
const tripHeader = boardContainer.querySelector(`h2`);
const newPointButton = header.querySelector(`.trip-main__event-add-btn`);

const newPointButtonClickHandler = (evt) => {
  evt.preventDefault();
  handleMenuClick(MenuItem.NEW_POINT);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const newPointFormCloseHandler = () => {
  newPointButton.disabled = false;
};

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_POINT:
      statisticsPresenter.destroy();
      tripPresenter.destroy();
      filterModel.setFilter(FilterType.EVERYTHING);
      tripPresenter.init();
      filtersPresenter.init();
      tripPresenter.createPoint(newPointFormCloseHandler);
      newPointButton.disabled = true;
      break;
    case MenuItem.TABLE:
      statisticsPresenter.destroy();
      tripPresenter.init();
      filtersPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      filterModel.setFilter(FilterType.EVERYTHING);
      filtersPresenter.init(false);
      statisticsPresenter.init();
  }
};

const enableMenu = () => {
  render(
      menuHeader,
      siteMenuComponent,
      RenderPosition.AFTEREND
  );

  siteMenuComponent.setMenuItemClickHandler(handleMenuClick);
  newPointButton.addEventListener(`click`, newPointButtonClickHandler);
  newPointButton.disabled = false;
};

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteMenuComponent = new MenuView();

const filtersPresenter = new FiltersPresenter(
    filtersHeader,
    pointsModel,
    filterModel
);
const tripPresenter = new TripPresenter(
    boardContainer,
    tripHeader,
    pointsModel,
    offersModel,
    filterModel,
    apiWithProvider
);
const informationPresenter = new InformationPresenter(
    header,
    pointsModel,
    filterModel
);
const statisticsPresenter = new StatisticsPresenter(
    boardContainer,
    pointsModel
);

newPointButton.disabled = true;

informationPresenter.init();
tripPresenter.init();
filtersPresenter.init();

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getPoints(),
])
  .then(([offers, destinations, points]) => {
    offersModel.setOffersFromServer(offers);
    pointsModel.setDestinations(destinations);
    pointsModel.setPoints(EventType.INIT, UpdateType.MAJOR, points);
    enableMenu();
  })
.catch(() => {
  pointsModel.setPoints(EventType.INIT, UpdateType.MAJOR, []);
  enableMenu();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(OFFLINE_TITLE, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += OFFLINE_TITLE;
});
