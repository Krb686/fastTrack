//Leaflet Control



var radius = 10, tips = {};
var map, polymaps, geoJsonLayer, tracking, intervalId, coordsChecked = false, mouseOnMap = false, placingObject = false;
var objects = {
        length:0
};
var trackArray = [];
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

function startTracking(){
    if(!tracking){
        tracking = true;
        intervalId = setInterval(refresh, 10);
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
                         html:"<img class='leaflet-div-icon-img' src='/images/airplane.gif'>"
                     })
                 }).addTo(map),
                 "icon":"images/airplane.png"
             }      
        };
        
        
        
        
        
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



rotangle = 20;
var latChange;
var lngChange;
function refresh(){
    
    if(trackArray.length > 0){
        
        var i=0;
        //Progress through received tracks
        for(i=0;i<trackArray.length;i++){
            var trackId = trackArray[i].id;
            
            
            if(objects[trackId]){
                //exists
                var tLat = trackArray[i].lat;
                var tLon = trackArray[i].lon;
                var tAngle = trackArray[i].angle;
                var tSpeed = trackArray[i].speedMPH;
                
                //Update lat-lon
                objects[trackId].properties.coordinates[0] = tLat;
                objects[trackId].properties.coordinates[1] = tLon;
                
                //Update angle and speed
                objects[trackId].properties.angle = tAngle;
                objects[trackId].properties.speedMPH = tSpeed;
                
                //Add track
                objects[trackId].tracks.push(trackArray[i]);
                
                
                objects[trackId].other.marker.setLatLng([tLat, tLon]);
                
                
                $(".leaflet-div-icon-img:first").rotate(tAngle);
                
                document.getElementById("dvObj" + trackArray[i].id + "lat").innerHTML = "Latitude: " + trackArray[i].lat;
                document.getElementById("dvObj" + trackArray[i].id + "lon").innerHTML = "Longitude: " + trackArray[i].lon;
                   
            } else {
                createObject(trackArray[i]);
                console.log('making');
            }
        }
    } else {
        //manual movement for testing purposes
        var lat = objects["1"].properties.coordinates[0];
        var lng = objects["1"].properties.coordinates[1];
        var angle = objects["1"].properties.angle;
        var speedMPH = objects["1"].properties.speedMPH;
        
        var miles = speedMPH/3600;
        
        var realAngle = (angle*-1)+450;
        
        
        
        if(angle >= 360){
            console.log('changeeeeeeee');
            angle-=360;
        } else if(angle<=0){
            angle+=360;
        }
        
        
        
        var realAngleRad = realAngle * (Math.PI/180);
        
        var xMiles = Math.abs(Math.cos(realAngleRad) * miles);
        var yMiles = Math.abs(Math.sin(realAngleRad) * miles);
        
      
        latChange = yMiles / 69.11;
        
        lngChange = xMiles / (69.11*Math.cos(lat));
        
        //console.log(xMiles);
        console.log(xMiles);
        console.log(angle);
        console.log("");
        
        
        
        
        
        //Figure out how to add distance
        if(realAngle <= 90){
            lat+=latChange;
            lng+=lngChange;
        } else if(realAngle <= 180){
            lat+=latChange;
            lng-=lngChange;
        } else if(realAngle <= 270){
            lat-=latChange;
            lng-=lngChange;
        } else{
            lat-=latChange;
            lng+=lngChange;
        }
        
        angle+=1;
        
        
        
        
        objects["1"].properties.coordinates[0]=lat;
        objects["1"].properties.coordinates[1]=lng;
        
        objects["1"].properties.angle = angle;
        
        objects["1"].other.marker.setLatLng([lat, lng]);
        
        $(".leaflet-div-icon-img:first").rotate(45-realAngle);
        
    }
    
    
            
    
}



