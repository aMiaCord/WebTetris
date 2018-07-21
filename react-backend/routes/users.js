var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{
	id:3,
	username: "samsepi01"
  },{
	  id: 2,
	  username: "D0loresH4ze"
  }]);

});

module.exports = router;
