
var radius = 10, tips = {};
var map, po, geoJsonLayer, tracking, intervalId, coordsChecked = false, mouseOnMap = false, placingObject = false;
var objects = [];
var trackArray = [];
var idCounter = 0;
var tempObject;


function buildMap(){

    po = org.polymaps;

    map = po.map()
        .container(document.getElementById("map").appendChild(po.svg("svg")))
        .center({lon: -122.20877392578124, lat: 37.65175620758778})
        .zoom(10)
        .add(po.interact())
        .on("move", move)
        .on("resize", move);

    map.add(po.image()
        .url(po.url("http://{S}tile.cloudmade.com"
        + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
        + "/998/256/{Z}/{X}/{Y}.png")
        .hosts(["a.", "b.", "c.", ""])));
        
    map.add(po.compass()
        .pan("none"));
}


function addDefaultObjects(){
  //Default objects
    var obj1 = {
      "id": "stanford",
      "properties": {
        "html": "<img src='stanford.png' width=200 height=200>"
      },
      "geometry": {
        "coordinates": [-122.16894848632812, 37.42961865341856],
        "type": "Point"
      }
    };

    var obj2 = {
      "id": "berkeley",
      "properties": {
        "html": "<img src='berkeley.png' width=200 height=200>"
      },
      "geometry": {
        "coordinates": [-122.26358225200948, 37.872092652605886],
        "type": "Point"
      }
    };
    
    objects.push(obj1, obj2);
    
    document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
    $("#dvDiv ol").append("<li>"+obj1.id+"</li>");
    $("#dvDiv ol").append("<li>"+obj2.id+"</li>");
    
}


function createGeoJsonLayer(){
    geoJsonLayer = po.geoJson();
    geoJsonLayer.on("load", load);
    geoJsonLayer.features(objects);

    map.add(geoJsonLayer);
}

function createObject(track){
    
    
    
    idCounter++;
    
    console.log(track);
    
    if(track){
        console.log('making object from track');
        tempObject = {
                "id": idCounter,
                "geometry": {
                  "coordinates": [track.lon, track.lat],
                  "type": "Point"
                 },
                 "lastTrack":true,
                 "data": {
                     "type":track.type,
                     "utcTime":track.utcTime,
                     "alertCode":track.alertCode,
                     "lat":track.lat,
                     "latHeading":track.latHeading,
                     "lon":track.lon,
                     "lonHeading":track.lonHeading,
                     "speedKnots":track.speedKnots,
                     "angle":track.angle,
                     "date":track.date
                 }   
        };
        
        document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
        
        $("#dvDiv ol").append("<li id=dvObj" + tempObject.id + ">ID: " + tempObject.id  + 
                                "<ul>" + 
                                    "<li id=dvObj" + tempObject.id + "lat>Latitude: " + tempObject.geometry.coordinates[1] + 
                                    "<li id=dvObj" + tempObject.id + "lon>Longitude: " + tempObject.geometry.coordinates[0] +  
                                "<ul>");
        
    } else {
        
        if(placingObject){
            //error
        } else {
          placingObject = true;
        }
        tempObject = {
                "id": idCounter,
                "geometry": {
                  "coordinates": [0, 0],
                  "type": "Point"
                 },
                 "lastTrack":null,
                 "data": {
                     "type":null,
                     "utcTime":null,
                     "alertCode":null,
                     "lat":null,
                     "latHeading":null,
                     "lon":null,
                     "lonHeading":null,
                     "speedKnots":null,
                     "angle":null,
                     "date":null
                 }
            };
    }
    
    
    
    objects.push(tempObject);
    geoJsonLayer.features(objects);
}

function load(e) {
  for (var i = 0; i < e.features.length; i++) {
    var f = e.features[i];
    f.element.setAttribute("r", radius);
  }
}

function move() {
  for (var id in tips) {
    update(tips[id]);
  }
}

function refresh(){
    
    /* Manual Move
    obj1.geometry.coordinates[0]+=.001;
    obj2.geometry.coordinates[0]+=.002;
    obj2.geometry.coordinates[1]-=.001;
    geoJsonLayer.reload();
    */
    
    
    
    if(trackArray.length > 0){
        
      //Progress through received tracks
        for(var i=0;i<trackArray.length;i++){
            var objectExists = false;
            var trackId = trackArray[i].id;
            
            //Compare to known objects
            for(var j=0;j<objects.length;j++){
                var objId = objects[j].id;
                
                if(trackId == objId){
                    objectExists = true;
                    var obj = objects[j];
                    
                    
                    
                    
                    //var msgArray = trackArray[i].split(',');
                    
                    
                    var type = trackArray[i].type;
                    var utcTime = trackArray[i].utcTime;
                    var alertCode = trackArray[i].alertCode;
                    var lat = trackArray[i].lat;
                    var latHeading = trackArray[i].latHeading;
                    var lon = trackArray[i].lon;
                    var lonHeading = trackArray[i].lonHeading;
                    var speedKnots = trackArray[i].speedKnots;
                    var angle = trackArray[i].angle;
                    var date = trackArray[i].date;
                    var id = trackArray[i].id;
                    
                    document.getElementById("dvObj" + objId + "lat").innerHTML = "Latitude: " + lat;
                    document.getElementById("dvObj" + objId + "lon").innerHTML = "Longitude: " + lon;
                    
                    
                    if(obj.lastTrack == null){
                        
                        
                        obj.lastTrack = true;
                        obj.data.type = type;
                        obj.data.utcTime = utcTime;
                        obj.data.alertCode = alertCode;
                        obj.data.lat = lat;
                        obj.data.latHeading = latHeading;
                        obj.data.lon = lon;
                        obj.data.lonHeading = lonHeading;
                        obj.data.speedKnots = speedKnots;
                        obj.data.angle = angle;
                        obj.data.date = date;
                        obj.data.id = id;
                    } else {
                        var latMove = obj.data.lat - lat;
                        var lonMove = obj.data.lon - lon;
                        
                        obj.geometry.coordinates[0]+=lonMove;
                        obj.geometry.coordinates[1]+=latMove;
                        
                        obj.data.type = type;
                        obj.data.utcTime = utcTime;
                        obj.data.alertCode = alertCode;
                        obj.data.lat = lat;
                        obj.data.latHeading = latHeading;
                        obj.data.lon = lon;
                        obj.data.lonHeading = lonHeading;
                        obj.data.speedKnots = speedKnots;
                        obj.data.angle = angle;
                        obj.data.date = date;
                        obj.data.id = id;
                        
                        geoJsonLayer.reload();
                         
                    } //previous track existence 
                }//track id matches object id   
            }//loop through array of objects
            
            
            
            if(objectExists == false){
                //time to create a new object
                console.log('make a new object!');
                createObject(trackArray[i]);
            }
        }
    }
     
}

function startTracking(){
    if(!tracking){
        tracking = true;
        intervalId = setInterval(refresh, 1000);
    }
}

function stopTracking(){
    if(tracking){
        tracking = false;
        clearInterval(intervalId);
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

function mouseMoveHandler(event){
    if(placingObject == true){
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        mouseX-=34;
        mouseY-=264;
        
        coords = map.pointLocation({x:mouseX, y:mouseY});
        mouseLon = coords.lon;
        mouseLat = coords.lat;
        
        mouseLon = roundDecimal(mouseLon, 9);
        mouseLat = roundDecimal(mouseLat, 9);
        
        
        
        tempObject.geometry.coordinates[0] = mouseLon;
        tempObject.geometry.coordinates[1] = mouseLat;
        
        document.getElementById("textCoords").innerHTML = mouseX + ' ' + mouseY;
        geoJsonLayer.reload();
        
    } else {
        if(coordsChecked == true){
            mouseX = event.clientX;
            mouseY = event.clientY;
            coords = map.pointLocation({x:mouseX, y:mouseY});
            mouseLon = coords.lon;
            mouseLat = coords.lat;
            
            mouseLon = roundDecimal(mouseLon, 9);
            mouseLat = roundDecimal(mouseLat, 9);
            
            document.getElementById("textCoords").innerHTML="Latitude: " + mouseLat + "\nLongitude: " + mouseLon;
        }
    }    
}

function mapClick(){
    if(placingObject == true){
        placingObject = false;
        
        var newObject = {
            "id": idCounter,
            "geometry": {
              "coordinates": [0, 0],
              "type": "Point"
            }
                
                
        };
        
        newObject.geometry.coordinates[0] = tempObject.geometry.coordinates[0];
        newObject.geometry.coordinates[1] = tempObject.geometry.coordinates[1];
        

        document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
        
        $("#dvDiv ol").append("<li id=dvObj" + newObject.id + ">ID: " + newObject.id  + 
                                "<ul>" + 
                                    "<li id=dvObj" + newObject.id + "lat>Latitude: " + newObject.geometry.coordinates[1] + 
                                    "<li id=dvObj" + newObject.id + "lon>Longitude: " + newObject.geometry.coordinates[0] +  
                                "<ul>");
    }
}


function mouseOntoMap(){
    if(mouseOnMap == false){
        mouseOnMap = true;
    }
}

function mouseOutofMap(){
    if(mouseOnMap == true){
        mouseOnMap = false;
    }
}


buildMap();
createGeoJsonLayer();