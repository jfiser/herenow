function Main(_latLongObj){
    this.streetView = new StreetView(_latLongObj);
    this.mapView = new MapView(_latLongObj, this.streetView);
    this.searchPlaces = new SearchPlaces(input, this.mapView.map, this.streetView);
    this.speechRecog = new SpeechRecognition(this.streetView);
    this.middleBar = new MiddleBar(this.mapView, this.streetView, 
                                        document.getElementById('middleBar'));
    this.mapView.addSearchPlaces(this.searchPlaces);
    this.windowResize();
}
Main.prototype.windowResize = function(){
    // horizontal
    if($(window).width() > $(window).height()){
        $("#pano").width($("#middleBar").css("left"));
        $("#pano").height("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").width("35px");
        $("#middleBar").height("100%");
        $("#middleBar").css("left", $("#pano").width());
        $("#middleBar").css("top", 0);

        
        $("#map").width($("#mainContainer").width() 
                            - $("#pano").width() 
                            - $("#middleBar").width());
        $("#map").height("100%");
        $("#map").css("right", 0);
        $("#map").css("top", 0);

    }
    else{  // vertical
        $("#pano").height($("#middleBar").css("top"));
        $("#pano").width("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").height("35px");
        $("#middleBar").width("100%");
        $("#middleBar").css("top", $("#pano").height());
        $("#middleBar").css("left", 0);

        
        $("#map").height($("#mainContainer").height() 
                            - $("#pano").height() 
                            - $("#middleBar").height());
        $("#map").width("100%");
        $("#map").css("left", 0);
        $("#map").css("bottom", 0);
    }     
}