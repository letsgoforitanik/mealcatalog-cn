const divSearch = document.querySelector('#search');
const txtSearch = divSearch.querySelector('input');
const btnSearch = divSearch.querySelector('button');
const ulResults = document.querySelector('#results');
const divSearchResults = divSearch.querySelector('#search-results');

let abortController = null;
let searchedMeals = [];
let favouriteMeals = [];

txtSearch.onkeyup = async function () {

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

};


function render() {

    ulResults.innerHTML = '';

    for (let meal of searchedMeals) {
        const li = getMealLiElement(meal);
        ulResults.appendChild(li);
    }

    if (searchedMeals.length > 0) divSearchResults.classList.add('show');
    else divSearchResults.classList.remove('show');

}


function getMealLiElement(meal) {

    const li = document.createElement('li');

    const favIcon = meal.isFavourite ? 'filled' : 'hollow';

    li.innerHTML = `<img src="${meal.strMealThumb}" alt="food-thumb" class="food-thumb">
                    <div class="food-details">
                        <div class="food-name">${meal.strMeal}</div>
                        <div class="food-category">${meal.strCategory} | ${meal.strArea}</div>
                    </div>
                    <img src="assets/fav-${favIcon}.png" alt="fav-icon" class="fav-icon">`;


    const imgFav = li.querySelector('img.fav-icon');

    imgFav.onclick = function () {
        showSnackbar('Added to Favourites');
    };

    return li;
}


function isFavouriteMeal(mealId) {

    for (let meal of favouriteMeals) {
        if (meal.id === mealId) return true;
    }

    return false;
}

function showSnackbar(message) {
    const divSnackbar = document.getElementById("snackbar");
    divSnackbar.className = "show";
    divSnackbar.innerText = message;
    setTimeout(function () { divSnackbar.className = divSnackbar.className.replace("show", ""); }, 2000);
}

render();