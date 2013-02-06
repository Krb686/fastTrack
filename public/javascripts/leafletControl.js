//Leaflet Control

var objects = [];

var radius = 10, tips = {};
var map, polymaps, geoJsonLayer, tracking, intervalId, coordsChecked = false, mouseOnMap = false, placingObject = false;
var objects = [];
var trackArray = [];
var idCounter = 0;
var tempObject;

var map = L.map('map', {
    center:[38.85, -77.38],
    zoom:8
});


L.tileLayer('http://{s}.tile.cloudmade.com/4d930419c5694793952eb15712060385/998/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18,
    
}).addTo(map);


addDefaultObjects();



function addDefaultObjects(){
//Default objects
    
    var marker = L.marker([38.85, -77.38], {
        icon:L.icon({
            iconUrl:"../images/airplane.png",
            iconSize:[20,20]
        })
    }).addTo(map);
    
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    
    var newObject = {
        "id": "1",
        "properties": {
            "url": "../images/airplane.png",
            "bounds":[[38.8, -77.3], [38.9, -77.28]]
        },
        "geometry": {
            "coordinates": [38.85, -77.38],
            "type": "Point"
        },
        "lastTrack":null,
        "data":{
            //
        },
        "marker":marker
    };
  
    idCounter++;
    objects.push(newObject);
  
    document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
    $("#dvDiv ol").append("<li id=dvObj" + newObject.id + ">ID: " + newObject.id  + 
            "<ul>" + 
            "<li id=dvObj" + newObject.id + "lat>Latitude: " + newObject.geometry.coordinates[1] + 
            "<li id=dvObj" + newObject.id + "lon>Longitude: " + newObject.geometry.coordinates[0] +  
        "<ul>");
       
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


function mouseMoveHandler(event){
    if(placingObject == true){
        
        var latLng = map.mouseEventToLatLng(event);
        var lat = latLng.lat;
        var lng = latLng.lng;
        
        lat = roundDecimal(lat, 9);
        lng = roundDecimal(lng, 9);
       
        tempObject.geometry.coordinates[0] = lng;
        tempObject.geometry.coordinates[1] = lat;
        
        tempObject.marker.setLatLng([lat, lng]);
        
        
        
        document.getElementById("textCoords").innerHTML = lat + ' ' + lng;
        
        
    } else {
        if(coordsChecked == true){
            
            var latLng = map.mouseEventToLatLng(event);
            var lat = latLng.lat;
            var lng = latLng.lng;
            
           
            
            lng = roundDecimal(lng, 9);
            lat = roundDecimal(lat, 9);
            
            document.getElementById("textCoords").innerHTML="Latitude: " + lat + "\nLongitude: " + lng;
            
        }
    }    
}


function mapClick(){
    if(placingObject == true){
        placingObject = false;
        
        document.getElementById("textCoords").innerHTML="";
        
        var newObject = tempObject;
        tempObject = null;
        
        
        

        document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
        
        $("#dvDiv ol").append("<li id=dvObj" + newObject.id + ">ID: " + newObject.id  + 
                                "<ul>" + 
                                    "<li id=dvObj" + newObject.id + "lat>Latitude: " + newObject.geometry.coordinates[1] + 
                                    "<li id=dvObj" + newObject.id + "lon>Longitude: " + newObject.geometry.coordinates[0] +  
                                "<ul>");
    
        objects.push(newObject);
        
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

function createObject(track){
    
    idCounter++;
    
    
    
    if(track){
        //console.log('making object from track');
        
        
        var marker = L.marker([track.lat, track.lon], {
            icon:L.icon({
                iconUrl:"../images/airplane.png",
                iconSize:[20,20]
            })
        });
        
        marker.addTo(map);
        
        
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
                 },
                 "marker":marker
        };
        
        document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
        
        $("#dvDiv ol").append("<li id=dvObj" + tempObject.id + ">ID: " + tempObject.id  + 
                                "<ul>" + 
                                    "<li id=dvObj" + tempObject.id + "lat>Latitude: " + tempObject.geometry.coordinates[1] + 
                                    "<li id=dvObj" + tempObject.id + "lon>Longitude: " + tempObject.geometry.coordinates[0] +  
                                "<ul>");
        
        objects.push(tempObject);
        
    } else {
        
        if(placingObject){
            //error
        } else {
          placingObject = true;
        }
        
        var marker = L.marker([38, -78], {
            icon:L.icon({
                iconUrl:"../images/airplane.png",
                iconSize:[20,20]
            })
        });
        
        marker.addTo(map);
        
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
                 },
                 "marker":marker
            };
    }    
}



rotangle = 20;
function refresh(){
    if(trackArray.length > 0){
        
        //Progress through received tracks
          for(var i=0;i<trackArray.length;i++){
              var objectExists = false;
              var trackId = trackArray[i].id;
              
              //Compare to known objects
              for(var j=0;j<objects.length;j++){
                  var objId = objects[j].id;
                  
                  //console.log("TrackId: " + trackId + "objId: " + objId);
                  if(trackId == objId){
                      objectExists = true;
                      var obj = objects[j];
                      
                      
                      
                      
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
                          
                           
                      } //previous track existence 
                  }//track id matches object id   
              }//loop through array of objects
              
              
              
              if(objectExists == false){
                  
                  //time to create a new object
                  //console.log('make a new object!');
                  createObject(trackArray[i]);
              }
          }
      }
    
    
    var latLng = objects[0].geometry.coordinates;
    var lat = latLng[0];
    var lng = latLng[1];
    
    lat+=.01;
    objects[0].geometry.coordinates[0] = lat;
    
    //console.log(lat);
    objects[0].marker.setLatLng([lat, lng]);
    
    rotangle+=5;
    console.log(angle);
    var img = $(".leaflet-marker-icon:first").rotate(rotangle);
    //
    
}

