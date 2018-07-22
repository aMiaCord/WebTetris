class GameManager{
	constructor(player1,board,room){
		this.blockstate = require('./BlockState').blockstates;
		this.player1 = player1;
		this.board = board;
		this.room = room;
		this.block = {x:1,y:5,blocktype:0,rotation:0,color:"state-yellow"};
		this.nextblock = new Array(5);
		this.shadow = [null,null,null,null];
		for(var i=0;i<5;i++){
			this.nextblock[i]= Math.floor(Math.random()*7);
		}
		this.getShadow();
	}
	setPlayer2(player2){
		this.player2 = player2;
	}
	board(){
		return this.board;
	}
	block(){
		return this.block;
	}

	updateDown(game){
			console.log(this.block);
			if(!this.canMove(1,0,this.block.rotation)){
				this.next();
				return;
			}
			for(var k=0;k<4;k++){
				var temp= this.blockstate[this.block.blocktype][this.block.rotation][k];
				this.board[this.block.x+temp[0]].blocks[this.block.y+temp[1]] = {value:"b0",color:"a"};
			}
			this.block.x+=1;
			for(var k=0;k<4;k++){
				var temp=this.blockstate[this.block.blocktype][this.block.rotation][k];
				this.board[this.block.x+temp[0]].blocks[this.block.y+temp[1]] = {value:"b1",color:this.block.color};
			}
	}
	canMove(x_mov,y_mov,rotate){
		for(var k=0;k<4;k++){
			var temp_y = this.block.y + y_mov
								+ this.blockstate[this.block.blocktype][rotate][k][1];
			var temp_x = this.block.x + x_mov
								+ this.blockstate[this.block.blocktype][rotate][k][0];
			if(this.board[temp_x].blocks[temp_y].value=="b2")
				return false;
		}
		return true;
	}


	next(){
		for(var k=0;k<4;k++){
			var temp=this.blockstate[this.block.blocktype][this.block.rotation][k];
			this.board[this.block.x+temp[0]].blocks[this.block.y+temp[1]].value = "b2";
		}
		this.block.x=1;
		this.block.y=5;
		this.block.blocktype = this.nextblock[0];
		this.block.ratation = 0;
		switch(this.nextblock[0]){
			case 0:
				this.block.color = "state-yellow";
				break;
			case 1:
				this.block.color = "state-skyblue";
				break;
			case 2:
				this.block.color = "state-green";
				break;
			case 3:
				this.block.color = "state-red";
				break;
			case 4:
				this.block.color = "state-orange";
				break;
			case 5:
				this.block.color = "state-blue";
				break;
			case 6:
				this.block.color = "state-purple";
				break;
		
		}

		this.nextblock.shift();
		this.nextblock.push(Math.floor(Math.random()*7));
		this.lineclear();
		this.getShadow();
	}


	lineclear(){
		for(var line=1;line<=20;line++){
			var row=1;
			for(;row<=10;row++){
				console.log("line"+line);
				console.log(this.board[line]);
				console.log("block"+row);
				console.log(this.board[line].blocks[row]);
				if(this.board[line].blocks[row].value!="b2")
					break;
			}
			if(row == 11){
				this.board.splice(line,1);
				var rowdata=[];
				rowdata.push({value:"b2"});
				for(var k=0;k<10;k++)
					rowdata.push({value:"b0"});
				rowdata.push({value:"b2"});
				this.board.unshift({height:0,blocks:{}});
				this.board[0].blocks = rowdata;
			}
		}
	}
	getShadow() {
		if(this.shadow[0]!=null){
			for(var i=0;i<4;i++){
				if(this.board[this.shadow[i][0]].blocks[this.shadow[i][1]].value=="b3")
					this.board[this.shadow[i][0]].blocks[this.shadow[i][1]].value="b0";
			}
		}
		var i=0;
		var temp = this.blockstate[this.block.blocktype][this.block.rotation];
		for(i=1;i<20;i++)
		{
			for(var j=0;j<4;j++)
				if(this.board[this.block.x+i+temp[j][0]].blocks[this.block.y+temp[j][1]].value == "b2")
					break;
			if(j!=4)
				break;
		}
		i-=1;
		for(var j=0;j<4;j++){
			if(this.board[this.block.x+i+temp[j][0]].blocks[this.block.y+temp[j][1]].value == "b0"){
				this.shadow[j]=[this.block.x+i+temp[j][0],this.block.y+temp[j][1]];
				this.board[this.block.x+i+temp[j][0]].blocks[this.block.y+temp[j][1]].value = "b3";
			}
		}
	}
}

module.exports = GameManager;
