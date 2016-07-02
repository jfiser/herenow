function StreetView(_latLongObj){
    this.addPanorama(_latLongObj);
    this.streetViewSvc = new google.maps.StreetViewService();
    //this.oldPoint = _latLongObj;
    this.oldPoint = new google.maps.LatLng({lat: _latLongObj.lat, lng: _latLongObj.lng}); 
    //this.oldPoint = _latLongObj.lngLat; 
}
StreetView.prototype.addPanorama = function(_latLongObj){
    this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: _latLongObj,
          pov: {
            heading: 34,
            pitch: 10
          }
    });

    this.panorama.addListener('pano_changed', function() {
          console.log("panoChange: " + this.getPano());
      });
}
StreetView.prototype.setPanorama = function(_latLongObj){
    var _self = this;
    this.clickLatLongObj = _latLongObj;
    var myLatLongObj = {lat:_latLongObj.lat(), lng:_latLongObj.lng()};


    this.streetViewSvc.getPanorama({location: myLatLongObj, radius: 50}, 
        function(data, status){
            console.log("_self,newPt: %o", _self.clickLatLongObj);
            console.log("_self,oldPt: %o", _self.oldPoint);
            console.log("data: %o", data);
            
            if (status === google.maps.StreetViewStatus.OK){
                var heading = google.maps.geometry.spherical.computeHeading(data.location.latLng,
                                                                        _self.clickLatLongObj);
                _self.oldPoint = data.location.latLng; 
                _self.panorama.setPano(data.location.pano);
                _self.panorama.setPov({
                    heading: heading,
                    pitch: 13
                });
                _self.panorama.setVisible(true);
            } 
            else {
                console.error('Street View data not found for this location.');
            }
        });
    //sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
}
StreetView.prototype.processStreetViewData = function(data, status){
      var _self = this;
      if (status === google.maps.StreetViewStatus.OK) {
            //if(this.panorama){
                _self.panorama.setPano(data.location.pano);
                _self.panorama.setPov({
                    heading: 270,
                    pitch: 0
                });
                _self.panorama.setVisible(true);
            //}
      } 
      else {
        console.error('Street View data not found for this location.');
      }
}
