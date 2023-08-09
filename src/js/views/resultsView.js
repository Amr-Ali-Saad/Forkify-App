import { slice } from "core-js/./es/array";
import View from "./view";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView";

class ResultsView extends View {
    _parentElement = document.querySelector(".results");
    _errMes = "No recipes found.. Please try again!";
    _mes;

    _genHTML() {
        return this._data
            .map(result => previewView.render(result, false))
            .join("");
    }
}
export default new ResultsView();
