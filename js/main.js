var $searchButton = document.querySelector('.search-button');
var $input = document.querySelector('input');
var $searchBar = document.querySelector('.search');
var $astronomyData = document.querySelector('.astronomy-data');
var $back = document.querySelector('.back');
var $city = document.querySelector('.city');
var $currentTime = document.querySelector('.current-time');
var $rise = document.querySelector('.rise');
var $set = document.querySelector('.set');
var $parent = document.querySelector('.results');
var $heading = document.querySelector('h4');
var $modal = document.querySelector('.modal');
var $yes = document.querySelector('.modal-button.yes');
var $no = document.querySelector('.modal-button.no');

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
  $heading.textContent = 'View Points';
  if (favoritesData.newSearch) {
    $parent.innerText = ' ';
  }
  searchData.userInput.unsplit = $input.value;
  splitUserInput(searchData.userInput);
  favoritesData.display = 'search';
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
  $heading.className = 'hidden';
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
    var renderedResult = renderResult(searchData.placesSearchResults[searchData.placesSearchResults.indexOf(result)]);
    initialCheckFavorites(renderedResult);
  });
  xhr.send();
}

function renderResult(result) {
  var venueDiv = document.createElement('div');
  venueDiv.setAttribute('class', 'venue-card');
  venueDiv.setAttribute('venue-id', result.id);
  var like = document.createElement('i');
  like.setAttribute('venue-id', result.id);
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
  viewSwap();
  $parent.addEventListener('click', function (event) {
    if (event.target && event.target.matches('i.like') && event.target.className === 'far fa-heart like' && favoritesData.display === 'search') {
      favorite(event, searchData.placesSearchResults);
    } else if (event.target && event.target.matches('i.like') && event.target.className === 'far fa-heart like' && favoritesData.display === 'favorites') {
      favorite(event, initialFavorites);
    } else if (event.target && event.target.matches('i.like') && event.target.className === 'fas fa-heart like' && favoritesData.display === 'search') {
      unfavorite(event);
    } else if (event.target && event.target.matches('i.like') && event.target.className === 'fas fa-heart like' && favoritesData.display === 'favorites') {
      $modal.className = 'modal';
      var clickedHeart = event.target;
      $yes.addEventListener('click', function (event) {
        unfavorite(clickedHeart);
        $modal.className = 'hidden';
      });
      $no.addEventListener('click', function (event) {
        $modal.className = 'hidden';
      });
    }
  });
});

function checkFavorites(favorite) {
  var $likeButtons = document.querySelectorAll('.fa-heart.like');
  if (favoritesData.favorites.length !== 0 && favoritesData.display === 'search') {
    for (var i = 0; i < 5; i++) {
      if ($likeButtons[i].getAttribute('venue-id') === favorite.id) {
        $likeButtons[i].className = 'fas fa-heart like';
        break;
      }
    }
  }
}

function initialCheckFavorites(searchResult) {
  var $likeButton = searchResult.querySelector('.fa-heart.like');
  for (var i = 0; i < favoritesData.favorites.length; i++) {
    if (favoritesData.favorites[i].id === searchResult.getAttribute('venue-id')) {
      $likeButton.className = 'fas fa-heart like';
      break;
    }
  }
}

var $navHeart = document.querySelector('.nav-icon.heart');

$navHeart.addEventListener('click', function (event) {
  $heading.className = 'text-large';
  $heading.textContent = 'Favorites';
  $parent.innerText = ' ';
  favoritesData.display = 'favorites';
  viewSwap();
});

function viewSwap() {
  if (favoritesData.display === 'search' && favoritesData.favorites.length !== 0) {
    $city.textContent = searchData.userInput.unsplit;
    $currentTime.textContent = searchData.astroData.currentTime;
    $rise.textContent = searchData.astroData.sunriseTime;
    $set.textContent = searchData.astroData.sunsetTime;
    $heading.textContent = 'View Points';
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
  } else if (favoritesData.display === 'search') {
    $searchBar.className = 'hidden';
    $astronomyData.className = 'astronomy-data';
    $parent.className = 'results';
    for (var i = 0; i < 5; i++) {
      var renderedResult = renderResult(searchData.placesSearchResults[i]);
      $parent.prepend(renderedResult);
    }
  } else if (favoritesData.display === 'favorites') {
    $heading.className = 'text-large';
    $heading.textContent = 'Favorites';
    $parent.innerText = ' ';
    favoritesData.display = 'favorites';
    $astronomyData.className = 'hidden';
    $searchBar.className = 'hidden';
    for (var i = 0; i < favoritesData.favorites.length; i++) {
      var favorite = renderResult(favoritesData.favorites[i]);
      $parent.prepend(favorite);
    }
    $parent.className = 'results';
  }
}

function favorite(event, list) {
  event.target.className = 'fas fa-heart like';
  for (var i = 0; i < list.length; i++) {
    if (event.target.getAttribute('venue-id') === list[i].id) {
      favoritesData.favorites.push(list[i]);
      break;
    }
  }
}

function unfavorite(event) {
  if (favoritesData.display === 'favorites') {
    var favoritesRendered = document.querySelectorAll('div.venue-card');
    for (var i = 0; i < favoritesRendered.length; i++) {
      if (event.getAttribute('venue-id') === favoritesRendered[i].getAttribute('venue-id')) {
        favoritesRendered[i].className = 'hidden';
        var toBeDeleted = favoritesRendered[i].getAttribute('venue-id');
        for (var k = 0; k < favoritesData.favorites.length; k++) {
          if (toBeDeleted === favoritesData.favorites[k].id) {
            var unfavorited = favoritesData.favorites.indexOf(favoritesData.favorites[k]);
            favoritesData.favorites.splice(unfavorited, 1);
            break;
          }
        }
      }
    }
  } else {
    event.target.className = 'far fa-heart like';
    for (var i = 0; i < favoritesData.favorites.length; i++) {
      if (event.target.getAttribute('venue-id') === favoritesData.favorites[i].id) {
        var unfavorited = favoritesData.favorites.indexOf(favoritesData.favorites[i]);
        favoritesData.favorites.splice(unfavorited, 1);
        break;
      }
    }
  }
}
