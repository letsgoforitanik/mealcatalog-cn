// dom elements
const divSearch = document.querySelector('#search');
const txtSearch = divSearch.querySelector('input');
const btnSearch = divSearch.querySelector('button');
const ulResults = document.querySelector('#results');
const divSearchResults = divSearch.querySelector('#search-results');

// internal states =========================

let abortController = null;
let searchedMeals = [];
let favouriteMeals = [];

// click handlers ==========================

// search result window is closed, when
// a click event occurs anywhere inside 
// the document
document.onclick = function () {
    searchedMeals = [];
    render();
};

// meals are searched when typing goes on
txtSearch.onkeyup = () => searchMeal();

// meals are searched when the button is clicked
btnSearch.onclick = () => searchMeal();


// this function looks for meals using the given
// search term. It consumes the mealdb api.
// Search results are shown in a floating menu.
// When a keystroke is pressed, previous pending 
// searches are cancelled.
async function searchMeal() {

    const searchTerm = txtSearch.value;

    abortController && abortController.abort();

    if (!searchTerm) {
        searchedMeals = [];
        abortController = null;
        render();
        return;
    }

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    abortController = new AbortController();
    const response = await fetch(url, { signal: abortController.signal });

    const results = await response.json();
    searchedMeals = results.meals;
    abortController = null;

    searchedMeals.forEach(meal => meal.isFavourite = isFavouriteMeal(meal.idMeal));

    render();
}

// 'react' style render function
// Whenever application state is changed, this 
// function is called. The sole purpose of this
// function is to render UI.
function render() {

    ulResults.innerHTML = '';

    for (let meal of searchedMeals) {
        const li = getMealLiElement(meal);
        ulResults.appendChild(li);
    }

    if (searchedMeals.length > 0) divSearchResults.classList.add('show');
    else divSearchResults.classList.remove('show');

    synchronizeToStorage();

}

// this function returns a li element
// that corresponds to the given meal
// object
function getMealLiElement(meal) {

    const li = document.createElement('li');

    const favIcon = meal.isFavourite ? 'filled' : 'hollow';

    li.innerHTML = `<img src="${meal.strMealThumb}" alt="food-thumb" class="food-thumb">
                    <div class="food-details">
                        <div class="food-name">${meal.strMeal}</div>
                        <div class="food-category">${meal.strCategory} | ${meal.strArea}</div>
                    </div>
                    <img src="assets/fav-${favIcon}.png" alt="fav-icon" class="fav-icon" title="Add to Favourites">`;


    const imgFav = li.querySelector('img.fav-icon');

    // when this li is clicked, a new 
    // tab is opened, with the details of the meal
    // that has been clicked
    li.onclick = function (event) {
        event.stopPropagation();
        window.open(`meal-details.html?id=${meal.idMeal}`, '_newtab');
    };

    // toggles favourites
    imgFav.onclick = function (event) {

        event.stopPropagation();

        if (meal.isFavourite) {
            meal.isFavourite = false;
            favouriteMeals = favouriteMeals.filter(m => m.id !== meal.idMeal);
            showSnackbar('Removed from favourites');
            render();
            return;
        }

        meal.isFavourite = true;

        favouriteMeals.push({
            id: meal.idMeal,
            image: meal.strMealThumb,
            name: meal.strMeal,
            category: meal.strCategory,
            cuisine: meal.strArea
        });

        showSnackbar('Added to favourites');
        render();


    };

    return li;
}


// checks the given meal id in favouriteMeals
// array, returns boolean accordingly
function isFavouriteMeal(mealId) {

    for (let meal of favouriteMeals) {
        if (meal.id === mealId) return true;
    }

    return false;
}

// shows android style snackbar
// with the given message at the bottom
// of the screen
function showSnackbar(message) {
    const divSnackbar = document.getElementById("snackbar");
    divSnackbar.className = "show";
    divSnackbar.innerText = message;
    setTimeout(function () { divSnackbar.className = divSnackbar.className.replace("show", ""); }, 2000);
}

// synchronizes content of the favouriteMeals array
// in localStorage, everytime UI rendering occurs and
// content of the favouriteMeals array is modified
function synchronizeToStorage() {
    localStorage.clear();
    localStorage.setItem('data', JSON.stringify(favouriteMeals));
}

// when page loads, it fetches the favourite meals
// from localStorage and populates the favouriteMeals
// array
function loadData() {
    const data = localStorage.getItem('data');
    favouriteMeals = data ? JSON.parse(data) : [];
    render();
}

loadData();