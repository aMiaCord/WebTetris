var express = require('express');
var router = express.Router();
const GameManager = require('./GameManager');
var Games = require('./Games');

var roomnumber=0;
router.get('/create',function(req, res, next){
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	let game = new GameManager(ip,roomnumber);
	Games.games.push(game);
	Games.ips[ip] = game.room;
	roomnumber+=1;
	res.json({result:"ok"});
});
router.get('/list',function(req, res, next){
	var roomlist = [];
	Games.games.forEach(function(game){
			roomlist.push({roomNumber:game.room,
							player1:game.player[0],
							player2:game.player[1]});
	});
	res.json(roomlist);
});

router.get('/start',function(req,res,next){
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	Games.games.forEach(function(game){
		if(game.room == req.param('num')){
			game.player[1] = ip;
			Games.ips[ip] = game.room;
			res.json({result:'ok'});
		}	
	});
});

module.exports = router;
