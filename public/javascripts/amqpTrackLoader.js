var amqp = require('amqp');

var receiveDataFlag = false;

var clientSocket = null;



function startTrackLoader () {
    var connection = amqp.createConnection({host:'localhost'});


    connection.on('ready', function(){
        
        //Create queue
        queueTMS = connection.queue('TMS', {autoDelete:false}, function(queue){
            
            console.log('TMS Queue has been created');

            queue.subscribe(msgHandler);
            
            
        });
    });
}




function msgHandler(msg){
    console.log('Got EM msg');
    
    
    if(clientSocket){
        console.log('Emitting socket msg');
        clientSocket.emit('TMS', msg);
    }
    
}

function sendData(socket){
    clientSocket = socket;
    
}



module.exports.startTrackLoader = startTrackLoader;
module.exports.sendData = sendData;