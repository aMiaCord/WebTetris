var express = require('express');
var router = express.Router();


var roomnumber = 0;
//var games = new Array();
//var game_manager = require('./GameManager');
const GameManager = require('./GameManager');
var Games = require('./Games');
var jsonstate = [];
for(var i=0;i<22;i++){
	jsonstate.push({height:i+1,blocks:{}});
	var rowtemp=[];
	if(i!=21){
		for(var j=0;j<10;j++){
			rowtemp.push({value:"b0"});
		}
	}
	else{
		for(var j=0;j<10;j++){
			rowtemp.push({value:"b2"});
		}
	}
	jsonstate[i].blocks=rowtemp;
}
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
var block = {x:1,y:5,blocktype:0,rotation:0};
var isEnd = false;
setInterval(function(){
		if(isEnd){
			for(var k=0;k<4;k++){
				var temp=blockstate[block.blocktype][block.rotation][k];
				jsonstate[block.x+temp[0]].blocks[block.y+temp[1]].value = "b2";
			}
			next();
		}
		else{
			for(var k=0;k<4;k++){
				var temp= blockstate[block.blocktype][block.rotation][k];
				jsonstate[block.x+temp[0]].blocks[block.y+temp[1]].value = "b0";
			}
			block.x+=1;
			for(var k=0;k<4;k++){
				var temp=blockstate[block.blocktype][block.rotation][k];
				jsonstate[block.x+temp[0]].blocks[block.y+temp[1]].value = "b1";
				if(jsonstate[block.x+temp[0]+1].blocks[block.y+temp[1]].value=="b2"){
					isEnd=true;
				}
			}
		}
		},1000);

var nextblock = new Array(5);
for(var i=0;i<6;i++){
	nextblock[i] = Math.floor(Math.random()*7);
}
function next(){
	block.x=1;
	block.y=5;
	block.blocktype = nextblock[0];
	block.ratation = 0;
	nextblock.shift();
	nextblock.push(Math.floor(Math.random()*7));
	isEnd=false;
	lineclear();
}
function lineclear(){
	for(var line=1;line<=20;line++){
		var row=0;
		for(;row<10;row++){
			if(jsonstate[line].blocks[row].value!="b2")
				break;
		}
		if(row == 10){
			jsonstate.splice(line,1);
			rowdata=[];
			for(var k=0;k<10;k++)
				rowdata.push({value:"b0"});
			jsonstate.unshift({height:0,blocks:{}});
			jsonstate[0].blocks = rowdata;
		}
	}
}
function moveKeyDown(key){
	if(key == undefined)
		return;
	var x_mov = 0;
	var y_mov = 0;
	var rotate = block.rotation;




	switch(key){
		case "37":
			y_mov-=1;
			break;
		case "38":
			rotate = (block.rotation+1)%4
			break;
		case "39":
			y_mov+=1;
			break;
		case "40":
			x_mov+=1;
			break;
	}
	if(canMove(y_mov,rotate)){
		for(var k=0;k<4;k++){
			var temp= blockstate[block.blocktype][block.rotation][k];
			jsonstate[block.x+temp[0]].blocks[block.y+temp[1]].value = "b0";
		}
		console.log("before update");
		block.x += x_mov;
		block.y += y_mov;
		for(var k=0;k<4;k++){
			block.rotation  = rotate;
			var temp=blockstate[block.blocktype][block.rotation][k];
			jsonstate[block.x+temp[0]].blocks[block.y+temp[1]].value = "b1";
			if(jsonstate[block.x+temp[0]+1].blocks[block.y+temp[1]].value=="b2")			{
				isEnd=true;
			}
		}
		console.log("after update");
	}
}
function canMove(y_mov,rotate){
	for(var k=0;k<4;k++){
		var temp_y = block.y + y_mov
						+ blockstate[block.blocktype][rotate][k][1];
		if(temp_y>9 || temp_y<0)
			return false;
	}
	return true;
}
/* GET home page. */
router.get('/', function(req, res, next) {
	// 37 =left, 38=up, 39=right, 40=down, 32 = space
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	moveKeyDown(req.param('key'));
	console.log(ip);
	res.json(jsonstate);
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
			for(var j=0;j<10;j++){
				rowtemp.push({value:"b0"});
			}
		}
		else{
			for(var j=0;j<10;j++){
				rowtemp.push({value:"b2"});
			}
		}
		board[i].blocks=rowtemp;
	}
	let game = new GameManager(ip,board,roomnumber);
	Games.games.push(game);
	roomnumber+=1;
});


module.exports = router;

