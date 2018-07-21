class GameManager{
	constructor(player1,board,room){
		this.player1 = player1;
		this.board = board;
		this.room = room;
	}
	setPlayer2(player2){
		this.player2 = player2;
	}
	getBoard(){
		return this.board;
	}
}

module.exports = GameManager;
