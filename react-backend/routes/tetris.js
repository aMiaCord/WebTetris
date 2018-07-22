var express = require('express');
var router = express.Router();


var roomnumber = 0;
//var games = new Array();
//var game_manager = require('./GameManager');
const GameManager = require('./GameManager');
var Games = require('./Games');
var blockstate = new Array(7);
for(var i=0;i<7;i++){
	blockstate[i]=new Array(4);
	for(var j=0;j<4;j++){
		switch(i*10+j){
			case 0:
				blockstate[i][j] = [[0,0],[0,1],[1,0],[1,1]];
				break;
			case 1:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[-1,1]];
				break;
			case 2:
				blockstate[i][j] = [[0,0],[0,-1],[-1,0],[-1,-1]];
				break;
			case 3:
				blockstate[i][j] = [[0,0],[0,-1],[1,0],[1,-1]];
				break;
			case 10:
				blockstate[i][j] = [[0,0],[1,0],[2,0],[-1,0]];
				break;
			case 11:
				blockstate[i][j] = [[0,0],[0,1],[0,2],[0,-1]];
				break;
			case 12:
				blockstate[i][j] = [[0,0],[1,0],[2,0],[-1,0]];
				break;
			case 13:
				blockstate[i][j] = [[0,0],[0,1],[0,2],[0,-1]];
				break;
			case 20:
				blockstate[i][j] = [[0,0],[1,0],[0,1],[1,-1]];
				break;
			case 21:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[1,1]];
				break;
			case 22:
				blockstate[i][j] = [[0,0],[1,0],[0,1],[1,-1]];
				break;
			case 23:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[1,1]];
				break;
			case 30:
				blockstate[i][j] = [[0,0],[-1,0],[-1,-1],[0,1]];
				break;
			case 31:
				blockstate[i][j] = [[0,0],[-1,0],[0,-1],[1,-1]];
				break;
			case 32:
				blockstate[i][j] = [[0,0],[-1,0],[-1,-1],[0,1]];
				break;
			case 33:
				blockstate[i][j] = [[0,0],[-1,0],[0,-1],[1,-1]];
				break;
			case 40:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[-1,1]];
				break;
			case 41:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[-1,-1]];
				break;
			case 42:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[1,-1]];
				break;
			case 43:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[1,1]];
				break;
			case 50:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[-1,-1]];
				break;
			case 51:
				blockstate[i][j] = [[0,0],[1,0],[-1,0],[1,-1]];
				break;
			case 52:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[1,1]];
				break;
			case 53:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[-1,1]];
				break;
			case 60:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[0,-1]];
				break;
			case 61:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[0,-1]];
				break;
			case 62:
				blockstate[i][j] = [[0,0],[1,0],[0,1],[0,-1]];
				break;
			case 63:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[0,1]];
				break;
		}
	}
}


/*function updateDown(game){
	var block = game.block;
	setInterval(function(){
		if(!canMove(1,0,block.rotation)){
			next(game);
			return;
		}
		
		for(var k=0;k<4;k++){
			var temp= blockstate[block.blocktype][block.rotation][k];
			game.board[block.x+temp[0]].blocks[block.y+temp[1]].value = "b0";
		}
		game.block.x+=1;
		for(var k=0;k<4;k++){
			var temp=blockstate[block.blocktype][block.rotation][k];
			game.board[block.x+temp[0]].blocks[block.y+temp[1]].value = "b1";	
		}
		},1000);
}
var nextblock = new Array(5);
for(var i=0;i<6;i++){
	nextblock[i] = Math.floor(Math.random()*7);
}
function next(game){
	var block = game.block;
	for(var k=0;k<4;k++){
		var temp=game.board[block.blocktype][block.rotation][k];
		game.board[block.x+temp[0]].blocks[block.y+temp[1]].value = "b2";
	}
	game.block.x=1;
	game.block.y=5;
	game.block.blocktype = nextblock[0];
	game.block.ratation = 0;
	game.nextblock.shift();
	game.nextblock.push(Math.floor(Math.random()*7));
	lineclear(game);
	getShadow(game);
}

function lineclear(game){
	for(var line=1;line<=20;line++){
		var row=1;
		for(;row<=10;row++){
			if(game.board[line].blocks[row].value!="b2")
				break;
		}
		if(row == 11){
			game.board.splice(line,1);
			rowdata=[];
			rowdata.push({value:"b2"});
			for(var k=0;k<10;k++)
				rowdata.push({value:"b0"});
			rowdata.push({value:"b2"});
			game.board.unshift({height:0,blocks:{}});
			game.board[0].blocks = rowdata;
		}
	}
}



//var shadow = [null,null,null,null];
//getShadow();
function getShadow(game) {
	if(shadow[0]!=null){
		for(var i=0;i<4;i++){
			if(jsonstate[shadow[i][0]].blocks[shadow[i][1]].value=="b3")
				jsonstate[shadow[i][0]].blocks[shadow[i][1]].value="b0";
		}
	}
	var i=0;
	var temp = blockstate[block.blocktype][block.rotation];
	for(i=1;i<20;i++)
	{
		for(var j=0;j<4;j++)
			if(jsonstate[block.x+i+temp[j][0]].blocks[block.y+temp[j][1]].value == "b2")
				break;
		if(j!=4)
			break;
	}
	i-=1;
	for(var j=0;j<4;j++)
		if(jsonstate[block.x+i+temp[j][0]].blocks[block.y+temp[j][1]].value == "b0"){
			shadow[j]=[block.x+i+temp[j][0],block.y+temp[j][1]];
			jsonstate[block.x+i+temp[j][0]].blocks[block.y+temp[j][1]].value = "b3";
		}
		
}
function lineclear(){
	for(var line=1;line<=20;line++){
		var row=1;
		for(;row<=10;row++){
			if(jsonstate[line].blocks[row].value!="b2")
				break;
		}
		if(row == 11){
			jsonstate.splice(line,1);
			rowdata=[];
			rowdata.push({value:"b2"});
			for(var k=0;k<10;k++)
				rowdata.push({value:"b0"});
			rowdata.push({value:"b2"});
			jsonstate.unshift({height:0,blocks:{}});
			jsonstate[0].blocks = rowdata;
		}
	}
}*/



function moveKeyDown(key,game){
	if(key == undefined)
		return;
	var x_mov = 0;
	var y_mov = 0;
	var rotate = game.block.rotation;



	switch(key){
		case "37":
			y_mov-=1;
			break;
		case "38":
			rotate = (game.block.rotation+1)%4
			break;
		case "39":
			y_mov+=1;
			break;
		case "40":
			x_mov+=1;
			break;
		case "32":
			for(var i=0;i<20;i++)
			{
				moveKeyDown("40",game);
			}
			game.next();
			return;
			break;
	}
	if(game.canMove(x_mov,y_mov,rotate)){
		for(var k=0;k<4;k++){
			var temp= game.blockstate[game.block.blocktype][game.block.rotation][k];
			game.board[game.block.x+temp[0]].blocks[game.block.y+temp[1]] = {value : "b0",color:"a"};
		}
		game.block.x += x_mov;
		game.block.y += y_mov;
		for(var k=0;k<4;k++){
			game.block.rotation  = rotate;
			var temp=game.blockstate[game.block.blocktype][game.block.rotation][k];
			game.board[game.block.x+temp[0]].blocks[game.block.y+temp[1]] = {value :"b1",color:game.block.color};
		}
		game.getShadow();
	}
}


/*function canMove(x_mov,y_mov,rotate){
	for(var k=0;k<4;k++){
		var temp_y = block.y + y_mov
						+ blockstate[block.blocktype][rotate][k][1];
		var temp_x = block.x + x_mov
						+ blockstate[block.blocktype][rotate][k][0];
		if(jsonstate[temp_x].blocks[temp_y].value=="b2")
			return false;
	}
	return true;
}*/


/* GET home page. */
router.get('/', function(req, res, next) {
	// 37 =left, 38=up, 39=right, 40=down, 32 = space
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	moveKeyDown(req.param('key'),Games.games[0]);
	console.log(ip);
	res.json(Games.games[0].board);
});

router.get('/start',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	var board = [];
	for(var i=0;i<22;i++){
	    board.push({height:i+1,blocks:{}});
		var rowtemp=[];
		if(i!=21){
			rowtemp.push({value:"b2",color:"a"});
			for(var j=0;j<10;j++){
				rowtemp.push({value:"b0",color:"a"});
			}
			rowtemp.push({value:"b2",color:"a"});
		}
		else{
			for(var j=0;j<12;j++){
				rowtemp.push({value:"b2",color:"a"});
			}
		}
		board[i].blocks=rowtemp;
	}
	let game = new GameManager(ip,board,roomnumber);
	setInterval(function(){game.updateDown(game)},1000);
	Games.games.push(game);
	roomnumber+=1;
});


module.exports = router;

