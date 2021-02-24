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

$searchButton.addEventListener('click', function (event) {
  console.log($input.value);
  $searchBar.className = 'hidden';
  $astronomyData.className = 'astronomy-data';
  $recs.className = 'results';
  data.display = 'search';
});

$back.addEventListener('click', function (event) {
  $input.value = '';
  $searchBar.className = 'search';
  $astronomyData.className = 'hidden';
  $recs.className = 'hidden';
  data.display = 'home';
});
// function getAstronomyData() {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://api.ipgeolocation.io/astronomy?apiKey=9602d1abf8594c91bffeea0723c636a8&location=Irvine,%20US');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {
//     console.log(xhr.status);
//     console.log('Astronomy data: ', xhr.response);
//   });
//   xhr.send();
// }

// function getPlacesData() {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://api.foursquare.com/v2/venues/explore?client_id=MGLS4THDKMFHYLSPVD5FIA1QNNUYFTSLERRRYZYKOWPKVK2R&client_secret=VZAFPX0YYBAAZ0GGDPMAR2VAJR5CFBWQXTXQ5IUBBF4H521E&v=20180323&near=Irvine,CA&query=scenic&limit=5');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {
//     console.log(xhr.status);
//     console.log('Places Response: ', xhr.response);
//   });
//   xhr.send();
// }

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

// getAstronomyData();
// getPlacesData();
// getPlacesPhoto();

// var photoURL = prefix + '500x500' + suffix;
