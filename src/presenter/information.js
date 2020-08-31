import InformationView from "../view/information.js";
import CostView from "../view/cost.js";
import RouteView from "../view/route.js";
import PointsPresenter from "./points.js";
import {render, RenderPosition, append, replace} from "../utils/render.js";
import {EventType} from "../data.js";

export default class InformationPresenter extends PointsPresenter {
  constructor(informationContainer, pointsModel, filtersModel) {
    super(pointsModel, filtersModel);
    this._container = informationContainer;

    this._updateViews = this._updateViews.bind(this);

    this._pointsModel.addObserver(this._updateViews);
    this._filtersModel.addObserver(this._updateViews);
  }

  init() {
    this._informationComponent = new InformationView();
    this._routeComponent = new RouteView(this._getAllPoints());
    this._costComponent = new CostView(this._getPoints());

    append(this._informationComponent, this._routeComponent);
    append(this._informationComponent, this._costComponent);

    render(
        this._container,
        this._informationComponent,
        RenderPosition.AFTERBEGIN
    );
  }

  _updateViews(eventType) {
    if (eventType === EventType.POINT) {
      this._updateRoute();
    }

    this._updateCost();
  }

  _updateCost() {
    let prevCostComponent = this._costComponent;

    this._costComponent = new CostView(this._getPoints());

    replace(this._costComponent, prevCostComponent);

    prevCostComponent = null;
  }

  _updateRoute() {
    let prevRouteComponent = this._routeComponent;

    this._routeComponent = new RouteView(this._getAllPoints());

    replace(this._routeComponent, prevRouteComponent);

    prevRouteComponent = null;
  }
}
