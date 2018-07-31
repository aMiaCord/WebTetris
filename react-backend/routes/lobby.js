var express = require('express');
var router = express.Router();
const GameManager = require('./GameManager');

var roomnumber=1;
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
router.get('/create',function(req, res, next){
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	
	let game = new GameManager(ip,req.param('nickname'),roomnumber,req.param('name'));
	games[game.room]=game;
	ips[ip] = game.room;

	roomnumber+=1;
	console.log("!!!");	
	io.emit("LOBBY_LIST",getRoomList());
	var pl1 = game.nickname[0] + "(" + game.player[0] + ")";
	var pl2 = game.nickname[1] + "(" + game.player[1] + ")";
	for( var i=0;i<sessions[ip].length;i++){
		io.to(sessions[ip][i]).emit("WHO_IN_ROOM",[pl1,pl2]);
	}
	console.log("~!~!~!");
	res.json({result:[pl1,pl2]});
});

router.get('/list',function(req, res, next){
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	var checkip;
	Model.findOne({"ip":ip},function(err,result){
				if(err){
					console.log("err");
					return;
				}
				if(result == null){
					var newPlayer = new Model({
								ip:ip,
								score:0,
								highscore:0,
								win:0,
								lose:0,
								nickName:"재야의 고수"
							});
					newPlayer.save(function(err){
						if(err)
						console.log(err);
					});
				}
	});
	res.json(getRoomList());
});

router.get('/start',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	var game = games[req.param('num')];
	game.player[1] = ip;
	game.nickname[1] = req.param('nickname');
	ips[ip] = game.room;
	io.emit("LOBBY_LIST",getRoomList());
	for(var i=0;i<sessions[ip].length;i++){
		var pl1 = game.nickname[0] + "("+ game.player[0] + ")";
		var pl2 = game.nickname[1] + "(" + game.player[1] + ")";
		io.to(sessions[ip][i]).emit("WHO_IN_ROOM",[pl1,pl2]);
	}
	var ip2session = sessions[game.player[0]];
	for(var i=0;i<ip2session.length;i++){
		var pl1 = game.nickname[0] + "(" + game.player[0] + ")";
		var pl2 = game.nickname[1] + "(" + game.player[1] + ")";
		io.to(ip2session[i]).emit("WHO_IN_ROOM",[pl1,pl2]);
	}
	res.json({result:[game.player[0],game.player[1]]});
});
router.get('/info',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	var ret;
	Model.findOne({"ip":ip},function(err,result){
		if(err){}
		else{
			if(result == null) {
				res.json({
						ip:ip,
						many:0,
						max:0,
						win:0,
						lose:0,
						nickname:"재야의 고수"
						});
			return;
			}
			ret ={
					ip:result["ip"],
					nickname:result["nickName"],
					win:result["win"],
					lose:result["lose"],
					many:result["score"],
					max:result["highscore"]
				};
			res.json(ret);
		}
	});
});
router.get('/watch',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	var room_number = req.param('num')
	var game = games[room_number];
	console.log("1");
	watchers[ip] = room_number;
	console.log("1.5");
	var crowd_session = sessions[ip];
	console.log("2");
	if(crowd_session == undefined)
		res.json({});
	for(var i=0;i<crowd_session.length;i++){
		console.log("3");
		var pl1 = game.nickname[0] + "(" + game.player[0] + ")";
		var pl2 = game.nickname[1] + "(" + game.player[1] + ")";
		io.to(crowd_session[i]).emit("WHO_IN_ROOM",[pl1,pl2]);
	}
	res.json({});
});
router.get('/change',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	var ret;
	Model.findOne({"ip":ip},function(err,result){
			if(err){
				console.log(err);
			}
			else{
				Model.update({"ip":ip},
							{
								nickName:req.param('name')
							},
							function(err,raw){
								console.log(raw);
								if(err)
									 console.log(err);
								else{
									if(!raw) return;
									console.log(raw);
									ret = {
										ip:result["ip"],
										nickname:req.param('name'),
										win:result["win"],
										lose:result["lose"],
										many:result["score"],
										max:result["highscore"]
									};
									res.json(ret);
								}
							});
			}
		});

});

module.exports = router;
