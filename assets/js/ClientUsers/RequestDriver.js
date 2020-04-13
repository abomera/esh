// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map;
var InfoWindowOrgn, InfoWindowDest;
var PositionOrgn, PositionDest;
var MarkerOrgn, MarkerDest;
var AddressOrgn, AddressDest;
var geocoder;

var apiGeolocationSuccess = function (position) {
  console.log(position);
  console.log(PositionOrgn);
  PositionOrgn = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  console.log(PositionOrgn);
  BuildOrgnData();
};

var tryAPIGeolocation = function () {
  jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAsSAfr0i3nG4GACxuYf2ys01hfyhvaaDA", function (success) {
    apiGeolocationSuccess({ coords: { latitude: success.location.lat, longitude: success.location.lng } });
  })
    .fail(function (err) {
      handleLocationError(true, InfoWindowOrgn, map.getCenter());
    });
};

var browserGeolocationFail = function (error) {
  switch (error.code) {
    case error.TIMEOUT:
      alert("Browser geolocation error !\n\nTimeout.");
      break;
    case error.PERMISSION_DENIED:
      if (error.message.indexOf("Only secure origins are allowed") === 0) {
        tryAPIGeolocation();
      }
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Browser geolocation error !\n\nPosition unavailable.");
      break;
  }
};
var browserGeolocationSuccess = function (position) {
  PositionOrgn = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
};

var tryGeolocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      browserGeolocationSuccess,
      browserGeolocationFail,
      { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true });
  }
};



$(document).ready(function () {
  $('#txtSearch').focus();
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 30.141598, lng: 31.32691 },
    zoom: 16,
    mapTypeId: 'roadmap'
  });

  geocoder = new google.maps.Geocoder;

  google.maps.event.addListener(map, "click", function (e) {

    //lat and lng is available in e object
    var latLng = e.latLng;
    PositionDest = latLng;

    geocodeLatLng(PositionDest, function (result,status) {
      var PlaceName = FormatPlaceName(result);
      AddressDest = result.formatted_address;
      BuildDestData(PlaceName);
    });

  });

  InfoWindowOrgn = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
   
    navigator.geolocation.getCurrentPosition(function (position) {
      PositionOrgn = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      BuildOrgnData();

    },
      tryAPIGeolocation()
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, InfoWindowOrgn, map.getCenter());
  }

  var input = document.getElementById('txtSearch');
  var searchBox = new google.maps.places.SearchBox(input);
  var options = {
    //types: ['(cities)'],
    componentRestrictions: { country: 'eg' }
  };
  //var autocompleteBox = new google.maps.places.Autocomplete(input, options);


  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
    //autocompleteBox.setBounds(map.getBounds());
  });


  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }
    AddressDest = places[0].formatted_address;
    BuildPlaceData(places[0]);

  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  //autocompleteBox.addListener('place_changed', function () {
  //  BuildPlaceData(autocompleteBox.getPlace());
  //});

}
function handleLocationError(browserHasGeolocation, InfoWindowOrgn, PositionOrgn) {
  InfoWindowOrgn.setPosition(PositionOrgn);
  InfoWindowOrgn.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  InfoWindowOrgn.open(map);
}


var BuildDestData = function (PlaceName) {

  if (MarkerDest !== undefined) {
    MarkerDest.setMap(null);
  }

  if (InfoWindowDest !== undefined) {
    InfoWindowDest.setMap(null);
  }

  var destinationIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=D|FF0000|000000';

  MarkerDest = new google.maps.Marker({
    map: map,
    title: PlaceName,
    position: PositionDest,
    icon: destinationIcon
  })

  InfoWindowDest = new google.maps.InfoWindow;
  InfoWindowDest.setPosition(PositionDest);
  InfoWindowDest.setContent('<b>' + PlaceName + '</b>');
  InfoWindowDest.open(map);

  MarkerDest.addListener('click', function () {
    InfoWindowDest.open(map, MarkerDest);
  });


}

var BuildPlaceData = function (place) {

  if (!place.geometry) {
    return;
  }

  PositionDest = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  };

  map.setCenter(PositionDest);

  var PlaceName = FormatPlaceName(place);

  BuildDestData(PlaceName);

}
var FormatPlaceName = function (place) {
  var PlaceName = '';
  //PlaceName += '<br>';
  for (var i = 0; i < place.address_components.length; i++) {
    PlaceName += place.address_components[i].long_name + '</br>';
  }
  //PlaceName += place.address_components[3].long_name;
  //PlaceName += '</br>';
  return PlaceName;
}
var geocodeLatLng = function (postion,callback) {
  geocoder.geocode({ 'location': postion }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        callback(results[0], status);
      } else {
        callback(undefined, status);
      }
    } else {
      callback(undefined, status);
    }
  });
}

var SearchAddress = function () {
  var service = new google.maps.DistanceMatrixService;
  service.getDistanceMatrix({
    origins: [PositionOrgn],
    destinations: [PositionDest],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function (response, status) {
    if (status !== 'OK') {
      return;
    }
    //var originList = response.originAddresses;
    //var destinationList = response.destinationAddresses;
    var results = response.rows[0].elements;

    var x = {
      "PositionOrgn": PositionOrgn,
      "PositionDest": PositionDest,
      "Distance": results[0].distance,
      "Duration": results[0].duration,
      "AddressOrgn":AddressOrgn,
      "AddressDest": AddressDest,
    };

  var url = $('#rdtClientsNewShipment').val();
  url += '?x=' +JSON.stringify(x);
  window.location.href = url;

  });

  return;

}

var BuildOrgnData = function () {
  geocodeLatLng(PositionOrgn, function (result, status) {
    AddressOrgn = result.formatted_address;
  });

  var image = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
  MarkerOrgn = new google.maps.Marker({
    position: PositionOrgn,
    map: map,
    icon: image
  });
  MarkerOrgn.setMap(map);

  InfoWindowOrgn.setPosition(PositionOrgn);
  InfoWindowOrgn.setContent('<b>You are here</b>');
  //InfoWindowOrgn.open(map);

  MarkerOrgn.addListener('click', function () {
    InfoWindowOrgn.open(map, MarkerOrgn);
  });

  map.setCenter(PositionOrgn);

}