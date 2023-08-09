import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";
import { AJAX } from "./helpers.js";
import { RES_PER_PAGE } from "./config.js";
import { KEY } from "./config.js";

export let state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

function createRecipeObject(data) {
    let { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
}

export let loadRecipe = async function showRecipe(id) {
    try {
        let resData = await AJAX(`${API_URL}recipes/${id}?key=${KEY}`);

        state.recipe = createRecipeObject(resData);
        if (state.bookmarks.some(b => b.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch (err) {
        throw err;
    }
};

export async function loadSearchResults(query) {
    try {
        let resData = await AJAX(
            `${API_URL}recipes?search=${query}&key=${KEY}`
        );
        state.search.query = query;
        state.search.results = resData.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            };
        });
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
}

export function getSearchResultsPage(page = state.search.page) {
    state.search.page = page;
    let start = (page - 1) * state.search.resultsPerPage;
    let end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export function updateServings(servings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * servings) / state.recipe.servings;
    });

    state.recipe.servings = servings;
}

function persistBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark(recpie) {
    state.bookmarks.push(recpie);

    if (recpie.id == state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export function deleteBookmark(id) {
    let index = state.bookmarks.findIndex(el => el.id == id);
    state.bookmarks.splice(index, 1);

    if (id == state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

function init() {
    let storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage);
}
init();

export function clearBookmarks() {
    localStorage.clear("bookmark");
}
// clearBookmarks();

export async function uploadRecipe(newRicpe) {
    try {
        let ingredients = Object.entries(newRicpe)
            .filter(
                entry => entry[0].startsWith("ingredient") && entry[1] !== ""
            )
            .map(ing => {
                let ingArr = ing[1].replaceAll(" ", "").split(",");
                if (ingArr.length !== 3)
                    throw new Error(
                        "Wrong ingredient format! Please use the correct format :)"
                    );
                let [quantity, unit, description] = ingArr;

                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                };
            });
        let recipe = {
            title: newRicpe.title,
            source_url: newRicpe.sourceUrl,
            image_url: newRicpe.image,
            publisher: newRicpe.publisher,
            cooking_time: +newRicpe.cookingTime,
            servings: +newRicpe.servings,
            ingredients,
        };
        console.log(recipe);
        let data = await AJAX(`${API_URL}recipes?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
        console.log(data);
    } catch (err) {
        throw Error(err.message);
    }
}
