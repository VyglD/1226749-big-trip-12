import AbstractView from "./abstract.js";
import {MenuItem} from "../data.js";

export default class MenuView extends AbstractView {
  constructor() {
    super();

    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a
          class="trip-tabs__btn trip-tabs__btn--active"
          href="#"
          value=${MenuItem.TABLE}
        >
          Table
        </a>
        <a
          class="trip-tabs__btn"
          href="#"
          value=${MenuItem.STATS}
        >
          Stats
        </a>
      </nav>`
    );
  }

  setMenuItem(menuItem) {
    const itemNode = this.getElement().querySelector(`[value=${menuItem}]`);
    const prevActiveNode = this.getElement().querySelector(`.trip-tabs__btn--active`);

    if (itemNode && prevActiveNode && prevActiveNode !== itemNode) {
      prevActiveNode.classList.remove(`trip-tabs__btn--active`);
      itemNode.classList.add(`trip-tabs__btn--active`);
    }
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuItemClickHandler);
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`
      || evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    this.setMenuItem(evt.target.getAttribute(`value`));
    this._callback.menuClick(evt.target.getAttribute(`value`));
  }
}
