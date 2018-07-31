var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/tetris');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
		console.log('connected to mongodb');
		});

var playerSchema = new Schema({
	ip:{type:String, required:true, index:{unique:true}},
	score:Number,
	highscore:Number,
	win:Number,
	lose:Number,
	nickName:String
	
});

var Model = mongoose.model('player',playerSchema);



module.exports = Model;
