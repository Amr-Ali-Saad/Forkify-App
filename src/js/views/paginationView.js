import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    _genHTML() {
        const curPg = this._data.page;
        let numPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );

        if (curPg === 1 && numPages > 1) {
            return `<button class="btn--inline pagination__btn--next" data-goto="${
                curPg + 1
            }" >
            <span>Page ${curPg + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
        }

        if (curPg === numPages && numPages > 1) {
            return `<button class="btn--inline pagination__btn--prev" data-goto="${
                curPg - 1
            }" >
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPg - 1}</span>
            </button>`;
        }

        if (curPg < numPages) {
            return `<button class="btn--inline pagination__btn--next" data-goto="${
                curPg + 1
            }" >
            <span>Page ${curPg + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>
            <button class="btn--inline pagination__btn--prev" data-goto="${
                curPg - 1
            }" >
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPg - 1}</span>
            </button>`;
        }

        return ``;
    }

    addHandlerClick(handler) {
        this._parentElement.addEventListener("click", function (e) {
            let btn = e.target.closest(".btn--inline");
            if (!btn) return;

            let goToPg = Number(btn.dataset.goto);
            // goToPg = 0;

            handler(goToPg);
        });
    }
}
export default new PaginationView();
