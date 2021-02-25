var $searchButton = document.querySelector('.search-button');
var $input = document.querySelector('input');
var $searchBar = document.querySelector('.search');
var $astronomyData = document.querySelector('.astronomy-data');
var $recs = document.querySelector('.results');
var $back = document.querySelector('.back');

if (favoritesData.display === 'search') {
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
}
var astroData = {};
function getAstronomyData() {
  var xhr = new XMLHttpRequest();
  var astronomyEndpoint = 'https://api.ipgeolocation.io/astronomy?apiKey=9602d1abf8594c91bffeea0723c636a8&location=';
  xhr.open('GET', astronomyEndpoint + astronomyLocationParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log('Astronomy data: ', xhr.response);
    astroData.currentTime = xhr.response.current_time;
    astroData.sunriseTime = xhr.response.sunrise;
    astroData.sunsetTime = xhr.response.sunset;
    console.log('xhr.response.current_time', xhr.response.current_time);
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

$searchButton.addEventListener('click', function (event) {
  event.preventDefault();
  searchData.userInput.unsplit = $input.value;
  splitUserInput(searchData.userInput);
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
  favoritesData.display = 'search';
  getAstronomyLocationParam();
  console.log('astroLocationParam: ', astronomyLocationParam);
  // getAstronomyData();
  getPlacesData();
  // getPlacesPhotoData();
});

$back.addEventListener('click', function (event) {
  $input.value = '';
  $searchBar.className = 'search';
  $astronomyData.className = 'hidden';
  $recs.className = 'hidden';
  favoritesData.display = 'home';
});

var searchPlaceResults = [];
function getPlacesData() {
  var xhr = new XMLHttpRequest();
  var placesEndpoint = 'https://api.foursquare.com/v2/venues/explore?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&near=';
  var nearParam = searchData.userInput.unsplit;
  var queryParam = '&query=scenic&limit=5';
  xhr.open('GET', placesEndpoint + nearParam + queryParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log('Places Response: ', xhr.response);
    for (var i = 0; i < xhr.response.response.groups[0].items.length; i++) {
      var place = xhr.response.response.groups[0].items[i].venue;
      searchPlaceResults.push(place);
    }
  });
  xhr.send();
}

// var photoURL = prefix + '500x500' + suffix;
var placeIDs = [];
for (var j = 0; j < searchPlaceResults.length; j++) {
  placeIDs.push(searchPlaceResults[j].id);
}

// function getPhotoURLs() {

// }

function getPlacesPhotoData() {
  var xhr = new XMLHttpRequest();
  var photoEndpoint = 'https://api.foursquare.com/v2/venues/';
  var clientID = '/photos?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&group=venue&limit=1';
  for (var j = 0; j < searchPlaceResults.length; j++) {
    xhr.open('GET', photoEndpoint + searchPlaceResults[j].id + clientID);
    xhr.responseType = 'json';
    console.log('PlacesPhoto Response: ', xhr.response);
    searchData.photoData.push(xhr.response);
  }
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
  });
  xhr.send();
}
// '4e40e8fdae60920b01735322'
