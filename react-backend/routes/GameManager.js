class GameManager{
	constructor(player1,room){
		this.blockstate = require('./BlockState').blockstates;
		this.room = room;
		this.player = [player1,"null"];
		this.die = [false,false];
		this.board = [];
		for(var player_num=0;player_num<2;player_num++){
			var temp_board = [];
			for(var i=0;i<22;i++){
				temp_board.push({height:i+1,blocks:{}});
				var rowtemp=[];
				if(i!=21){
					rowtemp.push({value:"b2",color:"a"});
					for(var j=0;j<10;j++){
						rowtemp.push({value:"b0",color:"a"});
					}
					rowtemp.push({value:"b2",color:"a"});
				}
				else{
					for(var j=0;j<12;j++){
						rowtemp.push({value:"b2",color:"a"});
					}
				}
				temp_board[i].blocks=rowtemp;
			}
			this.board.push(temp_board);
		}

		this.block = [{x:1,y:5,blocktype:0,rotation:0,color:"state-yellow"},
						{x:1,y:5,blocktype:0,rotation:0,color:"state-yellow"}];
		this.nextblock = [new Array(5),new Array(5)];
		this.shadow = [[null,null,null,null],[null,null,null,null]];
		for(var i=0;i<5;i++){
			this.nextblock[0][i]= Math.floor(Math.random()*7);
			this.nextblock[1][i]= Math.floor(Math.random()*7);

		}
		this.getShadow(0);
		this.getShadow(1);
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
		for(var player_num=0;player_num<2;player_num++){
			if(this.die[player_num]){
				continue;
			}
			if(!this.canMove(1,0,this.block[player_num].rotation,player_num)){
				this.next(player_num);
				return;
			}
			for(var k=0;k<4;k++){
				var temp= this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation][k];
				this.board[player_num][this.block[player_num].x+temp[0]].blocks[this.block[player_num].y+temp[1]] = {value:"b0",color:"a"};
			}
			this.block[player_num].x+=1;
			for(var k=0;k<4;k++){
				var temp=this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation][k];
				this.board[player_num][this.block[player_num].x+temp[0]].blocks[this.block[player_num].y+temp[1]] = {value:"b1",color:this.block[player_num].color};
			}
		}
	}
	canMove(x_mov,y_mov,rotate, player_num){
		for(var k=0;k<4;k++){
			var temp_y = this.block[player_num].y + y_mov
								+ this.blockstate[this.block[player_num].blocktype][rotate][k][1];
			var temp_x = this.block[player_num].x + x_mov
								+ this.blockstate[this.block[player_num].blocktype][rotate][k][0];
			if(this.board[player_num][temp_x].blocks[temp_y].value=="b2")
				return false;
		}
		return true;
	}


	next(player_num){
		if(this.die[player_num])
			return;
		for(var k=0;k<4;k++){
			var temp=this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation][k];
			this.board[player_num][this.block[player_num].x+temp[0]].blocks[this.block[player_num].y+temp[1]].value = "b2";
		}
		this.block[player_num].x=1;
		this.block[player_num].y=5;
		this.block[player_num].blocktype = this.nextblock[player_num][0];
		this.block[player_num].rotation = 0;

		for(var k=0;k<4;k++){
			var temp= this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation][k];
			if(this.board[player_num][this.block[player_num].x+temp[0]].blocks[this.block[player_num].y+temp[1]].value == "b2"){
				this.die[player_num] = true;
				return;
			}
		}


		switch(this.nextblock[player_num][0]){
			case 0:
				this.block[player_num].color = "state-yellow";
				break;
			case 1:
				this.block[player_num].color = "state-skyblue";
				break;
			case 2:
				this.block[player_num].color = "state-green";
				break;
			case 3:
				this.block[player_num].color = "state-red";
				break;
			case 4:
				this.block[player_num].color = "state-orange";
				break;
			case 5:
				this.block[player_num].color = "state-blue";
				break;
			case 6:
				this.block[player_num].color = "state-purple";
				break;
		
		}

		this.nextblock[player_num].shift();
		this.nextblock[player_num].push(Math.floor(Math.random()*7));
		this.lineclear(player_num);
		this.getShadow(player_num);
	}


	lineclear(player_num){
		for(var line=1;line<=20;line++){
			var row=1;
			for(;row<=10;row++){
				if(this.board[player_num][line].blocks[row].value!="b2")
					break;
			}
			if(row == 11){
				this.board[player_num].splice(line,1);
				var rowdata=[];
				rowdata.push({value:"b2"});
				for(var k=0;k<10;k++)
					rowdata.push({value:"b0"});
				rowdata.push({value:"b2"});
				this.board[player_num].unshift({height:0,blocks:{}});
				this.board[player_num][0].blocks = rowdata;
			}
		}
	}
	getShadow(player_num) {
		if(this.shadow[player_num][0]!=null){
			for(var i=0;i<4;i++){
				if(this.board[player_num][this.shadow[player_num][i][0]].blocks[this.shadow[player_num][i][1]].value=="b3")
					this.board[player_num][this.shadow[player_num][i][0]].blocks[this.shadow[player_num][i][1]].value="b0";
			}
		}
		var i=0;
		var temp = this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation];
		for(i=1;i<20;i++)
		{
			for(var j=0;j<4;j++)
				if(this.board[player_num][this.block[player_num].x+i+temp[j][0]].blocks[this.block[player_num].y+temp[j][1]].value == "b2")
					break;
			if(j!=4)
				break;
		}
		i-=1;
		for(var j=0;j<4;j++){
			if(this.board[player_num][this.block[player_num].x+i+temp[j][0]].blocks[this.block[player_num].y+temp[j][1]].value == "b0"){
				this.shadow[player_num][j]=[this.block[player_num].x+i+temp[j][0],this.block[player_num].y+temp[j][1]];
				this.board[player_num][this.block[player_num].x+i+temp[j][0]].blocks[this.block[player_num].y+temp[j][1]].value = "b3";
			}
		}
	}
}

module.exports = GameManager;
