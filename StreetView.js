function StreetView(_latLongObj){
    this.addPanorama(_latLongObj);
    this.streetViewSvc = new google.maps.StreetViewService();
    //this.oldPoint = _latLongObj;
    this.curYellowManLatLng = new google.maps.LatLng({lat: _latLongObj.lat, lng: _latLongObj.lng}); 
    this.fixPanoTries = 0;
    this.fixPanoId = 0;
    this.heading = 34;
    //this.oldPoint = _latLongObj.lngLat; 
}
StreetView.prototype.addPanorama = function(_latLongObj){
    var _self = this;

    this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: _latLongObj,
          pov: {
            heading: 34,
            pitch: 10
          }
    });

    this.panorama.addListener('pano_changed', function(){
        console.log("panoChange: " + this.getPano());
        var _pano = this;
        clearInterval(_self.fixPanoId);
        _self.fixPanoId = setInterval(fixPanoTiles, 200);
        
        function fixPanoTiles(){
            console.log("setTimeout");
            _pano.setPov({
                    heading: _self.heading,
                    pitch: 0
                });
            if(++_self.fixPanoTries > 3){
                clearInterval(_self.fixPanoId);
                _self.fixPanoTries = 0;
            }
        }
        
      });
}
StreetView.prototype.setPanorama = function(_latLongObj){
    var _self = this;
    this.clickLatLongObj = _latLongObj;
    var myLatLongObj = {lat:_latLongObj.lat(), lng:_latLongObj.lng()};


    this.streetViewSvc.getPanorama({location: myLatLongObj, radius: 550}, 
        function(data, status){
            console.log("_self,newPt: %o", _self.clickLatLongObj);
            console.log("_self,oldPt: %o", _self.curYellowManLatLng);
            console.log("getPanorama data: %o", data);
            
            if(status === google.maps.StreetViewStatus.OK){
                _self.heading = google.maps.geometry.spherical.computeHeading(data.location.latLng,
                                                                        _self.clickLatLongObj);
                _self.curYellowManLatLng = data.location.latLng; 
                _self.panorama.setPano(data.location.pano);
                _self.panorama.setPov({
                    heading: _self.heading,
                    pitch: 0
                });
                _self.panorama.setVisible(true);
                //google.maps.event.trigger(_self.panorama, 'resize');
            }
            else
            if(status === google.maps.StreetViewStatus.ZERO_RESULTS){
                _self.heading = google.maps.geometry.spherical.computeHeading(_self.curYellowManLatLng,
                                                                        _self.clickLatLongObj);
                _self.panorama.setPov({
                                    heading: _self.heading,
                                    pitch: 0
                                });
                _self.panorama.setVisible(true);
                //google.maps.event.trigger(_self.panorama, 'resize');
            }
            else {
                console.error('Street View data not found for this location.');
            }
        });
    //sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
}
StreetView.prototype.processStreetViewData = function(data, status){
      var _self = this;
      if (status === google.maps.StreetViewStatus.OK){
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
