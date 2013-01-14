var po = org.polymaps;

var objects = [];
var mouseOnMap = false;
var mouseX = 0;
var mouseY = 0;
var mouseLon = 0;
var mouseLat = 0;
var coordsChecked = false;
var placingObject = false;

var lon1 = -122.518;
var lat1 = 37.816;

var lon2 = -122.375;
var lat2 = 37.755;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .zoomRange([1, 18])
    .add(po.interact());

map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
    + "/998/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

    
var mapLayer = po.layer(overlay).tile(false);    
map.add(mapLayer);



var geoJsonLayer = po.geoJson();
console.log('\n\n');


map.add(po.compass()
    .pan("none"));

/*
function createObject(){
    if(placingObject == false){
        placingObject = true;
    }
    
    
        
    }
    var newObject = {
            
    }
    var mapLayer = po.layer(overlay).tile(false);    
    map.add(mapLayer);
    
}
*/

function mouseOntoMap(){
    if(mouseOnMap == false){
        mouseOnMap = true;
        console.log('is true');
    }
}

function mouseOutofMap(){
    if(mouseOnMap == true){
        mouseOnMap = false;
        console.log('is false');
    }
}



function mouseMoveHandler(event){
    if(placingObject == true){
        //
    } else {
        if(coordsChecked == true){
            mouseX = event.clientX;
            mouseY = event.clientY;
            coords = map.pointLocation({x:mouseX, y:mouseY});
            mouseLon = coords.lon;
            mouseLat = coords.lat;
            
            document.getElementById("textCoords").innerHTML="Latitude: " + mouseLat + "\nLongitude: " + mouseLon;
        }
    }
    
    
    
    
}

function showCoords(){
    if(coordsChecked == false){
        coordsChecked = true;
    } else {
        coordsChecked = false;
        document.getElementById("textCoords").innerHTML="";
    }
}

var interval;
function startTracking(){
    interval = setInterval(refresh, 1000);
}

function stopTracking(){
    clearInterval(interval);
}



function refresh () {
    lon1-=.01;
    lon2-=.01;
    
    lat1+=.01;
    lat2+=.01;
    //console.log('refresh');
    map.remove(mapLayer);
    mapLayer = po.layer(overlay).tile(false);
    map.add(mapLayer);
}


/** A lightweight layer implementation for an image overlay. */
function overlay(tile, proj) {
  proj = proj(tile);
  
  var tl = proj.locationPoint({lon: lon1, lat: lat1}),
      br = proj.locationPoint({lon: lon2, lat: lat2}),
      image = tile.element = po.svg("image");
  image.setAttribute("preserveAspectRatio", "none");
  image.setAttribute("x", tl.x);
  image.setAttribute("y", tl.y);
  image.setAttribute("width", br.x - tl.x);
  image.setAttribute("height", br.y - tl.y);
  image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/images/star.png");
}


