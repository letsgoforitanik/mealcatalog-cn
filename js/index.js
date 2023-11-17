const divSearch = document.querySelector('#search');
const txtSearch = divSearch.querySelector('input');
const btnSearch = divSearch.querySelector('button');
const ulResults = document.querySelector('#results');
const divSearchResults = divSearch.querySelector('#search-results');

let abortController = null;
let searchedMeals = [];
let favouriteMeals = [];


document.onclick = function () {
    searchedMeals = [];
    render();
};

txtSearch.onkeyup = () => searchMeal();

btnSearch.onclick = () => searchMeal();

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

    li.onclick = function (event) {
        event.stopPropagation();
        window.open(`meal-details.html?id=${meal.idMeal}`, '_newtab');
    };

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

function synchronizeToStorage() {
    localStorage.clear();
    localStorage.setItem('data', JSON.stringify(favouriteMeals));
}


function loadData() {
    const data = localStorage.getItem('data');
    favouriteMeals = data ? JSON.parse(data) : [];
    render();
}

loadData();