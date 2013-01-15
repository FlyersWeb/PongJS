var express = require('express');
var pg = require('pg');
var io = require('socket.io');

var app = express.createServer(express.logger());

var dbURL = process.env.DATABASE_URL || {database:'d44eb75c6ckggo',host:'ec2-54-243-238-144.compute-1.amazonaws.com',port:5432,user:'ngifkstzlkpgnx',password:'HRjCAmNR3QAk7TZ5P7YBvj-Pma',ssl:true};
var db = new pg.Client(dbURL);
db.connect();

app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

var port = process.env.PORT || 5555;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var sio = io.listen(app);
sio.sockets.on('connection', function(socket){
    console.log("New connection");
    socket.emit('news', { hello: 'world' });
});