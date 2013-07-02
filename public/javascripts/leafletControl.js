//Leaflet Control



var radius = 10, tips = {};
var map, polymaps, geoJsonLayer, tracking, intervalId, coordsChecked = false, trackLinesChecked = false, mouseOnMap = false, placingObject = false;
var objects = {
        length:0
};
var trackArray = [];
var tempObject;

var refreshTime = 1000;

var southWest = new L.LatLng(-85, -180);
var northEast = new L.LatLng(85, 180);
var mapBounds = new L.LatLngBounds(southWest, northEast);



var map = L.map('map', {
    center:[38.85, -77.38],
    zoom:8,
    minZoom:1,
    maxZoom:10
});



map.setMaxBounds(mapBounds);

//styles
//998
//

L.tileLayer('http://{s}.tile.cloudmade.com/4d930419c5694793952eb15712060385/2400/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

/*
L.tileLayer('cloudmade/images/998/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 8,
    
}).addTo(map);
*/


addDefaultObjects();




function addDefaultObjects(){
//Default objects
    
    var marker = L.marker([38.85, -77.38], {
        icon:L.divIcon({
            iconSize:[20,20],
            html:"<img class='leaflet-div-icon-img' src='/images/airplane.gif'>"
        })
    }).addTo(map);
    
    $(".leaflet-marker-icon").css({background:"transparent", border:"0px"});
    
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    
    var newObject = {
        "id": "1",
        "type":"plane",
        "properties": {
            "coordinates": [38.85, -77.38],
            "angle":45,
            "speedMPH":20
        },
        "tracks":[],
        "other":{
            "marker":marker,
            "icon":"images/airplane.png"
        }
    };
  
    objects.length++;
    objects["1"] = newObject;
    
    //update();
  
    document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
    $("#dvDiv ol").append("<li id=dvObj" + newObject.id + ">ID: " + newObject.id  + 
            "<ul>" + 
            "<li id=dvObj" + newObject.id + "lat>Latitude: " + newObject.properties.coordinates[1] + 
            "<li id=dvObj" + newObject.id + "lon>Longitude: " + newObject.properties.coordinates[0] +  
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
       
        tempObject.properties.coordinates[0] = lng;
        tempObject.properties.coordinates[1] = lat;
        
        tempObject.other.marker.setLatLng([lat, lng]);
        
        
        
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
                                    "<li id=dvObj" + newObject.id + "lat>Latitude: " + newObject.properties.coordinates[1] + 
                                    "<li id=dvObj" + newObject.id + "lon>Longitude: " + newObject.properties.coordinates[0] +  
                                "<ul>");
    
        objects[newObject.id] = newObject;
        
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

function showTrackLines(){
    if(trackLinesChecked == false){
        trackLinesChecked = true;
    } else {
        trackLinesChecked = false;
    }
}

function startTracking(){
    if(!tracking){
        tracking = true;
        intervalId = setInterval(refresh, refreshTime);
    }
}

function stopTracking(){
    if(tracking){
        tracking = false;
        clearInterval(intervalId);
    }
}

function createObject(track){
    
    objects.length++;
  
    if(track){
        //console.log('making object from track');
     
        tempObject = {
            "id": objects.length,
            "type":"plane",
            "properties": {
              "coordinates": [track.lon, track.lat],
              "angle":track.angle,
              "speedMPH":track.speedMPH
             },
             "tracks":[track],
             "other":{
                 "marker":L.marker([track.lat, track.lon], {
                     icon:L.divIcon({
                         iconSize:[20,20],
                         html:"<img class='leaflet-div-icon-img' id='planeImg" + objects.length + "' src='/images/airplane.gif'>"
                     })
                 }).addTo(map),
                 "icon":"images/airplane.png"
             }      
        };
        
        tempObject.other.marker.bindPopup("<b>Id: " + tempObject.id + "</b><br>   Longitude: " + tempObject.properties.coordinates[1] + "<br>   Latitude: " + tempObject.properties.coordinates[0]);
        
        
        
        
        
        document.getElementById("activeObjLabel").innerHTML = "Active Objects: " + objects.length;
        
        $("#dvDiv ol").append("<li id=dvObj" + tempObject.id + ">ID: " + tempObject.id  + 
                                "<ul>" + 
                                    "<li id=dvObj" + tempObject.id + "lat>Latitude: " + tempObject.properties.coordinates[1] + 
                                    "<li id=dvObj" + tempObject.id + "lon>Longitude: " + tempObject.properties.coordinates[0] +  
                                "<ul>");
        
        objects[tempObject.id] = tempObject;
        
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
            "id": objects.length,
            "type":"plane",
            "properties": {
              "coordinates": [0, 0],
              "angle":0,
              "speedMPH":0
             },
             "tracks":[],
             "other":{
                 "marker":L.marker([0, 0], {
                     icon:L.divIcon({
                         iconSize:[20,20],
                         html:"<img class='leaflet-div-icon-img' src='/images/airplane.gif'>"
                     })
                 }).addTo(map),
                 "icon":"images/airplane.png"
             }      
        };
    }
    
    $(".leaflet-marker-icon").css({background:"transparent", border:"0px"});
}



var latChange;
var lngChange;
function refresh(){
    
    if(trackArray.length > 0){
        
        var i=0;
        var t1 = new Date().getTime();
        //Progress through received tracks
        for(i=0;i<trackArray.length;i++){
            var track = trackArray.shift();
            
            var trackId = track.id;
            
            
            if(objects[trackId]){
                //exists
                var tLat = track.lat;
                var tLon = track.lon;
                var tAngle = track.angle;
                var tSpeed = track.speedMPH;
                
                //Update lat-lon
                objects[trackId].properties.coordinates[0] = tLat;
                objects[trackId].properties.coordinates[1] = tLon;
                
                //Update angle and speed
                objects[trackId].properties.angle = tAngle;
                objects[trackId].properties.speedMPH = tSpeed;
                
                //Add track
                objects[trackId].tracks.push(trackArray[i]);
                
                
                objects[trackId].other.marker.setLatLng([tLat, tLon]);
                
                
                $("#planeImg" + trackId).rotate(tAngle);
                
                document.getElementById("dvObj" + track.id + "lat").innerHTML = "Latitude: " + track.lat;
                document.getElementById("dvObj" + track.id + "lon").innerHTML = "Longitude: " + track.lon;
                   
            } else {
                createObject(trackArray[i]);
                console.log('making');
            }
        }
        var t2 = new Date().getTime();
        
        var dif = t2 - t1;
        console.log(dif + ' - ' + trackArray.length);
    } else {
        //manual movement for testing purposes
        var lat = objects["1"].properties.coordinates[0];
        var lng = objects["1"].properties.coordinates[1];
        var angle = objects["1"].properties.angle;
        var speedMPH = objects["1"].properties.speedMPH;
        
        var miles = speedMPH/(60*60*(1000/refreshTime));
        
        var realAngle = (angle*-1)+450;
        
        
        //Angle bounds - 0 < angle < 360
        if(angle >= 360){
            console.log('changeeeeeeee');
            angle-=360;
        } else if(angle<=0){
            angle+=360;
        }
        
        if(realAngle >= 360){
            realAngle-=360;
        } else if(realAngle <= 0){
            realAngle+=360;
        }
        
        
        
        
        
        var realAngleRad = realAngle * (Math.PI/180);
        
        var xMiles = Math.abs(Math.cos(realAngleRad) * miles);
        var yMiles = Math.abs(Math.sin(realAngleRad) * miles);
        
      
        latChange = yMiles / 69.11;
        
        lngChange = xMiles / (69.11*Math.cos(lat));
        
        //console.log(xMiles);
        console.log("LAT Delta:" + latChange)
        console.log("LNG Delta: " + lngChange);
        console.log("Angle: " + angle);
        console.log("Real Angle:" + realAngle);
        console.log("");
        
        
        
        
        
        //Figure out how to add distance
        if(angle <= 90){
            lat+=latChange;
            lng+=lngChange;
        } else if(angle <= 180){
            lat-=latChange;
            lng+=lngChange;
        } else if(angle <= 270){
            lat-=latChange;
            lng-=lngChange;
        } else{
            lat+=latChange;
            lng-=lngChange;
        }
        
        angle+=1;
        
        
        
        
        objects["1"].properties.coordinates[0]=lat;
        objects["1"].properties.coordinates[1]=lng;
        
        objects["1"].properties.angle = angle;
        
        objects["1"].other.marker.setLatLng([lat, lng]);
        
        $(".leaflet-div-icon-img:first").rotate(angle);
        
    }
    
    
            
    
}



