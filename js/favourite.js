const ulMeals = document.querySelector('#meals');

let favouriteMeals = [];



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

    h2.onclick = function () {
        window.open(`meal-details.html?id=${meal.id}`, '_newtab');
    };

    btn.onclick = function () {
        showSnackbar('Removed from favourites');
        favouriteMeals = favouriteMeals.filter(m => m.id !== meal.id);
        render();
    };

    return li;
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