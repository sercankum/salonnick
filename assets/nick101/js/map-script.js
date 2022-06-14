// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);



function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 17,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(45.352977, -75.650539), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "visibility": "on" }, { "lightness": 10 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f4f4f4" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#f4f4f4" }] }, { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": 20 }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#f4f4f4" }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#f4f4f4" }] }]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(45.352977, -75.650539),
        map: map,
        content: '<div id="content"><p>1183 Hunt Club Rd, Unit 101, Ottawa, ON K1V 8S4, Canada</p></div>'
    });
}