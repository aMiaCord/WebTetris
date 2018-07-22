
class BlockState
{
}
var blockstate = new Array(7);
for(var i=0;i<7;i++){
	blockstate[i]=new Array(4);
	for(var j=0;j<4;j++){
		switch(i*10+j){
			case 0:
				blockstate[i][j] = [[0,0],[0,1],[1,0],[1,1]];
				break;
			case 1:
				blockstate[i][j] = [[0,0],[0,1],[1,0],[1,1]];
				break;
			case 2:
				blockstate[i][j] = [[0,0],[0,1],[1,0],[1,1]];
				break;
			case 3:
				blockstate[i][j] = [[0,0],[0,1],[1,0],[1,1]];
				break;
			case 10:
				blockstate[i][j] = [[0,0],[1,0],[2,0],[-1,0]];
				break;
			case 11:
				blockstate[i][j] = [[0,0],[0,1],[0,2],[0,-1]];
				break;
			case 12:
				blockstate[i][j] = [[0,0],[1,0],[2,0],[-1,0]];
				break;
			case 13:
				blockstate[i][j] = [[0,0],[0,1],[0,2],[0,-1]];
				break;
			case 20:
				blockstate[i][j] = [[0,0],[1,0],[0,1],[1,-1]];
				break;
			case 21:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[1,1]];
				break;
			case 22:
				blockstate[i][j] = [[0,0],[1,0],[0,1],[1,-1]];
				break;
			case 23:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[1,1]];
				break;
			case 30:
				blockstate[i][j] = [[0,0],[-1,0],[-1,-1],[0,1]];
				break;
			case 31:
				blockstate[i][j] = [[0,0],[-1,0],[0,-1],[1,-1]];
				break;
			case 32:
				blockstate[i][j] = [[0,0],[-1,0],[-1,-1],[0,1]];
				break;
			case 33:
				blockstate[i][j] = [[0,0],[-1,0],[0,-1],[1,-1]];
				break;
			case 40:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[-1,1]];
				break;
			case 41:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[-1,-1]];
				break;
			case 42:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[1,-1]];
				break;
			case 43:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[1,1]];
				break;
			case 50:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[-1,-1]];
				break;
			case 51:
				blockstate[i][j] = [[0,0],[1,0],[-1,0],[1,-1]];
				break;
			case 52:
				blockstate[i][j] = [[0,0],[0,1],[0,-1],[1,1]];
				break;
			case 53:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[-1,1]];
				break;
			case 60:
				blockstate[i][j] = [[0,0],[-1,0],[0,1],[0,-1]];
				break;
			case 61:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[0,-1]];
				break;
			case 62:
				blockstate[i][j] = [[0,0],[1,0],[0,1],[0,-1]];
				break;
			case 63:
				blockstate[i][j] = [[0,0],[-1,0],[1,0],[0,1]];
				break;
		}
	}
}
BlockState.blockstates  = blockstate;


module.exports = BlockState;

