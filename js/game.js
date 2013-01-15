var serverUrl = window.location.protocol+'//'+window.location.hostname+':'+window.location.port;
var socket = io.connect(serverUrl);


$(document).ready(function() {
	/* Getting canvas DOM element */
	var canvas = document.getElementById("game");
	/* Getting context */
	var ctxt = canvas.getContext("2d");
	
	/* Creating Game Engine */
	var myGame = new GameEngine(ctxt);
	myGame.init();
	/* Handling buttons */
	$(document).keydown( function(e) { myGame.handleKey(e); } );
	
	/* Animating Game */
	myGame.loop();

	socket.on('move', function (data) {
		var P1 = JSON.parse(data.P1);
		var P2 = JSON.parse(data.P2);
		if ( !jQuery.isEmptyObject(P1) )
			myGame.P1 = P1;
		if ( !jQuery.isEmptyObject(P2) )
			myGame.P2 = P2;
	});
});

function GameEngine(ctxt) {
	
	this.ctxt = ctxt;
	this.play = true;
	
	this.plato = {mx: 400, my: 300};
	this.opts = {players: 2}
	this.P1 = {x:0, y:0, width: 20, height: this.plato.my/3};
	this.P2 = {x:this.plato.mx-20, y:0, width: 20, height: this.plato.my/3};
	this.Ball = {x:60, y:40, circ: 15, vx: parseInt(Math.random()*10) , vy: parseInt(Math.random()*10), ax: Math.random()*10-5, ay: Math.random()*10-5 }
	
	this.indx = 0;
	
	this.init = function() {
		$("#game").attr("width",this.plato.mx+"px");
		$("#game").attr("height",this.plato.my+"px");
	}
	
	this.handleKey = function(e) {		
		/* map keys to constants */
		var Keys = {UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, Z: 90, S: 83, Q: 81, D: 68, SP: 32}
		e.preventDefault();
		/* Handling player buttons */
		switch( e.which ) {
			/* UP = Player 1 up */
			case Keys.UP :
				if ( this.P1.y > 0 )
					this.P1.y -= 10;
				socket.emit('moved', { pos: JSON.stringify(this.P1), pid:1 });
				break;
			/* DOWN = Player 1 down */
			case Keys.DOWN :
				if ( this.P1.y+this.P1.height < this.plato.my )
				this.P1.y += 10;
				socket.emit('moved', { pos: JSON.stringify(this.P1), pid:1 });
				break;
			/* Z = Player 2 up */
			case Keys.Z :
				if ( this.opts.players > 1)
				{
					if ( this.P2.y > 0 )
						this.P2.y -= 10;
				}
				socket.emit('moved', { pos: JSON.stringify(this.P2), pid:2 });
				break;
			/* S = Player 2 up */
			case Keys.S :
				if ( this.opts.players > 1)
				{
					if ( this.P2.y+this.P2.height < this.plato.my )
						this.P2.y += 10;
				}
				socket.emit('moved', { pos: JSON.stringify(this.P2), pid:2 });
				break;
			/* SPACE = pausing game */
			case Keys.SP :
				if ( this.play )
					this.play = false;
				else
					this.play = true;
				break;
		}
		
	}
	
	this.loop = function() {
		//this.debug();
		
		/* Clearing canvas */
		this.ctxt.clearRect(0, 0, this.plato.mx, this.plato.my);
		this.ctxt.width = this.ctxt.width;
		this.ctxt.font = "10pt Verdana";
		
		/* Drawing the Ball */
		this.ctxt.fillStyle = "rgba(255, 0, 0, 1)";
		this.ctxt.beginPath();
		this.ctxt.arc(this.Ball.x,this.Ball.y,this.Ball.circ,0,Math.PI*2,true);
		this.ctxt.closePath();
		this.ctxt.fill();
		
		/* Drawing players */
		this.ctxt.fillStyle = "rgba(0,0,0,.5)";
		this.ctxt.fillRect(this.P1.x,this.P1.y,this.P1.width,this.P1.height);
		
		this.ctxt.fillStyle = "rgba(0,0,0,.5)";
		this.ctxt.fillRect(this.P2.x,this.P2.y,this.P2.width,this.P2.height);
		
		if (this.play)
		{
			/* Applying physics and IA */
			this.physics();
			if ( this.opts.players < 2 )
				this.ia();
			
			/* Drawing text */
			this.ctxt.fillText("Playing", parseInt(this.plato.mx/2)-5, 10);
			
		}
		else
		{
			/* Drawing text */
			this.ctxt.fillText("Paused", parseInt(this.plato.mx/2)-5, 10);
		}
		
		setTimeout( function(obj){obj.loop();}, 30, this );
		
	}
	
	this.physics = function() {
	    /* Ball out of board in max X */
		if ( this.Ball.x+this.Ball.circ > this.plato.mx )
		{
			this.Ball.x = this.plato.mx-this.Ball.circ;
			this.Ball.vx *= -1;
			this.play = false;
		}
		/* Ball out of board in min X */
		else if ( this.Ball.x-this.Ball.circ < 0 )
		{
			this.Ball.x = this.Ball.circ;
			this.Ball.vx *= -1;
			this.play = false;
		}	
		/* Ball out of board in max Y */
		if ( this.Ball.y+this.Ball.circ > this.plato.my )
		{
			this.Ball.y = this.plato.my-this.Ball.circ;
			this.Ball.vy *= -1;
		}
		/* Ball out of board in min Y */
		else if ( this.Ball.y-this.Ball.circ < 0 )
		{
			this.Ball.y = this.Ball.circ;
			this.Ball.vy *= -1;
		}
		/* Ball touching player 1 in X */
		if ( this.Ball.x-this.Ball.circ-this.Ball.ax > this.P1.x && this.Ball.x-this.Ball.circ-this.Ball.ax < this.P1.x+this.P1.width)
			/* Ball touching player 1, we change direction */
			if ( this.Ball.y >= this.P1.y && this.Ball.y <= this.P1.y+this.P1.height)
			{
				this.Ball.x = this.P1.x+this.P1.width+this.Ball.circ;
				this.Ball.vx *= -1;
			}
		/* Ball touching player 2 in X */		
		if ( this.Ball.x+this.Ball.circ+this.Ball.ax > this.P2.x && this.Ball.x+this.Ball.circ+this.Ball.ay < this.P2.x+this.P2.width)
			/* Ball touching player 2, we change direction */
			if ( this.Ball.y >= this.P2.y && this.Ball.y <= this.P2.y+this.P2.height)
			{
				this.Ball.x = this.P2.x-this.Ball.circ;
				this.Ball.vx *= -1;
			}
		/* Moving ball */
		this.Ball.x += parseInt(this.Ball.vx);
		this.Ball.y += parseInt(this.Ball.vy);
		
		/* Applying acceleration */
		if ( this.Ball.vx > -5 && this.Ball.vx < 5 )
			this.Ball.vx += this.Ball.ax;
		if ( this.Ball.vy > -5 && this.Ball.vy < 5 )
			this.Ball.vy += this.Ball.ay;
	}
	
	this.ia = function() {
		/* Player 2 is below ball, we move it up */
		if ( this.Ball.y < this.P2.y)
			this.P2.y -= 10;
		/* Player 2 is over ball, we move it down */
		else if ( this.Ball.y > this.P2.y+this.P2.height)
			this.P2.y += 10;
	}
	
	/* For debugging purpose */
	this.debug = function() {
		$("#debug").css("display","");
		$("#debug").html("P2.y : "+this.P2.y+"\n Ball.y : "+this.Ball.y);
	}
}