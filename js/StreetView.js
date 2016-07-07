function StreetView(_main, _latLongObj){
    this.main = _main;
    this.addPanorama(_latLongObj);
    this.streetViewSvc = new google.maps.StreetViewService();
    //this.oldPoint = _latLongObj;
    this.curYellowManLatLng = new google.maps.LatLng({lat: _latLongObj.lat, lng: _latLongObj.lng}); 
    this.fixPanoTries = 0;
    this.fixPanoId = 0;
    this.heading = 90;
    this.spinPanoramaStartHeading = 90;
    this.panoSpinning = false;

    //var zoom = 1.1;
    // increment controls the speed of panning
    // positive values pan to the right, negatives values pan to the left
    this.spinIncrement = .4;
    this.spinInterval = 40; //30;
    this.spinIntervalId = 0;
    this.panoSpinState = "on"; // off, on
    //this.oldPoint = _latLongObj.lngLat; 
}
StreetView.prototype.addPanorama = function(_latLongObj){
    var _self = this;

    this.panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), {
                position: _latLongObj,
                pov: {
                    heading: 34,
                    pitch: 0
                },
                linksControl: false,
                panControl: false,
                enableCloseButton: false
    });

    this.panorama.addListener('pov_changed', function(){
        _self.heading = this.getPov().heading;
    });
    // When a new pano comes in (new panoId)
    this.panorama.addListener('pano_changed', function(){
        var _pano = this;
        
        console.log("panoChange: " + this.getPano());
         //clearInterval(_self.fixPanoId);
        //_self.fixPanoId = setInterval(fixPanoTiles, 200);
        if(_self.panoSpinState == "on"){
            _self.startSpinPanorama();
        }
        else{
            _self.fixPanoId = setInterval(fixPanoTiles, 200);
        }
    
        function fixPanoTiles(){
            console.log("fixPanoTiles");
            _pano.setPov({
                    heading: _self.heading,
                    pitch: 0
                });
            if(++_self.fixPanoTries > 3){
                clearInterval(_self.fixPanoId);
                _self.fixPanoTries = 0;
                //_self.startSpinPanorama();
            }
        }
        
      });
}
StreetView.prototype.setPanorama = function(_latLongObj){
    var _self = this;
    this.clickLatLongObj = _latLongObj;
    var myLatLongObj = {lat:_latLongObj.lat(), lng:_latLongObj.lng()};
    
    var mapZoom = this.mapView.map.getZoom();
    var myRadius = 11000 / (mapZoom < 10 ? mapZoom / 10 : mapZoom);
    console.log("getZoom(): " + this.mapView.map.getZoom());
    console.log("myRadius: " + myRadius);
    this.streetViewSvc.getPanorama({location: myLatLongObj, radius: myRadius}, 
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
}
StreetView.prototype.stopSpinPanorama = function(){
  	clearTimeout(this.spinIntervalId);
    this.panoSpinning = false;
    this.main.middleBar.handlePausePlayBtns();
}
StreetView.prototype.startSpinPanorama = function(){
    clearTimeout(this.spinIntervalId);
    //clearInterval(this.fixPanoId);
  	var _self = this;
    this.need_spinPanoramaStartHeading = true;
    this.panoSpinning = true;
    this.main.middleBar.handlePausePlayBtns();
    console.log("this.spinPanoramaStartHeading: " + this.spinPanoramaStartHeading);
    //this.spinPanoramaStartPov.heading = this.panorama.getPov().heading;
    this.spinIntervalId = setInterval(function(){
                //console.log("spinPanorama");
                try{
                    var pov = _self.panorama.getPov();
                    //console.log("pov.heading" + pov.heading);
                    pov.heading += _self.spinIncrement;
                    if(pov.heading > 360.0) {
                        pov.heading -= 360.0;
                    }
                    if(pov.heading < 0.0) {
                        pov.heading += 360.0;
                    }
                    _self.panorama.setPov(pov);
                    //console.log("pov", pov.heading);

                    // find the end of the spin
                    if(pov.heading < _self.spinPanoramaStartHeading-1
                             && pov.heading > _self.spinPanoramaStartHeading-5){
                        _self.stopSpinPanorama();
                        _self.spinPanoramaStartHeading = pov.heading;
                    }
                    // only do this once per spin
                    if(_self.need_spinPanoramaStartHeading){
                        _self.need_spinPanoramaStartHeading = false;
                        _self.spinPanoramaStartHeading = pov.heading;
                    }
                }catch(e){
                    console.log("caught: %o", e);
                }
            }, _self.spinInterval);
}
