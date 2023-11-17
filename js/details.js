// dom elements 
const imgFoodSource = document.querySelector('#food-image');
const spanFoodName = document.querySelector('#food-name');
const iframeFoodVideo = document.querySelector('iframe');
const spanMealName = document.querySelector('#name');
const spanMealCategory = document.querySelector('#category');
const spanMealCuisine = document.querySelector('#cuisine');
const spanCookInstruction = document.querySelector('#instruction');
const loader = document.querySelector('#loader');

// this function at the page load
async function load() {
    // meal id is extracted from query string
    const queryString = window.location.search.substring(1);
    const mealId = queryString.split('=')[1];

    // subsequently a request is made to the mealdb api,
    // requesting the details of the said meal.
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const response = await fetch(url);
    const results = await response.json();
    const meal = results.meals[0];

    // loader is closed, upon getting meal data
    loader.classList.add('hide');

    ///////////////////////////////////////////

    // dom elements are populated with the 
    // meal details
    imgFoodSource.src = meal.strMealThumb;
    spanFoodName.innerHTML = meal.strMeal;
    // video link is converted to a youtube embed.
    iframeFoodVideo.src = `https://www.youtube.com/embed/${meal.strYoutube.split('=')[1]}`;
    spanMealName.innerHTML = meal.strMeal;
    spanMealCategory.innerHTML = meal.strCategory;
    spanMealCuisine.innerHTML = meal.strArea;
    spanCookInstruction.innerHTML = meal.strInstructions;

}

load();