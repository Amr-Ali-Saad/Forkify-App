import icons from "url:../../img/icons.svg";

export default class View {
    _data;

    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        this._data = data;
        let html = this._genHTML();
        if (!render) return html;
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", html);
    }

    setLogoLink() {
        console.log("try0");
        document
            .querySelector(".header__logo")
            .addEventListener("click", function () {
                window.location = "http://localhost:1234/";
                console.log("try");
            });
    }

    _clear() {
        this._parentElement.innerHTML = "";
    }

    renderSpinnner() {
        let html = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> -->

        <!-- <div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>No recipes found for your query. Please try again!</p>
          </div> -->
    `;
        this._clear();

        this._parentElement.insertAdjacentHTML("afterbegin", html);
    }

    renderError(err = this._errMes) {
        let markup = `<div class="error">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${err}</p>
</div>`;
        this._clear();

        this._parentElement.insertAdjacentHTML("afterbegin", markup);
        console.error(err);
    }

    renderMes(mes = this._msg) {
        let markup = `<div class="message">
  <div>
    <svg>
      <use href="${icons}#icon-smile"></use>
    </svg>
  </div>
  <p>${mes}</p>
</div>`;
        this._clear();

        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    update(data) {
        this._data = data;
        let newMarkup = this._genHTML();

        let newDOM = document.createRange().createContextualFragment(newMarkup);
        let newEls = Array.from(newDOM.querySelectorAll("*"));
        let curEls = Array.from(this._parentElement.querySelectorAll("*"));
        // console.log(newEls, "ggg", curEls);

        newEls.forEach((newEl, i) => {
            let curEl = curEls[i];
            // console.log(curEl, newEl.isEqualNode(curEl));
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
                // console.log(Array.from(newEl.attributes));
            }
            if (
                !newEl.isEqualNode(curEl) &&
                newEl.firstChild.nodeValue.trim() !== ""
            ) {
                // console.log(newEl.firstChild?.nodeValue.trim());
                curEl.textContent = newEl.textContent;
            }
        });
    }
}
