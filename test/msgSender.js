var amqp = require('amqp');
var NanoTimer = require('nanotimer');

var timer = new NanoTimer();

var objects = [];

createObjects();

function createObjects(){
    var count = 500;
    var id = 1;
    var time = 123532;
    var lat = 35;
    var lon = -122;
    var speedMPH = 25;
    var angle = 277;
    var date = 180113;
    
    
    for(var i=0;i<count;i++){
        var newObject = {
            'type':'$GPRMC',
            'utcTime':time,
            'alertCode':'A',
            'lat':lat,
            'latHeading':'N',
            'lon':lon,
            'lonHeading':'W',
            'speedMPH':speedMPH,
            'angle':angle,
            'date':date,
            'id':id
        };
        
        id+=1;
        lat = (Math.random()*180) - 90;
        lon = (Math.random() * 360) - 180;
        speedMPH = (Math.random()*50) + 1;
        angle = Math.random()*360;
        
        objects.push(newObject);
    }
    
    
}


console.log(objects.length);

//AMQP connection
var connection = amqp.createConnection({host:'localhost'});

connection.on('ready', function(){
    timer.setInterval(function(){

        
        for(var i = 0;i < objects.length;i++){
            
            connection.publish('TMS', objects[i]);
        }
        
        console.log('sent msgs');
        
        moveObjects();
        
    }, '2s');
    
});



//PHYSICS
var difLat1, difLon1, difLat2, difLon2 = null;

function moveObjects(){
    
    for(var i=0;i<objects.length;i++){
        if(i==0){
            objects[i].utcTime+=1;
            objects[i].lon-=.5;
        } else {
            objects[i].utcTime+=1;
            objects[i].lon-=.1;
        }
        
    }
    /*
    
    if(difLat1 != null && difLon1 != null){
        var difLat1 = lastLat1 - object.lat;
        var difLon1 = lastLon1 - object.lon;
    } else {
        var difLat1 = 0;
        var difLon1 = 0;
    }
    
    
    
    
    var angle1 = Math.atan(difLat1/difLon1);
    
    console.log(angle1);
    */
    
}