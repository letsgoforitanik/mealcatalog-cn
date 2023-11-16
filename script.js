const divSearch = document.querySelector('#search');
const txtSearch = divSearch.querySelector('input');
const btnSearch = divSearch.querySelector('button');
const ulResults = document.querySelector('#results');
const divSearchResults = divSearch.querySelector('#search-results');

let abortController = null;
let searchedMeals = [];

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

    li.innerHTML = `<img src="${meal.strMealThumb}" alt="food-thumb" class="food-thumb">
                    <div class="food-details">
                        <div class="food-name">${meal.strMeal}</div>
                        <div class="food-category">${meal.strCategory} | ${meal.strArea}</div>
                    </div>
                    <img src="assets/fav-hollow.png" alt="fav-icon" class="fav-icon">`;

    return li;
}



render();