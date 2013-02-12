
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var amqp = require('amqp');


var users = [];
var socketList = {};


function configureServer(){
    var app = express();

    

    app.configure(function(){
      app.set('port', process.env.PORT || 3000);
      app.set('views', __dirname + '/views');
      app.set('view options', {layout:false});
      app.engine('html', require('ejs').renderFile);
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function(){
      app.use(express.errorHandler());
    });

    app.get('/', function(req, res){
        res.render('indexLeaflet.html');   
    });
    
    
    //Start the server
    startServer(app);
}

function startServer(app){
    var server = http.createServer(app);

    server.listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
      io = io.listen(server);
      io.set('log level', 1);
      
      io.sockets.on('connection', connectSocket);
      
      
      startTrackLoader();
    });
    
    
    
}


function startTrackLoader () {
    var connection = amqp.createConnection({host:'localhost'});

    connection.on('ready', function(){
        
        //Create queue
        queueTMS = connection.queue('TMS', {autoDelete:false}, function(queue){
            
            console.log('TMS Queue has been created');

            queue.subscribe(msgReceiver);
            
            
        });
    });
}

//AMQP Message Listener
function msgReceiver(msg){
    console.log('Got EM msg');
    
    //If a user has connected, send data to them
    if(Object.keys(socketList).length > 0){
        console.log('Emitting to sockets...');
        io.sockets.emit('TMS', msg);
    } else {
        console.log("No users connected!");
    }
    
}


function connectSocket(socket){
    
    
    console.log(socket.id + '...connected!');
    socketList[socket.id] = socket;
    console.log('  # Users: ' + Object.keys(socketList).length);
 
    //disconnect event
    socket.on('disconnect', function(){
        console.log(socket.id + '...disconnected.');
        delete socketList[socket.id];
        console.log('  # Users: ' + Object.keys(socketList).length);
    });
}

function main(){
    configureServer();
}


main();