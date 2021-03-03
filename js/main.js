var $searchButton = document.querySelector('.search-button');
var $input = document.querySelector('input');
var $searchBar = document.querySelector('.search');
var $astronomyData = document.querySelector('.astronomy-data');
// var $parent = document.querySelector('.results');
var $back = document.querySelector('.back');
var $city = document.querySelector('.city');
var $currentTime = document.querySelector('.current-time');
var $rise = document.querySelector('.rise');
var $set = document.querySelector('.set');
var $parent = document.querySelector('.results');

if (searchData !== null) {
  $city.textContent = searchData.userInput.unsplit;
  $currentTime.textContent = searchData.astroData.currentTime;
  $rise.textContent = searchData.astroData.sunriseTime;
  $set.textContent = searchData.astroData.sunsetTime;
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
    $currentTime.textContent = searchData.astroData.currentTime;
    $rise.textContent = searchData.astroData.sunriseTime;
    $set.textContent = searchData.astroData.sunsetTime;
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
  if (favoritesData.newSearch) {
    $parent.innerText = ' ';
  }
  favoritesData.display = 'search';
  searchData.userInput.unsplit = $input.value;
  splitUserInput(searchData.userInput);
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $parent.className = 'results';
  getAstronomyLocationParam();
  getAstronomyData();
  getPlacesData();
  $city.textContent = searchData.userInput.unsplit;
  favoritesData.newSearch = true;
});

$back.addEventListener('click', function (event) {
  localStorage.removeItem('search-results');
  searchData = {
    userInput: {},
    astroData: {},
    placesSearchResults: []
  }
  ;
  var searchDataJSON = JSON.stringify(searchData);
  localStorage.setItem('search-results', searchDataJSON);
  $input.value = '';
  favoritesData.display = 'home';
  $searchBar.className = 'search';
  $astronomyData.className = 'hidden';
  $parent.className = 'hidden';
});

function getPlacesData() {
  var xhr = new XMLHttpRequest();
  var placesEndpoint = 'https://api.foursquare.com/v2/venues/explore?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&near=';
  var nearParam = searchData.userInput.unsplit;
  var queryParam = '&query=scenic&limit=5';
  xhr.open('GET', placesEndpoint + nearParam + queryParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < 5; i++) {
      var place = xhr.response.response.groups[0].items[i].venue;
      searchData.placesSearchResults.push(place);
      getPlacesPhotoData(searchData.placesSearchResults[i]);
    }
  });
  xhr.send();
}

function getPlacesPhotoData(result) {
  var xhr = new XMLHttpRequest();
  var photoEndpoint = 'https://api.foursquare.com/v2/venues/';
  var clientID = '/photos?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&group=venue&limit=1';
  xhr.open('GET', photoEndpoint + result.id + clientID);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var prefix = xhr.response.response.photos.items[0].prefix;
    var suffix = xhr.response.response.photos.items[0].suffix;
    var photoURL = prefix + '500x500' + suffix;
    searchData.placesSearchResults[searchData.placesSearchResults.indexOf(result)].photoUrl = photoURL;
    renderResult(searchData.placesSearchResults[searchData.placesSearchResults.indexOf(result)]);
  });
  xhr.send();
}

function renderResult(result) {
  var venueDiv = document.createElement('div');
  venueDiv.setAttribute('class', 'venue-card');
  venueDiv.setAttribute('venue-id', result.id);
  var like = document.createElement('i');
  like.setAttribute('result-id', result.id);
  if (favoritesData.display === 'favorites') {
    like.setAttribute('class', 'fas fa-heart like');
  } else {
    like.setAttribute('class', 'far fa-heart like');
  }
  venueDiv.appendChild(like);
  var infoName = document.createElement('p');
  infoName.setAttribute('class', 'venue-info');
  var infoAddress = document.createElement('p');
  infoAddress.setAttribute('class', 'venue-info');
  var placeName = document.createTextNode(result.name);
  var placeAddress = document.createTextNode(result.location.formattedAddress[0]);
  infoName.appendChild(placeName);
  infoAddress.appendChild(placeAddress);
  venueDiv.appendChild(infoName);
  venueDiv.appendChild(infoAddress);
  var photo = document.createElement('img');
  photo.setAttribute('class', 'row');
  photo.setAttribute('src', result.photoUrl);
  venueDiv.appendChild(photo);
  $parent.appendChild(venueDiv);
  return venueDiv;
}

window.addEventListener('DOMContentLoaded', function (event) {
  if (favoritesData.display === 'search' && favoritesData.favorites.length !== 0) {
    $searchBar.className = 'hidden';
    $astronomyData.className = 'astronomy-data';
    $parent.className = 'results';
    for (var i = 0; i < 5; i++) {
      var renderedResult = renderResult(searchData.placesSearchResults[i]);
      $parent.prepend(renderedResult);
    }
    for (var i = 0; i < favoritesData.favorites.length; i++) {
      checkFavorites(favoritesData.favorites[i]);
    }
  } else if (favoritesData.display === 'home') {
    $searchBar.className = 'search';
    $astronomyData.className = 'hidden';
    $parent.className = 'hidden';
    console.log('home page displayed');
  } else if (favoritesData.display === 'search') {
    $searchBar.className = 'hidden';
    $astronomyData.className = 'astronomy-data';
    $parent.className = 'results';
    for (var i = 0; i < 5; i++) {
      var renderedResult = renderResult(searchData.placesSearchResults[i]);
      $parent.prepend(renderedResult);
    }
  }
  $parent.addEventListener('click', function (event) {
    if (event.target && event.target.matches('i.like') && event.target.className === 'far fa-heart like') {
      event.target.className = 'fas fa-heart like';
      console.log('event.target: ', event.target);
      for (var i = 0; i < 5; i++) {
        if (event.target.getAttribute('result-id') === searchData.placesSearchResults[i].id) {
          favoritesData.favorites.push(searchData.placesSearchResults[i]);
          console.log('favorited!', favoritesData);
        }
      }
    } else if (event.target && event.target.matches('i.like') && event.target.className === 'fas fa-heart like') {
      event.target.className = 'far fa-heart like';
      for (var i = 0; i < 5; i++) {
        if (event.target.getAttribute('result-id') === searchData.placesSearchResults[i].id) {
          favoritesData.favorites.splice(searchData.placesSearchResults[i], 1);
          console.log('unfavorited!', favoritesData);
        }
      }
    }
  });
});

function checkFavorites(favorite) {
  var $likeButtons = document.querySelectorAll('.fa-heart.like');
  if (favoritesData.favorites.length !== 0) {
    for (var i = 0; i < 5; i++) {
      if ($likeButtons[i].getAttribute('result-id') === favorite.id) {
        $likeButtons[i].className = 'fas fa-heart like';
      }
    }
  }
}

var $navHeart = document.querySelector('.nav-icon.heart');
$navHeart.addEventListener('click', function (event) {
  $parent.innerText = ' ';
  favoritesData.display = 'favorites';
  $astronomyData.className = 'hidden';
  $searchBar.className = 'hidden';
  console.log('favoritesData.favorites:', favoritesData.favorites);
  for (var i = 0; i < favoritesData.favorites.length; i++) {
    var favorite = renderResult(favoritesData.favorites[i]);
    $parent.prepend(favorite);
  }
  $parent.className = 'results';
});

// function viewSwap() {

// }
