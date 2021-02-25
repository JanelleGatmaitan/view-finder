var $searchButton = document.querySelector('.search-button');
var $input = document.querySelector('input');
var $searchBar = document.querySelector('.search');
var $astronomyData = document.querySelector('.astronomy-data');
var $recs = document.querySelector('.results');
var $back = document.querySelector('.back');
var $city = document.querySelector('.city');
var $currentTime = document.querySelector('.current-time');
var $rise = document.querySelector('.rise');
var $set = document.querySelector('.set');

if (favoritesData.display === 'search') {
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
}

function getAstronomyData() {
  var xhr = new XMLHttpRequest();
  var astronomyEndpoint = 'https://api.ipgeolocation.io/astronomy?apiKey=9602d1abf8594c91bffeea0723c636a8&location=';
  xhr.open('GET', astronomyEndpoint + astronomyLocationParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    searchData.astroData.currentTime = xhr.response.current_time;
    searchData.astroData.sunriseTime = xhr.response.sunrise;
    searchData.astroData.sunsetTime = xhr.response.sunset;
  });
  xhr.send();
}

function splitUserInput(userInput) {
  var splitInput = userInput.unsplit.split(',');
  var city = splitInput[0];
  var citySpaces = city.split(' ');
  userInput.city = citySpaces;
  userInput.state = splitInput[1];
}

var astronomyLocationParam = '';

function getAstronomyLocationParam() {
  astronomyLocationParam = '';
  for (var i = 0; i < searchData.userInput.city.length; i++) {
    if (i === searchData.userInput.city.length - 1) {
      astronomyLocationParam += searchData.userInput.city[i] + '%20US';
    } else {
      astronomyLocationParam += searchData.userInput.city[i] + '%20';
    }
  }
  return astronomyLocationParam;
}

function resetSearchData() {

}

$searchButton.addEventListener('click', function (event) {
  event.preventDefault();
  favoritesData.display = 'search';
  searchData.userInput.unsplit = $input.value;
  splitUserInput(searchData.userInput);
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
  getAstronomyLocationParam();
  getAstronomyData();
  getPlacesData();
  $city.textContent = searchData.userInput.unsplit;
  $currentTime.textContent = searchData.astroData.currentTime;
  $rise.textContent = searchData.astroData.sunriseTime;
  $set.textContent = searchData.astroData.sunsetTime;
});

$back.addEventListener('click', function (event) {
  searchData = {
    userInput: {},
    astroData: {},
    photoData: [],
    placesSearchResults: []
  }
  ;
  $input.value = '';
  favoritesData.display = 'home';
  $searchBar.className = 'search';
  $astronomyData.className = 'hidden';
  $recs.className = 'hidden';
});

function getPlacesData() {
  var xhr = new XMLHttpRequest();
  var placesEndpoint = 'https://api.foursquare.com/v2/venues/explore?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&near=';
  var nearParam = searchData.userInput.unsplit;
  var queryParam = '&query=scenic&limit=5';
  xhr.open('GET', placesEndpoint + nearParam + queryParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.response.groups[0].items.length; i++) {
      var place = xhr.response.response.groups[0].items[i].venue;
      searchData.placesSearchResults.push(place);
    }
    // storePhotoData();
  });
  xhr.send();
}

function storePhotoData() {
  for (var j = 0; j < searchData.placesSearchResults.length; j++) {
    getPlacesPhotoData(searchData.placesSearchResults[j]);
  }
}
// var photoURL = prefix + '500x500' + suffix;

function getPlacesPhotoData(result) {
  var xhr = new XMLHttpRequest();
  var photoEndpoint = 'https://api.foursquare.com/v2/venues/';
  var clientID = '/photos?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&group=venue&limit=1';
  xhr.open('GET', photoEndpoint + result.id + clientID);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    searchData.photoData.push(xhr.response);
  });
  xhr.send();
}
