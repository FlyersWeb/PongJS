var express = require('express');
var pg = require('pg');
var io = require('socket.io');

var app = express.createServer(express.logger());
app.use("/plugin", express.static(__dirname + '/plugin'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/rsc", express.static(__dirname + '/rsc'));

var dbURL = process.env.DATABASE_URL || {database:'d44eb75c6ckggo',host:'ec2-54-243-238-144.compute-1.amazonaws.com',port:5432,user:'ngifkstzlkpgnx',password:'HRjCAmNR3QAk7TZ5P7YBvj-Pma',ssl:true};
var db = new pg.Client(dbURL);
db.connect();

app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var sio = io.listen(app);
// assuming io is the Socket.IO server object
sio.configure(function () { 
  sio.set("transports", ["xhr-polling"]); 
  sio.set("polling duration", 10); 
});
sio.sockets.on('connection', function(socket){
    console.log("New connection");
    socket.emit('news', { hello: 'world' });
});