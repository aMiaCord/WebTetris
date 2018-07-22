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
	if(ip in Games.ips)
		resultStr = "ok";
	res.json({result:resultStr});
});

module.exports = router;
