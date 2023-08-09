import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import View from "./views/view.js";
import { MODAL_CLOSE_SEC } from "./config";
import { async } from "regenerator-runtime";

// if (module.hot) {
//     module.hot.accept();
// }

async function controlRecipes(id) {
    try {
        let id = window.location.hash.slice(1);
        console.log("id: " + id);
        if (!id) return;

        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);

        console.log("Getting data..");
        recipeView.renderSpinnner();

        await model.loadRecipe(id);

        recipeView.render(model.state.recipe);
        // debugger;
    } catch (err) {
        console.error(err);
        recipeView.renderError();
    }
}

async function controlSerachResults() {
    try {
        resultsView.renderSpinnner();

        let query = searchView.getQuery();
        if (!query) return;

        await model.loadSearchResults(query);

        resultsView.render(model.getSearchResultsPage());

        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
        recipeView.renderError(err);
    }
}

function controlPagination(goToPg) {
    resultsView.render(model.getSearchResultsPage(goToPg));

    paginationView.render(model.state.search);
}

function controlServings(newServings) {
    model.updateServings(newServings);
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
    console.log(model.state.recipe.bookmarked);
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
        console.log(model.state.bookmarks);
    } else {
        model.deleteBookmark(model.state.recipe.id);
        console.log(model.state.bookmarks);
    }

    recipeView.update(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
    bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
    try {
        addRecipeView.renderSpinnner();
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        recipeView.render(model.state.recipe);

        addRecipeView.renderMes();

        bookmarksView.render(model.state.bookmarks);

        window.history.pushState(null, "", `#${model.state.recipe.id}`);

        setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
    } catch (err) {
        console.error(err);
        addRecipeView.renderError(err.message);
    }
}

function init() {
    // model.clearBookmarks();
    // document.querySelector(".search__field").value = "pizza";
    bookmarksView.addHandlerRender(controlBookmarks);
    View.setLogoLink;

    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSerachResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
