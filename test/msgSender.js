var amqp = require('amqp');
var NanoTimer = require('nanotimer');

var timer = new NanoTimer();
var object = {
        'type':'$GPRMC',
        'utcTime':123532,
        'alertCode':'A',
        'lat':35,
        'latHeading':'N',
        'lon':-122,
        'lonHeading':'W',
        'speedKnots':70,
        'angle':277.5,
        'date':180113,
        'id':'1'
};

var object2 = {
        'type':'$GPRMC',
        'utcTime':123532,
        'alertCode':'A',
        'lat':37.30006,
        'latHeading':'N',
        'lon':-119,
        'lonHeading':'W',
        'speedKnots':70,
        'angle':277.5,
        'date':180113,
        'id':'2'
        
};

var connection = amqp.createConnection({host:'localhost'});

connection.on('ready', function(){
    
    timer.setInterval(function(){
        connection.publish('TMS', object);
        connection.publish('TMS', object2);
        console.log('Sent msg');
        moveObjects();
        
    }, 1000000000);
    
});

var difLat1, difLon1, difLat2, difLon2 = null;

function moveObjects(){
    
    
    
    object.utcTime+=1;
    object.lon-=.1;
    
    if(difLat1 != null && difLon1 != null){
        var difLat1 = lastLat1 - object.lat;
        var difLon1 = lastLon1 - object.lon;
    } else {
        var difLat1 = 0;
        var difLon1 = 0;
    }
    
    
    
    object2.utcTime+=1;
    object2.lat+=.1;
    object2.lon-=.1;
    
    if(difLat2 != null && difLon2 != null){
        var difLat2 = lastLat1 - object.lat;
        var difLon2 = lastLon1 - object.lon;
    } else {
        var difLat2 = 0;
        var difLon2 = 0;
    }
    
    
    var angle1 = Math.atan(difLat1/difLon1);
    var angle2 = Math.atan(difLat2/difLon2);
    
    console.log(angle1);
    
    
}