// dom elements
const ulMeals = document.querySelector('#meals');

// application state
let favouriteMeals = [];


// 'react' style render function
// this function is invoked whenever
// application state changes. It paints
// the dom according to app. state.
function render() {
    ulMeals.innerHTML = '';

    if (favouriteMeals.length === 0) {
        ulMeals.innerHTML = '<h3>Nothing to show</h3>';
        return;
    }

    for (let meal of favouriteMeals) {
        const li = getMealLiElement(meal);
        ulMeals.append(li);
    }

    synchronizeToStorage();

}

// list element that corresponds to given 
// favourite meal
function getMealLiElement(meal) {

    const li = document.createElement('li');

    li.innerHTML = `<img src="${meal.image}" alt="meal-icon" class="meal-icon">
                    <div class="details">
                        <h2 class="meal-heading">${meal.name}</h2>
                        <h4 class="meal-sub">${meal.category} | ${meal.cuisine}</h4>
                    </div>
                    <button class="remove" type="button">Remove From Favourites</button>`;

    const btn = li.querySelector('button');
    const h2 = li.querySelector('h2');

    // opens meal detail page in a seperate tab
    // meal id is attached to query string
    h2.onclick = function () {
        window.open(`meal-details.html?id=${meal.id}`, '_newtab');
    };

    // removes the given meal from favourite meals
    btn.onclick = function () {
        showSnackbar('Removed from favourites');
        favouriteMeals = favouriteMeals.filter(m => m.id !== meal.id);
        render();
    };

    return li;
}

// android style snackbar 
// shows snackbar at the bottom of the screen
// with the given message.
function showSnackbar(message) {
    const divSnackbar = document.getElementById("snackbar");
    divSnackbar.className = "show";
    divSnackbar.innerText = message;
    setTimeout(function () { divSnackbar.className = divSnackbar.className.replace("show", ""); }, 2000);
}

// synchronizes contents of the 
// favouriteMeals array in the localStorage.
function synchronizeToStorage() {
    localStorage.clear();
    localStorage.setItem('data', JSON.stringify(favouriteMeals));
}

// after the page is loaded, data is retrieved
// from localStorage and stored into favouriteMeals array
function loadData() {
    const data = localStorage.getItem('data');
    favouriteMeals = data ? JSON.parse(data) : [];
    render();
}

loadData();