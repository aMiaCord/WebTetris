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






function moveKeyDown(key,game,playerNum){
	if(key == undefined)
		return;
	var x_mov = 0;
	var y_mov = 0;
	var rotate = game.block[playerNum].rotation;


	switch(key){
		case "37":
			y_mov-=1;
			break;
		case "38":
			rotate = (game.block[playerNum].rotation+1)%4
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
				moveKeyDown("40",game,playerNum);
			}
			game.next(playerNum);
			return;
			break;
	}
	if(game.canMove(x_mov,y_mov,rotate,playerNum)){
		for(var k=0;k<4;k++){
			var temp= game.blockstate[game.block[playerNum].blocktype][game.block[playerNum].rotation][k];
			game.board[playerNum][game.block[playerNum].x+temp[0]].blocks[game.block[playerNum].y+temp[1]] = {value : "b0",color:"a"};
		}
		game.block[playerNum].x += x_mov;
		game.block[playerNum].y += y_mov;
		for(var k=0;k<4;k++){
			game.block[playerNum].rotation  = rotate;
			var temp=game.blockstate[game.block[playerNum].blocktype][game.block[playerNum].rotation][k];
			game.board[playerNum][game.block[playerNum].x+temp[0]].blocks[game.block[playerNum].y+temp[1]] = {value :"b1",color:game.block[playerNum].color};
		}
		game.getShadow(playerNum);
	}
}




/* GET home page. */
router.get('/', function(req, res, next) {
	// 37 =left, 38=up, 39=right, 40=down, 32 = space
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	var nowGame = Games.games[Games.ips[ip]]
	var playerNum = 0;
	//player0 key event
	if(ip == nowGame.player[0]){
			playerNum = 0;
			moveKeyDown(req.param('key'),nowGame,0);
	}
	//player1 key event
	else if(ip == nowGame.player[1]){
			playerNum = 1;
			moveKeyDown(req.param('key'),nowGame,1);
	}
	//make next view
	var nextblock1 = nowGame.nextblock[0];
	var nextblock2 = nowGame.nextblock[1];
	var next1 = [];
	var next2 = [];
	//fill blank
	for(var i = 0;i<5;i++){
		var next1_temp = [];
		var next2_temp = [];
		for(var col = 0;col<4;col++){
			next1_temp.push({height:'00',blocks:{}});
			next2_temp.push({height:'00',blocks:{}});
			var temp_row1 = [];
			var temp_row2 = [];
			for(var row = 0;row<4;row++){
				temp_row1.push({value:"b0",color:"a"});
				temp_row2.push({value:"b0",color:"a"});
			}
			next1_temp[col].blocks=temp_row1;
			next2_temp[col].blocks=temp_row2;
		}
		next1.push(next1_temp);
		next2.push(next2_temp);
	}
	var colors = ["state-yellow","state-skyblue","state-green","state-red","state-orange","state-blue","state-purple"];
	for(var i=0;i<5;i++){
		var nowBlock1 = blockstate[nextblock1[i]][0];
		var nowBlock2 = blockstate[nextblock2[i]][0];
		for(var j=0;j<4;j++){
			next1[i][nowBlock1[j][0]+1].blocks[nowBlock1[j][1]+1] = {value:'b1',color:colors[nextblock1[i]]};
			next2[i][nowBlock2[j][0]+1].blocks[nowBlock2[j][1]+1] = {value:'b1',color:colors[nextblock2[i]]};
		}
	}
	res.json({board1:nowGame.board[0],
				board2:nowGame.board[1],
				player:playerNum,
				next1:next1,
				next2:next2});
});

router.get('/start',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	if(ip in Games.ips){
		Games.games.forEach(function(game){
			if(game.room == Games.ips[ip]){
				if(game.player[0] == ip){
					res.json({isStart:"start"});
					setInterval(function(){game.updateDown(game);},1000);
				}
				else if(game.player[1] == ip){
					res.json({isStart:"ready"});
				}
				return;
			}
		});
	}
});


module.exports = router;

