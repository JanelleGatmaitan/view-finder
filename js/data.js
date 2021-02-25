/* exported data */
var data = {
  display: null,
  userInput: {},
  astroData: {},
  photoData: [],
  placesSearchResults: [],
  favorites: []
}
;

var previousDataJSON = localStorage.getItem('view-finder');
if (previousDataJSON != null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('view-finder', dataJSON);
});
