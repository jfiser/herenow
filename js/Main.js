function Main(_latLongObj){
    this.streetView = new StreetView(this, _latLongObj);
    this.mapView = new MapView(this, _latLongObj, this.streetView);
    this.searchPlaces = new SearchPlaces(input, this.mapView.map, this.streetView);
    this.speechRecog = new SpeechRecognition(this.streetView);
    this.middleBar = new MiddleBar(this, this.mapView, this.streetView, 
                                        document.getElementById('middleBar'));
    this.mapView.addSearchPlaces(this.searchPlaces);
    this.handleTouchDevices();
    var _self = this;

    $(window).resize(function(){
        _self.windowResize();
    });
    this.windowResize();
}
Main.prototype.handleTouchDevices = function(){
    if(this.isTouchDevice()){
        $(".tooltiptext").css("visibility", "hidden");
    }  
}
Main.prototype.windowResize = function(){
    var middleBarLoc;
    // horizontal    
    /*if($(window).width() > $(window).height()){
        middleBarLoc = parseInt($("#middleBar").css("left")) / $("#mainHolder").width()
                                                * $("#mainHolder").width();
    }
    else{ // vertical
        middleBarLoc = parseInt($("#middleBar").css("top")) / $("#mainHolder").height()
                                                * $("#mainHolder").height();
    }*/

    // horizontal    
    if($(window).width() > $(window).height()){
        middleBarLoc = parseInt($("#middleBar").css("left")) / $("#mainHolder").width()
                                                * $("#mainHolder").width();
        $("#pano").width(middleBarLoc);
        $("#pano").height("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").width("43px");
        $("#middleBar").height("100%");
        $("#middleBar").css("left", middleBarLoc);
        $("#middleBar").css("top", 0);

        $("#map").width($("#mainHolder").width() 
                            - middleBarLoc 
                            - $("#middleBar").width());
        $("#map").height("100%");
        $("#map").css("right", 0);
        $("#map").css("top", 0);
    }
    else{  // vertical
        middleBarLoc = parseInt($("#middleBar").css("top")) / $("#mainHolder").height()
                                                * $("#mainHolder").height();
        $("#pano").height(middleBarLoc);
        $("#pano").width("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").height("43px");
        $("#middleBar").width("100%");
        $("#middleBar").css("top", middleBarLoc);
        $("#middleBar").css("left", 0);
        
        console.log("b4 mainHolder: " + $("#mainHolder").height());
        console.log("b4 middleBar_t: " + $("#middleBar").css("top"));

        $("#map").height($("#mainHolder").height() 
                            - $("#middleBar").height() 
                            - middleBarLoc);
        console.log("after middle_t: " + $("#middleBar").css("top"));
        $("#map").width("100%");
        $("#map").css("left", 0);
        $("#map").css("bottom", 0);
    }
}
Main.prototype.isTouchDevice = function(){
  var bool = 'ontouchstart' in window || navigator.maxTouchPoints;
  console.log("touch?: " + bool);
  return(bool); 
};
