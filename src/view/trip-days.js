import AbstractView from "./abstract.js";

export default class DaysList extends AbstractView {
  getTemplate() {
    return (
      `<ul class="trip-days"></ul>`
    );
  }
}
