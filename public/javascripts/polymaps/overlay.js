var po = org.polymaps;

var objects = [];
var mouseOnMap = false;
var mouseX = 0;
var mouseY = 0;
var mouseLon = 0;
var mouseLat = 0;
var coordsChecked = false;
var placingObject = false;

var lon1 = -122;
var lat1 = 38;

var lon2 = -121;
var lat2 = 37;

var lon3 = -120;
var lat3 = 38;

var lon4 = -119;
var lat4 = 37;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
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



map.add(po.compass()
    .pan("none"));




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
    mapLayer.reload();
}


/** A lightweight layer implementation for an image overlay. */
function overlay(tile, proj) {
  proj = proj(tile);
  
  console.log(tile);
  
  
  var topLeft1 = proj.locationPoint({lon: lon1, lat: lat1}),
      bottomRight1 = proj.locationPoint({lon: lon2, lat: lat2}),
      image = tile.element = po.svg("image");
  
  console.log(tile);
  
  
  image.setAttribute("preserveAspectRatio", "none");
  image.setAttribute("x", topLeft1.x);
  image.setAttribute("y", topLeft1.y);
  image.setAttribute("width", bottomRight1.x - topLeft1.x);
  image.setAttribute("height", bottomRight1.y - topLeft1.y);
  image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/images/star.png");
  

  var topLeft2 = proj.locationPoint({lon: lon3, lat: lat3}),
  bottomRight2 = proj.locationPoint({lon: lon4, lat: lat4}),
  image2 = tile.element = po.svg("image");
  
  
  image2.setAttribute("preserveAspectRatio", "none");
  image2.setAttribute("x", topLeft2.x);
  image2.setAttribute("y", topLeft2.y);
  image2.setAttribute("width", bottomRight2.x - topLeft2.x);
  image2.setAttribute("height", bottomRight2.y - topLeft2.y);
  image2.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/images/star.png");




  
}


