import AbstractView from "./abstract-view.js";

export default class InformationView extends AbstractView {
  getTemplate() {
    return (
      `<section class="trip-main__trip-info  trip-info"></section>`
    );
  }
}
