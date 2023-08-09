import View from "./view";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg";
import { result } from "lodash-es";

class BookmarksView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errMes = "No bookmarks yet. Find a nice recipe and bookmark it :)";
    _mes;
    _genHTML() {
        return this._data
            .map(result => previewView.render(result, false))
            .join("");
    }
    addHandlerRender(handler) {
        window.addEventListener("load", handler);
    }
}
export default new BookmarksView();
