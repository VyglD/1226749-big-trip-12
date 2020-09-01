import PointEditView from "../view/point-edit.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {isEscEvent, generateId} from "../utils/common.js";
import {UserAction} from "../data.js";

export default class NewPointPresenter {
  constructor(changeData) {
    this._changePointData = changeData;

    this._pointEditComponent = null;
    this._destroyCallback = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(header, callback) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    this._pointEditComponent = new PointEditView();

    this._pointEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    render(header, this._pointEditComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _formSubmitHandler(newPointData) {
    this._changePointData(
        UserAction.ADD_POINT,
        Object.assign({id: generateId()}, newPointData)
    );
    this.destroy();
  }

  _deleteClickHandler() {
    this.destroy();
  }
}
