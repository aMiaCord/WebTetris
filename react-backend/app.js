var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
Model = require('./mongo')
var socket = require('socket.io');
var app = express();

server = app.listen(8000,function(){
			console.log('server is running on port 8000');
		});
io = socket(server);
colors = ["state-yellow","state-skyblue","state-green","state-red","state-orange","state-blue","state-purple"];
games = {};
ips = {};
watchers = {};
sessions = {};
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
function emitWhoInRoom(players,game,state){
	for(var i=0;i<players.length;i++){
		if(sessions[players[i]] == undefined)
			continue;
		for(var j=0;j<sessions[players[i]].length;j++){
			if((state == 0) || (state==i) ) //exit game
				io.to(sessions[players[i]][j]).emit("WHO_IN_ROOM",[]);
			else if(state == 1)
			{//player 1 out
				var pl1 = game.nickname[0] + "(" + game.player[0] + ")";
				io.to(sessions[players[i]][j]).emit("WHO_IN_ROOM",[pl1,"null"]);
			}
			else if(state == 2) //crowd exit
			{
				var pl1 = game.nickname[0] + "(" + game.player[0] + ")";
				var pl2 = game.nickname[1] + "(" + game.player[1] + ")";
				io.to(sessions[players[i]][j]).emit("WHO_IN_ROOM",[pl1,pl2]);
			}
		}
	}
}




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tetrisRouter = require('./routes/tetris');
var stateRouter = require('./routes/state');
var lobbyRouter = require('./routes/lobby');

const GameManager = require('./routes/GameManager');
var roomnumber = 1;

function getRoomList(){
	var roomlist=[];
	for(var game in games){
			roomlist.push({roomNumber:games[game].room,
			roomName:games[game].roomName,
			player1:games[game].player[0],
			player2:games[game].player[1],
			nickname1:games[game].nickname[0],
			nickname2:games[game].nickname[1]
		});
	}
	return roomlist;
}



io.on('connection',(socket)=>{
			var ip = socket.handshake.address.slice(7);
			if(!(ip in sessions))
				sessions[ip] = [];
			sessions[ip].push(socket.id);
			var interval;
			socket.on("ROOM_CREATE",function(){
				console.log(socket.id);
				let game = new GameManager(ip,roomnumber);
				games[game.room]=game;
				ips[ip] = game.room;
				roomnumber+=1;
				socket.emit("LOBBY_LIST","true");
			});
			socket.on("GAME_START",function(empty){
					var game = games[ips[ip]];
					console.log(sessions[ip]);
					if(!game)
						return;
					var ip1 = game.player[0];
					var ip2 = game.player[1];
					for(var i=0;i<sessions[ip1].length;i++){
						io.to(sessions[ip1][i]).emit("GAME_STARTED","true");
					}
					if(ip2 !="null"){
						for(var i=0;i<sessions[ip2].length;i++){
							io.to(sessions[ip2][i]).emit("GAME_STARTED","true");
						}
					}
					var countdown=["3","2","1","START"," "];
					var countdown_index = 0;
					interval = setInterval(function(){
							//show countdown
							if(game.started == "false"){
								var ip1 = game.player[0];
								var ip2 = game.player[1];
								var ip3s = [];
								for(var key in watchers){
									if(watchers[key] == game.room)
										ip3s.push(key);
								}
								if(sessions[ip1]!=undefined){
									for(var i=0;i<sessions[ip1].length;i++){
										io.to(sessions[ip1][i]).emit("COUNTDOWN",countdown[countdown_index]);
									}
								}
								if(sessions[ip2]!=undefined){
									for(var i=0;i<sessions[ip2].length;i++){
										io.to(sessions[ip2][i]).emit("COUNTDOWN",countdown[countdown_index]);
									}
								}
								for(var index=0;index<ip3s.length;index++){
									for(var i=0;i<sessions[ip3s[index]].length;i++){
										io.to(sessions[ip3s[index]][i]).emit("COUNTDOWN",countdown[countdown_index]);
									}
								}
								countdown_index += 1;
								if(countdown_index == 5)
									game.gameStart();
							}
							//game start
							else{
								//bomb room
								if(game.player[0] =="null")
									clearInterval(interval);
								//moveDown
								ip2 = game.player[1];
								game.updateDown(game);
								for(var i=0;i<sessions[ip].length;i++){
									emitState(game,0,ip,i);
								}
								console.log(ip2)
								if(ip2!="null"){
									for(var i=0;i<sessions[ip2].length;i++){
										emitState(game,1,ip2,i);
									}
								}
								var ip3s = [];
								for(var key in watchers){
									if(watchers[key] == game.room)
										ip3s.push(key);
								}
								for(var kk=0;kk<ip3s.length;kk++){
									for(var i=0;i<sessions[ip3s[kk]].length;i++)
										emitState(game,0,ip3s[kk],i)
								}
								if(game.die[0]=="true" || game.die[1]=="true" || game.overFlag){
									io.to(sessions[ip][0]).emit("GAME_END","true");
									console.log("~!@!~@");
									clearInterval(interval);
									console.log("not clear");
								}
							}
					},1000);
			});
			socket.on("GAME_QUIT",function(empty){
						if(ips[ip] != undefined)
							var game = games[ips[ip]];
						else
							var game = games[watchers[ip]];
						if(game == undefined)
							return;
						if(game.player[0] == ip){
							/*for(var i=0;i<sessions[ip].length;i++){
								io.to(sessions[ip][i]).emit("WHO_IN_ROOM",[]);
							}
							var session2 = sessions[game.player[1]];
							if(session2 != undefined){
								for(var i=0;i<session2.length;i++){
									io.to(session2[i]).emit("WHO_IN_ROOM",[]);
								}
								delete ips[game.player[1]];
							}*/
							console.log("error1");
							var player_list = [game.player[0],game.player[1]];
							emitWhoInRoom(player_list,game,0);
							var ip3s = []
							for(var key in watchers){
								if(watchers[key] == game.room)
									ip3s.push(key);
							}
							for(var kk=0;kk<ip3s.length;kk++){
								for(var i=0;i<sessions[ip3s[kk]].length;i++){
									io.to(sessions[ip3s[kk]][i]).emit("WHO_IN_ROOM",[]);
								}
								delete watchers[ip3s[kk]];
							}
							delete games[ips[ip]];
							delete ips[game.player[1]];
							for(var k=0;k<game.crowd.length;k++)
								delete ips[game.crowd[k]];
							delete ips[ip];
							game.player[0] = "null";
							game.player[1] = "null";
							clearInterval(interval);
							console.log("not clear");
						}
						else if(game.player[1] == ip){
							/*for(var i=0;i<sessions[ip].length;i++){
								io.to(sessions[ip][i]).emit("WHO_IN_ROOM",[]);
							}
							var session2 = sessions[game.player[0]];
							for(var i=0;i<session2.length;i++){
								io.to(session2[i]).emit("WHO_IN_ROOM",[game.player[0],"null"]);
							}*/

							var player_list = [game.player[0],game.player[1]]
							emitWhoInRoom(player_list,game,1);
							game.player[1] = "null";
							delete ips[ip];
						}
						else if(ip in watchers){
							for(var i=0;i<sessions[ip].length;i++)
								io.to(sessions[ip][i]).emit("WHO_IN_ROOM",[]);
							delete watchers[ip];
						}
						io.emit("LOBBY_LIST",getRoomList());
					});
			socket.on('disconnect',function(){
						if(sessions[ip].includes(socket.id)){
							sessions[ip].splice(sessions[ip].indexOf(socket.id),1);
							//ip session is empty, what happen?
						}
						else{
							console.log("not found session id");
						}
					})
		})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/kk', indexRouter);
app.use('/users', usersRouter);
app.use('/tetris',tetrisRouter);
app.use('/state',stateRouter);
app.use('/lobby',lobbyRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
