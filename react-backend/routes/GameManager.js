class GameManager{
	constructor(player1,nickname1,room,roomName){
		this.blockstate = require('./BlockState').blockstates;
		this.colors = ["state-yellow","state-skyblue","state-green","state-red","state-orange","state-blue","state-purple"];
		this.room = room;
		this.roomName = roomName;
		this.started = "false";
		this.player = [player1,"null"];
		this.nickname = [nickname1,"null"];
		this.die = ["false","false"];
		this.overFlag = false;
		this.board = [];
		this.score = [0,0];
		this.combo = [0,0];
		this.lineStack = [0,0];
		this.holdBlock = [undefined,undefined];
		this.canHold = [true,true];
		this.crowd = new Array();
		for(var player_num=0;player_num<2;player_num++){
			var tmp_board = [];
			for(var i=0;i<25;i++)
			{
				var tmp_line = [];
				for(var j=0;j<12;j++)
					tmp_line.push({value:"s-empty",color:"aa"});
				tmp_board.push(tmp_line);
			}
			for(var i=0;i<25;i++)
			{
				tmp_board[i][0] = {value:"s-static",color:"aa"};
				tmp_board[i][11] = {value:"s-static",color:"aa"};
			}
			for(var i=0;i<12;i++)
			{
				tmp_board[23][i] = {value:"s-static",color:"aa"};
				tmp_board[24][i] = {value:"s-static",color:"aa"};
			}

			this.board.push(tmp_board);
		}
		
		this.nextblock = [new Array(5),new Array(5)];
		this.nextnextblock = [this.shuffle([0,1,2,3,4,5,6]), this.shuffle([0,1,2,3,4,5,6])];
		this.shadow = [[null,null,null,null],[null,null,null,null]];

		
	}
	setPlayer2(player2,nickname2){
		this.player[1] = player2;
		this.nickname[1] = nickname2;
	}
	board(){
		return this.board;
	}
	block(){
		return this.block;
	}
	shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	//matrix to json object board
	parse2json(blocks){
		var json_board = [];
		//make empty board
		for(var index=0;index<blocks.length;index++){
			var json_next = [];
			for(var col=0;col<4;col++){
				var json_row = [];
				for(var row=0;row<4;row++){
					json_row.push({value:"s-next",color:"state-empty"});
				}
				json_next.push(json_row);
			}
			json_board.push(json_next);
		}
		//fill
		for(var index=0;index<blocks.length;index++){
			var thisblock = blocks[index];
			if(thisblock == undefined)
				continue;
			var block_mat = this.blockstate[thisblock][0];
			for(var point=0;point<4;point++){
				json_board[index][block_mat[point][0]+1][block_mat[point][1]+1].color = this.colors[thisblock];
			}
		}
		return json_board;
	}
	//여기를 만들어야한답니다아아
	hold(player_num){
		//remove block from board
		if(!this.canHold[player_num]){
			return;
		}
		this.changeState(player_num,"s-empty","aa");

		var tempBlock;
		//swap block
		if(this.holdBlock[player_num]!=undefined){
			tempBlock = this.holdBlock[player_num];
			this.holdBlock[player_num] = this.block[player_num].blocktype;
			this.block[player_num] = {x:1, y:5, blocktype:tempBlock,rotation:0, color:this.colors[tempBlock]}
		}
		//if hold is empty, get nextblock
		else{
			this.holdBlock[player_num] = this.block[player_num].blocktype;
			this.block[player_num] = {x:1, y:5, blocktype:this.nextblock[player_num][0], rotation:0, color:this.colors[this.nextblock[player_num][0]]};
			this.nextblock[player_num].shift();
			this.nextblock[player_num].push(this.nextnextblock[player_num][0]);
			this.nextnextblock[player_num] = this.nextnextblock[player_num].slice(1);
			if(this.nextnextblock[player_num].length == 0)
				this.nextnextblock[player_num] = this.shuffle([0,1,2,3,4,5,6]);
		}
		//if cannot change, die!
		if(!this.canMove(0,0,0,player_num)){
			this.die[player_num]="true";
		}
		//draw swapped block
		else{
			this.changeState(player_num,"s-now",this.block[player_num].color);
			this.getShadow(player_num);
		}
		this.canHold[player_num] = false;
	}
	gameStart(){
		var firstBlock = [Math.floor(Math.random()*7),Math.floor(Math.floor(Math.random()*7))];
		this.block = [{x:1, y:5, blocktype:firstBlock[0], rotation:0, color:colors[firstBlock[0]]},
						{x:1, y:5, blocktype:firstBlock[1], rotation:0, color:colors[firstBlock[1]]}];
		for(var i=0;i<5;i++){
			//load next block1
			this.nextblock[0][i]= this.nextnextblock[0][0];
			this.nextnextblock[0] = this.nextnextblock[0].slice(1);
			if(this.nextnextblock[0].length == 0){
				this.nextnextblock[0] = this.shuffle([0,1,2,3,4,5,6]);
			}
			//load next block2
			this.nextblock[1][i]= this.nextnextblock[1][0];
			this.nextnextblock[1] = this.nextnextblock[1].slice(1);
			if(this.nextnextblock[1].length ==0){
				this.nextnextblock[1] = this.shuffle([0,1,2,3,4,5,6]);
			}
		}
		this.getShadow(0);
		this.getShadow(1);
		this.started = "true";
	}
	updateDown(game){
		for(var player_num=0;player_num<2;player_num++){
			if(this.die[player_num]=="true"){
				continue;
			}
			if(!this.canMove(1,0,this.block[player_num].rotation,player_num)){
				this.nextLoad(player_num);
				return;
			}
			this.changeState(player_num,"s-empty","aa");
			this.block[player_num].x+=1;
			this.changeState(player_num,"s-now",this.block[player_num].color);
		}
	}
	canMove(x_mov,y_mov,rotate, player_num){
		for(var k=0;k<4;k++){
			var temp_y = this.block[player_num].y + y_mov
								+ this.blockstate[this.block[player_num].blocktype][rotate][k][1];
			var temp_x = this.block[player_num].x + x_mov
								+ this.blockstate[this.block[player_num].blocktype][rotate][k][0];
			if(this.board[player_num][temp_x][temp_y].value=="s-static")
				return false;
		}
		return true;
	}


	nextLoad(player_num){
		if(this.die[player_num]=="true")
			return;
		this.changeState(player_num,"s-static",this.block[player_num].color);
		this.block[player_num].x=1;
		this.block[player_num].y=5;
		this.block[player_num].blocktype = this.nextblock[player_num][0];
		this.block[player_num].rotation = 0;

		for(var k=0;k<4;k++){
			var temp= this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation][k];
			var xx = this.block[player_num].x+temp[0];
			var yy = this.block[player_num].y+temp[1];
			if(this.board[player_num][xx][yy].value == "s-static"){
				this.die[player_num] = "true";
				return;
			}
		}

		this.block[player_num].color = this.colors[this.nextblock[player_num][0]];

		this.nextblock[player_num].shift();
		this.nextblock[player_num].push(this.nextnextblock[player_num][0]);
		this.nextnextblock[player_num] = this.nextnextblock[player_num].slice(1);
		if(this.nextnextblock[player_num].length == 0)
			this.nextnextblock[player_num] = this.shuffle([0,1,2,3,4,5,6]);
		this.lineclear(player_num);
		this.attack(player_num,this.lineStack[player_num]);
		this.getShadow(player_num);

		this.canHold[player_num] = true;
	}


	lineclear(player_num){
		var clear_num = 0;
		for(var line=1;line<=22;line++){
			var row=1;
			for(;row<=10;row++){
				if(this.board[player_num][line][row].value!="s-static")
					break;
			}
			if(row == 11){
				clear_num += 1;
				for(var i=line;i>0;i--)
					this.board[player_num][i] = this.board[player_num][i-1];
				this.board[player_num][0] = [];
				for(var i=0;i<12;i++)
					this.board[player_num][0].push({value:"s-empty",color:"aa"});
				this.board[player_num][0][0] = this.board[player_num][0][11] =  {value:"s-static",color:"aa"};
			}
		}
		this.score[player_num] += clear_num*(200 + (clear_num-1)*100)/2;
		this.combo[player_num] += 1;
		if(clear_num == 0)
			this.combo[player_num]=0;
		if(clear_num>=2)
			this.lineStack[(player_num+1)%2] += clear_num-1;
		if(this.combo[player_num] >= 6)
			this.lineStack[1-player_num] += 3;
		else if(this.combo[player_num] >= 4)
			this.lineStack[1-player_num] += 2;
		else if(this.combo[player_num] >= 2)
			this.lineStack[1-player_num] += 1;
		while((this.lineStack[0] > 0) && (this.lineStack[1] > 0))
		{
			this.lineStack[0] -= 1;
			this.lineStack[1] -= 1;
		}
	}
	attack(player_num,clear_num){
		for(var i=0;i<this.lineStack[player_num];i++){
			var blank = Math.floor((Math.random())*10)+1;
			var rowdata = [];
			//gray line add
			rowdata.push({value:"s-static",color:"aa"});
			for(var j=0;j<10;j++){
				rowdata.push({value:"s-static",color:"state-gray"});
			}
			rowdata[blank] = {value:"s-empty",color:"aa"};
			rowdata.push({value:"s-static",color:"aa"});
			this.board[player_num][23] = rowdata;
			//check game over
			for(var j=1;j<=10;j++){
				if(this.board[player_num][0][j].value == "s-static"){
					this.die[player_num]="true";
					return;
				}
			}
			//remove first line
			this.board[player_num].shift();
			//add last line
			var static_row = [];
			for(var j=0;j<12;j++)
				static_row.push({value:"s-static",color:"aa"});
			this.board[player_num].push(static_row);
		}
		this.lineStack[player_num] = 0;

	}
	getShadow(player_num) {
		if(this.shadow[player_num][0]!=null){
			for(var i=0;i<4;i++){
				if(this.board[player_num][this.shadow[player_num][i][0]][this.shadow[player_num][i][1]].value=="s-shadow")
					this.board[player_num][this.shadow[player_num][i][0]][this.shadow[player_num][i][1]].value="s-empty";
			}
		}
		var i=0;
		var temp = this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation];
		for(i=1;i<23;i++)
		{
			var j;
			for(j=0;j<4;j++){
				var xx= this.block[player_num].x+i+temp[j][0];
				var yy= this.block[player_num].y+temp[j][1];
				if(this.board[player_num][xx][yy].value == "s-static")
					break;
			}
			if(j!=4)
				break;
		}
		i-=1;
		for(var j=0;j<4;j++){
			var xx= this.block[player_num].x+i+temp[j][0];
			var yy = this.block[player_num].y+temp[j][1];
			if(this.board[player_num][xx][yy].value == "s-empty"){
				this.shadow[player_num][j]=[xx,yy];
				this.board[player_num][xx][yy].value = "s-shadow";
			}
		}
	}
	changeState(player_num,state,col){
		for(var k=0;k<4;k++){
			var temp = this.blockstate[this.block[player_num].blocktype][this.block[player_num].rotation][k];
			var xx = this.block[player_num].x+temp[0];
			var yy = this.block[player_num].y+temp[1];
			this.board[player_num][xx][yy] = {value : state,color:col};
		}
	}
}

module.exports = GameManager;
