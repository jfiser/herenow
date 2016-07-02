function MapView(_latLongObj, _streetView){
    this.streetView = _streetView;
    this.addMap(_latLongObj);
}
MapView.prototype.addSearchPlaces = function(_searchPlaces){
    this.searchPlaces = _searchPlaces;
}

MapView.prototype.addMap = function(_latLongObj){
    var _self = this;
    this.map = (new google.maps.Map(document.getElementById('map'), {
      center: _latLongObj,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoom: 18
    }));

    this.map.addListener('click', function(event) {
        //_self.streetView.streetViewSvc.getPanorama({location: event.latLng, radius: 50}, processStreetViewData);
        
        //console.log("evt: %o", event.latLng.lat());
        console.log("evt: %o", event.latLng.lat());
        console.log("evt: %o", event.latLng.lng());
        var myLatLongObj = {lat:event.latLng.lat(), lng:event.latLng.lng()};

        //_self.streetView.setPanorama(myLatLongObj);
        _self.streetView.setPanorama(event.latLng);
        
        //this.setStreetView(_self.streetView.panorama);
        //sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
    });
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    /*this.map.addListener('bounds_changed', function(){
        console.log("boundschanged");
        if(this.searchPlaces){
            this.searchPlaces.searchBox.setBounds(this.getBounds());
        }
        console.log("getCenter: %o", this.getBounds().getCenter().lat())
        var _latLongObj = {lat:this.getBounds().getCenter().lat(), lng:this.getBounds().getCenter().lng()};
        _self.streetView.setPanorama(_latLongObj);
        
        //this.setStreetView(_self.streetView.panorama);

        //_self.streetView.getPanorama({location: event.latLng, radius: 50}, processSVData);
    });*/
    
    this.map.setStreetView(this.streetView.panorama);
}