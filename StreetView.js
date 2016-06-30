function StreetView(_latLongObj){
    this.addPanorama(_latLongObj);
    this.streetViewSvc = new google.maps.StreetViewService();
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
StreetView.prototype.setPanorama = function(_latLong){
    var _self = this;
    this.streetViewSvc.getPanorama({location: _latLong, radius: 50}, 
                function(data, status){
                    console.log("_self: " + _self);
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
