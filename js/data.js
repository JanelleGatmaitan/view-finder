/* exported data */
var searchData = {
  userInput: {},
  astroData: {},
  placesSearchResults: []
}
;

var favoritesData = {
  newSearch: true,
  display: 'home',
  favorites: []
};

var previousSearchDataJSON = localStorage.getItem('search-results');
if (previousSearchDataJSON != null) {
  searchData = JSON.parse(previousSearchDataJSON);
}

var previousFavoritesDataJSON = localStorage.getItem('favorites');
if (previousFavoritesDataJSON != null) {
  favoritesData = JSON.parse(previousFavoritesDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var searchDataJSON = JSON.stringify(searchData);
  localStorage.setItem('search-results', searchDataJSON);
  var favoritesDataJSON = JSON.stringify(favoritesData);
  localStorage.setItem('favorites', favoritesDataJSON);
});
