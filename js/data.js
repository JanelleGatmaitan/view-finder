/* exported data */
var data = {
  display: null,
  searchResults: [],
  favorites: []
}
;

var previousDataJSON = localStorage.getItem('create-an-entry');
if (previousDataJSON != null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('view-finder', dataJSON);
});
