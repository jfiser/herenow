
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

/*function initAutocomplete() {
var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
});*/

// Create the search box and link it to the UI element.
//var input = document.getElementById('pac-input');
//var searchBox = new google.maps.places.SearchBox(input);

function SearchPlaces(_input, _map, _streetView){
    console.log("map: %o", map);
    this.markers = [];
    this.places = [];
    this.map = _map;
    this.streetView = _streetView;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.searchBox = new google.maps.places.SearchBox(_input);
    this.setBoundsChangedListener();
    this.setPlacesChangedListener();
};

SearchPlaces.prototype.setBoundsChangedListener = function(){
// Bias the SearchBox results towards current map's viewport.
    var _self = this;
    this.map.addListener('bounds_changed', function(){
        console.log("boundschanged");
        _self.searchBox.setBounds(this.getBounds());

        //_self.streetView.getPanorama({location: event.latLng, radius: 50}, processSVData);
    });
}
SearchPlaces.prototype.setPlacesChangedListener = function(){
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
    var _self = this;
    this.searchBox.addListener('places_changed', function() {
        console.log("places_changed");
        _self.places = _self.searchBox.getPlaces();

        if (_self.places.length == 0) {
            return;
        }

        // Clear out the old markers.
        _self.markers.forEach(function(_marker) {
            _marker.setMap(null);
        });
        _self.markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        _self.places.forEach(function(_place) {
            var icon = {
                url: _place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            _self.markers.push(new google.maps.Marker({
                map: _self.map,
                icon: icon,
                title: _place.name,
                position: _place.geometry.location
            }));

            if (_place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(_place.geometry.viewport);
            }
            else {
                bounds.extend(_place.geometry.location);
            }
        });
        _self.map.fitBounds(bounds);
    });

}