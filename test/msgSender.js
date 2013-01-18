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

function moveObjects(){
    
    object.utcTime+=1;
    object.lon-=.1;
    object2.utcTime+=1;
    object2.lat+=.1;
    object2.lon-=.1;
    
}