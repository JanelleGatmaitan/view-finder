var $searchButton = document.querySelector('.search-button');
var $input = document.querySelector('input');
var $searchBar = document.querySelector('.search');
var $astronomyData = document.querySelector('.astronomy-data');
var $recs = document.querySelector('.results');
var $back = document.querySelector('.back');

if (data.display === 'search') {
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
  data.display = 'search';
}

function getAstronomyData() {
  var xhr = new XMLHttpRequest();
  var astronomyEndpoint = 'https://api.ipgeolocation.io/astronomy?apiKey=9602d1abf8594c91bffeea0723c636a8&location=';
  xhr.open('GET', astronomyEndpoint + astronomyLocationParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log('Astronomy data: ', xhr.response);
    data.astroData.currentTime = xhr.response.current_time;
    data.astroData.sunriseTime = xhr.response.sunrise;
    data.astroData.sunsetTime = xhr.response.sunset;
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
  for (var i = 0; i < data.userInput.city.length; i++) {
    if (i === data.userInput.city.length - 1) {
      astronomyLocationParam += data.userInput.city[i] + '%20US';
    } else {
      astronomyLocationParam += data.userInput.city[i] + '%20';
    }
  }
  return astronomyLocationParam;
}

$searchButton.addEventListener('click', function (event) {
  data.userInput.unsplit = $input.value;
  splitUserInput(data.userInput);
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
  data.display = 'search';
  getAstronomyLocationParam();
  console.log('astroLocationParam: ', astronomyLocationParam);
  getAstronomyData();
  // getPlacesData();
  // getPlacesPhoto();
});

$back.addEventListener('click', function (event) {
  $input.value = '';
  $searchBar.className = 'search';
  $astronomyData.className = 'hidden';
  $recs.className = 'hidden';
  data.display = 'home';
});

function getPlacesData() {
  var xhr = new XMLHttpRequest();
  var placesEndpoint = 'https://api.foursquare.com/v2/venues/explore?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&near=';
  var nearParam = data.userInput.unsplit;
  var queryParam = '&query=scenic&limit=5';
  xhr.open('GET', placesEndpoint + nearParam + queryParam);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log('Places Response: ', xhr.response);
    console.log('typeof xhr.response.response.groups[0].items: ', typeof xhr.response.response.groups[0].items, xhr.response.response.groups[0].items);
    for (var i = 0; i < xhr.response.response.groups[0].items.length; i++) {
      var place = xhr.response.response.groups[0].items[i].venue;
      data.placesSearchResults.push(place);
    }
  });
  xhr.send();
}

// // function getPlacesPhoto() {
// //   var xhr = new XMLHttpRequest();
// //   xhr.open('GET', 'https://api.foursquare.com/v2/venues/4e40e8fdae60920b01735322/photos?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&group=venue&limit=1');
// //   xhr.responseType = 'json';
// //   xhr.addEventListener('load', function () {
// //     console.log(xhr.status);
// //     console.log('PlacesPhoto Response: ', xhr.response);
// //   });
// //   xhr.send();
// // }

// var photoURL = prefix + '500x500' + suffix;
