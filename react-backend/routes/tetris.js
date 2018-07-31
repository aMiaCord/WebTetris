var express = require('express');
var router = express.Router();


var roomnumber = 1;
//var games = new Array();
//var game_manager = require('./GameManager');
const GameManager = require('./GameManager');

function parseBoard(board)
{
	var parsedBoard = [];
	for(var i=3;i<23;i++) {
		var parsedLine = [];
		for(var j=1;j<=10;j++)
			parsedLine.push(board[i][j]);
		parsedBoard.push(parsedLine);
	}
	return parsedBoard;
}
function emitState(game,player_num,ip,index){
	io.to(sessions[ip][index]).emit("GAME_STATE",{
		board1:parseBoard(game.board[0]),
		board2:parseBoard(game.board[1]),
		player:player_num,
		next1:game.parse2json(game.nextblock[0]),
		next2:game.parse2json(game.nextblock[1]),
		score1:game.score[0],
		score2:game.score[1],
		die1:game.die[0],
		die2:game.die[1],
		started:game.started,
		combo1:game.combo[0],
		combo2:game.combo[1],
		hold1:game.parse2json([game.holdBlock[0]])[0],
		hold2:game.parse2json([game.holdBlock[1]])[0],
		roomName:game.roomName
	});
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
			rotate = (game.block[playerNum].rotation+3)%4;	
			break;
		case "39":
			y_mov+=1;
			break;
		case "40":
			x_mov+=1;
			break;
		case "32":
			for(var i=0;i<20;i++)
			while(game.canMove(1,0,rotate,playerNum))
				moveKeyDown("40",game,playerNum);
			game.nextLoad(playerNum);
			return;
			break;
		case "67":
			game.hold(playerNum);
	}
	if(rotate != game.block[playerNum].rotation){
		if(!game.canMove(x_mov,y_mov,rotate,playerNum)){
			var nowBlock = game.block[playerNum];
			if(nowBlock.blocktype == 1){
				if(nowBlock.y==1)
					y_mov+=1;
				else if(nowBlock.y==10)
					y_mov-=2;
				else if(nowBlock.y==9)
					y_mov-=1;
				else if(game.board[playerNum][nowBlock.x][nowBlock.y-1].value=="s-static")
					y_mov+=1;
				else if(game.board[playerNum][nowBlock.x][nowBlock.y-1].value=="s-static")
					y_mov-=2;
				else if(game.board[playerNum][nowBlock.x][nowBlock.y-2].value=="s-static")
					y_mov-=1;
				else if(game.board[playerNum][nowBlock.x+1][nowBlock.y].value=="s-static")
					x_mov+=2;
				else if(game.board[playerNum][nowBlock.x+2][nowBlock.y].value=="s-static")
					x_mov+=1;
			}
			else{
				var state1 = game.board[playerNum][nowBlock.x][nowBlock.y-1].value=="s-static";
				var state2 = game.board[playerNum][nowBlock.x][nowBlock.y+1].value=="s-static";
				if(state1 && !state2){
					y_mov+=1;
				}
				else if(state1){
					x_mov-=1;
				}
				else if(state2){
					y_mov-=1;
				}
				else if(game.board[playerNum][nowBlock.x+1][nowBlock.y].value=="s-static"){
					x_mov-=1;
				}
			}
		}
	}
	if(game.canMove(x_mov,y_mov,rotate,playerNum)){
		game.changeState(playerNum,"s-empty","aa");
		game.block[playerNum].x += x_mov;
		game.block[playerNum].y += y_mov;
		game.block[playerNum].rotation = rotate;
		game.changeState(playerNum,"s-now",game.block[playerNum].color);
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
	var nowGame;
	if(ip in ips)
		nowGame = games[ips[ip]];
	else
		nowGame = games[watchers[ip]];
	var playerNum = 0;
	var ip3s = [];
	for(var key in watchers){
		if(nowGame.room == watchers[key])
			ip3s.push(key);
	}
	if(nowGame.overFlag){}
	//player0 key event
	else if(ip == nowGame.player[0]){
			playerNum = 0;
			if(nowGame.started == "true")
				moveKeyDown(req.param('key'),nowGame,0);
			for(var i=0;i<sessions[ip].length;i++){
				emitState(nowGame,0,ip,i);
			}
			for(var len=0;len<ip3s.length;len++){
				for(var i=0;i<sessions[ip3s[len]].length;i++){
					emitState(nowGame,0,ip3s[len],i);
				}
			}
	}
	//player1 key event
	else if(ip == nowGame.player[1]){
			playerNum = 1;
			if(nowGame.started == "true")
				moveKeyDown(req.param('key'),nowGame,1);
			for(var i=0;i<sessions[ip].length;i++){
				emitState(nowGame,1,ip,i);
			}

			for(var len=0;len<ip3s.length;len++){
				for(var i=0;i<sessions[ip3s[len]].length;i++){
					emitState(nowGame,0,ip3s[len],i);
				}
			}
	}
	
	res.json({board1:nowGame.board[0],
				board2:nowGame.board[1],
				player:playerNum,
				next1:nowGame.parse2json(nowGame.nextblock[0]),
				next2:nowGame.parse2json(nowGame.nextblock[1]),
				score1:nowGame.score[0],
				score2:nowGame.score[1],
				die1:nowGame.die[0],
				die2:nowGame.die[1],
				hold1:nowGame.parse2json([nowGame.holdBlock[0]])[0],
				hold2:nowGame.parse2json([nowGame.holdBlock[1]])[0],
				roomName:nowGame.roomName});
});

router.get('/game_over', function(req, res, next){
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	if(!(ips[ip] in games))
	{
		res.json({});
		return;
	}
	var game = games[ips[ip]];
	if(game.overFlag)
	{
		res.json({});
		return;
	}
	var ip1 = game.player[0];
	var ip2 = game.player[1];
	console.log(ip1);
	console.log(ip2);
	game.overFlag = true;
	console.log("1");
	var wins = [0,0];
	if(game.die[0]=="true")
		wins[1]+=1;
	else
		wins[0]+=1;
	var player1={};
	console.log("2");
	Model.findOne({"ip":ip1},function(err,result){
		console.log(err);
		if(err == null){
			if(result != null ){
				player1["_id"] = result["_id"];
				player1["score"] = result["score"];
				player1["highscore"] = result["highscore"];
				player1["win"] = result["win"];
				player1["lose"] = result["lose"];
	
				Model.update({"_id":player1["_id"]},
							{
								score:player1["score"]+game.score[0],
								highscore:Math.max(player1["highscore"],game.score[0]),
								win:player1["win"]+wins[0],
								lose:player1["lose"]+wins[1]
							},
							function(err,raw){
								if(err != null)
									console.log(err);
							});
			}
		}
	});
	console.log("3");
	if(ip2!="null"){
		var player2={};
		Model.findOne({"ip":ip2},function(err,result) {
				if(err) return;
				if(!result)return;
				player2["_id"]=result["_id"];
				player2["score"] = result["score"];
				player2["highscore"] = result["highscore"];
				player2["win"] = result["win"];
				player2["lose"]= result["lose"];
	
				Model.update({"_id":player2["_id"]},
						{
							score:player2["score"]+game.score[1],
							highscore:Math.max(player2["highscore"], game.score[1]),
							win:player2["win"]+wins[1],
							lose:player2["lose"]+wins[0]
						},
						function(err,raw) {
								if(err) console.log(err);
							});
	
		});
	}
	console.log("4");
	res.json({});
});

module.exports = router;

