import View from "./view";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
    _parentElement = document.querySelector(".upload");
    _openWindow = document.querySelector(".nav__btn--add-recipe");
    _closeWindow = document.querySelector(".btn--close-modal");
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _msg = "Recipe successfully uploaded :)";

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    _genHTML() {}

    toggleWindow() {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }

    _addHandlerShowWindow() {
        this._openWindow.addEventListener(
            "click",
            this.toggleWindow.bind(this)
        );
    }
    _addHandlerHideWindow() {
        this._closeWindow.addEventListener(
            "click",
            this.toggleWindow.bind(this)
        );
        this._overlay.addEventListener("click", this.toggleWindow.bind(this));
    }
    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            let dataArray = [...new FormData(this)];
            let data = Object.fromEntries(dataArray);
            handler(data);
        });
    }
}
export default new AddRecipeView();
