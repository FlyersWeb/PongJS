var express = require('express')
  , app = express()
  , pg = require('pg');

app.use("/plugin", express.static(__dirname + '/plugin'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/rsc", express.static(__dirname + '/rsc'));
app.use("/socket.io", express.static(__dirname + '/js'));

GLOBAL.devel = false;
if (process.argv.indexOf('--devel') > -1){
   GLOBAL.devel = true;
}

if (GLOBAL.devel) {
	var databaseAccess = {database:'pong',host:'localhost'};
} else {
	var databaseAccess = {database:'d44eb75c6ckggo',host:'ec2-54-243-238-144.compute-1.amazonaws.com',port:5432,user:'ngifkstzlkpgnx',password:'HRjCAmNR3QAk7TZ5P7YBvj-Pma',ssl:true};

	// assuming io is the Socket.IO server object
	io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 10); 
	});
}

var dbURL = process.env.DATABASE_URL || databaseAccess;
var db = new pg.Client(dbURL);
db.connect();

app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

var io = require('socket.io').listen(server, {log:true});
io.sockets.on('connection', function(socket){
    console.log("New connection");
    var self = this;
    self.P1 = self.P2 = {};
    // socket.emit('news', { hello: 'world' });
	socket.on('moved', function( data ) {
		if ( data.pid == 1 ) {
			self.P1 = JSON.parse(data.pos);
		} else {
			self.P2 = JSON.parse(data.pos);
		}
	});

	var moves = setInterval(function(){
		socket.emit('move', {P1:JSON.stringify(self.P1),P2:JSON.stringify(self.P2)});
	},100);
});

io.sockets.on('disconnect', function(){
	clearInterval(moves);
});