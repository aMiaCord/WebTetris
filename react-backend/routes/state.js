var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress).split(",")[0];
	var resultStr = [];
	if(ip in ips){
		resultStr = [ip,games[ips[ip]].player[1]];
	}
	res.json(resultStr);
});

module.exports = router;
