var express = require('express');
var router = express.Router();
var Games = require("./Games");
/* GET home page. */
router.get('/', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress).split(",")[0];
	var tetris = require('./tetris');
	var resultStr = "not ok";
	console.log(Games.games);
	if(Games.games!=undefined){
		Games.games.forEach(function(game){
				console.log("ok1");
				if(game.player1 == ip){
					resultStr = "ok";
				}
				else if(game.player2 == ip){
					resultStr = "ok"
				}
				console.log("ok2");
			});
	}
	res.json({result:resultStr});
});

module.exports = router;
