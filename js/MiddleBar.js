function MiddleBar(_mapView, _streetView, _middleBarEl){
    this.mapView = _mapView;
    this.streetView = _streetView;
    this.middleBarEl = _middleBarEl;
    this.setMiddleBarDraggable();
    $(window).resize = function(){
        //resizeMapAndPano(evt);
    }
    
}
MiddleBar.prototype.setMiddleBarDraggable = function(){
    var _self = this;

    this.middleBarDrag = Draggable.create("#middleBar", {type:"top,left", 
            //edgeResistance:0.65, 
            //dragResistance:.20,
            //throwResistance:10000,
            //throwProps:true,
            //bounds:{minX: -1100, maxY:1855},
            force3D: false,
            //bounds:{top:0, left:100},
            onDrag:function(evt){      
                evt.preventDefault();
                _self.resizeMapAndPano(evt);
            },
            onDragStart:function(evt){
                //evt.preventDefault();
            },
            onPress:function(evt){
                //console.log("onPress -css(left): " + parseInt($("#middleBar").css("left")));
            },
            onRelease:function(evt){
                //console.log("release this.y: " + this.y);
                google.maps.event.trigger(_self.mapView.map, "resize");
                google.maps.event.trigger(_self.streetView.panorama, "resize");
                //$("#middleBar").y 
            },
            onDragEnd:function(evt){
                _self.resizeMapAndPano(evt);
            },
            //onThrowComplete:testBounds,                             
            lockaxis:true

        });                                     
}
MiddleBar.prototype.resizeMapAndPano = function(_evt){
    /*var zz = parseInt($("#middleBar").css("left"));
    console.log("zz: " + zz);
    if(isNaN(zz)){
        console.log("ISNAN - return");
        return;
    }*/
    if($(window).width() > 800){
        $("#map").width(_evt.pageX);
        //$("#map").width(parseInt($("#middleBar").css("left")));
        console.log("_evt.pageX: " + _evt.pageX);
        console.log("css(left): " + parseInt($("#middleBar").css("left")));

        $("#pano").width($("#flexContainer").width() 
                                        - $("#map").width()
                                        - $("#middleBar").width());
        $("#map").height("auto");
        $("#pano").height("auto");
    }
    else{
        console.log("_evt %o: ", _evt);
        //console.log("_evt.target.offsetTop: " + _evt.target.offsetTop);
        //console.log("_evt.pageX: " + _evt.pageX);
        $("#map").height(_evt.pageY);
        //$("#map").height(_evt.target.offsetTop);
        //$("#map").height(parseInt($("#middleBar").css("top")));
        //$("#map").height(_evt.y);
        $("#pano").height($("#flexContainer").height() 
                                        - $("#map").height()
                                        - $("#middleBar").height());
        $("#map").width("auto");
        $("#pano").width("auto");
    }
}


