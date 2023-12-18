const API_URLS = {
  randomMeal: 'https://www.themealdb.com/api/json/v1/1/random.php',
  categoryMeal: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=',
  mealDetails: 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=',
};

function fetchFromAPI(url) {
  return fetch(url).then(response => response.json());
}

function displayMealDetails(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (!ingredient) break;
    ingredients.push(`${ingredient} - ${measure}`);
  }

  const mealDetailsSection = document.getElementById('mealSuggestions');
  mealDetailsSection.innerHTML = `
    <div class="meal-details">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>Ingredients</h3>
      <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
}

function displayMeals(meals) {
  const mealSuggestions = document.getElementById('mealSuggestions');
  mealSuggestions.innerHTML = '';

  meals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    mealDiv.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    `;
    mealDiv.addEventListener('click', () => {
      fetchFromAPI(API_URLS.mealDetails + meal.idMeal)
        .then(data => displayMealDetails(data.meals[0]))
        .catch(error => console.log('Error fetching meal details:', error));
    });
    mealSuggestions.appendChild(mealDiv);
  });
}

function fetchRandomMeal() {
  fetchFromAPI(API_URLS.randomMeal)
    .then(data => displayMeals([data.meals[0]]))
    .catch(error => console.log('Error fetching random meal:', error));
}

function fetchMealsByCategory(category) {
  fetchFromAPI(API_URLS.categoryMeal + category)
    .then(data => displayMeals(data.meals))
    .catch(error => console.log('Error fetching meals by category:', error));
}

document.addEventListener('DOMContentLoaded', fetchRandomMeal);

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
  const category = document.getElementById('searchBar').value.trim();
  category !== '' ? fetchMealsByCategory(category) : fetchRandomMeal();
});
