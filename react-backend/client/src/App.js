import React, { Component } from 'react';
import './App.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import io from "socket.io-client"
const ComponentA = (props) => (<div>
		  <div>key detected: {props.eventKey}</div>
		    <KeyboardEventHandler
			    handleKeys={['a', 'b', 'c']}
				    onKeyEvent={(key, e) => console.log(`do something upon keydown event of ${key}`)} />
					</div>);
var classNames = require("classnames/bind");
class App extends Component {
	constructor(props)
	{
		super(props);
		this.state = {result:[],socket:io('52.231.65.151:8000')};

	}

	componentDidMount() {
		fetch("/state")
		.then(res => res.json())
		.then(result => this.setState({ result }));
		this.state.socket.on("WHO_IN_ROOM", (result) => {this.setState({ result })});
	}
	changeStuff(result){
		this.setState({ result });
	}
	render() {
		if(this.state.result.length == 2)
			return <Room changeHandler={this.changeStuff.bind(this)} players={this.state.result} socket={this.state.socket}/>;
		else
			return <Lobby changeHandler={this.changeStuff.bind(this)} socket={this.state.socket} />;
	}
}

class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {nickValue:"",roomList:[],isClick:false,inputValue:'',info:{nickname:"재야의 고수",ip:"52.231.65.151",win:0,lose:0,max:0,many:0}};
		this.onSteal = this.onSteal.bind(this);
		this.onClickRoom = this.onClickRoom.bind(this);
		this.onCreateRoom = this.onCreateRoom.bind(this);
		this.onClickCreate = this.onClickCreate.bind(this);
		this.onClickChange = this.onClickChange.bind(this);
		this.onClickCancel = this.onClickCancel.bind(this);
		this.updateInputValue = this.updateInputValue.bind(this);
		this.updateNickValue = this.updateNickValue.bind(this);
	}
	
	componentDidMount() {
		this.socket = this.props.socket;
		this.socket.on("LOBBY_LIST", (roomList) => {this.setState({ roomList })});
		fetch("/lobby/list")
		.then(res => res.json())
		.then(roomList => this.setState({ roomList }));
		fetch("/lobby/info")
			.then(res => res.json())
			.then(info => 
					this.setState({ info }));
	}
	onClickRoom(value) {
		fetch("/lobby/start?num="+value+"&nickname="+this.state.info.nickname);
		//App.render();
	}
	onCreateRoom() {
		if(this.state.inputValue == "")
			fetch("/lobby/create?name=즐겜하실분~&nickname="+this.state.info.nickname);
		else
			fetch("/lobby/create?name="+this.state.inputValue+"&nickname="+this.state.info.nickname);
	}
	onSteal(value) {
		fetch("/lobby/watch?num="+value);
	}
	onClickCreate() {
		this.setState({ isClick : true });
	}
	onClickCancel() {
		this.setState({ isClick : false});
	}
	updateInputValue(evt) {
		this.setState({inputValue:evt.target.value});
	}
	updateNickValue(evt) {
		this.setState({nickValue:evt.target.value});
	}
	onClickChange() {
		fetch("/lobby/change?name="+this.state.nickValue)
			.then(res => res.json())
			.then(info => this.setState({ info }));
		this.setState({nickValue : ""});
	}
	render() {
		let createButton = null;
		if(this.state.isClick)
		{
			createButton = <div><button onClick={this.onClickCancel} className="buttonDesign cancel">CANCEL</button><button onClick={this.onCreateRoom} className="buttonDesign confirm">CREATE</button>
				<input value={this.state.inputValue} onChange={this.updateInputValue} type="text" className="roomName" placeholder="방 이름을 정해주세요"></input>
				
				</div>;
		}
		else
		{
			console.log("!");
			createButton = <button className="buttonDesign create" onClick={this.onClickCreate}>CREATE NEW ROOM</button>;
		}
		return <div className="App">
		<div className="tetris-header"><div className="header-name">JUNTAEKTRIS</div>
		{createButton}
		</div>
		<div className="roomList"><div className="roomTag">ROOM LIST(제발 HOST가 방 폭파시켜주세요)</div>
		<div className="rooms">
			{this.state.roomList.map(room => {
					let BUTS = null;
					let isEnemy = null;
					if(room.player2 != "null")
						BUTS = <div><div className="vs">VS</div>
						<div className="enemyName">{room.nickname2}({room.player2})</div>
						<div onClick={() => this.onSteal(room.roomNumber)} className="buttonDesign enter">관전</div></div>;
					else
						BUTS = <div className="buttonDesign enter" onClick={() => this.onClickRoom(room.roomNumber)}>ENTER</div>;
					return <div className="room"><div className="roomNumber">ROOM {room.roomNumber}</div><div className="roomNamed">방이름 : {room.roomName}</div>
					<div className="hostName">{room.nickname1}({room.player1})</div>
					{BUTS}</div>;
					})
			
			}

		</div>
		</div>
		<div className="myInfo">
				<div className="infoTag">MY INFO</div>
				<div className="infoBox">
				<div className="leftInfo">IP</div><div className="rightInfo">{this.state.info.ip}</div>
				<div className="leftInfo">별명</div><div className="rightInfo">{this.state.info.nickname}</div>
				<div className="leftInfo"><input value={this.state.nickValue} onChange={this.updateNickValue} className="nickInput" type="text" placeholder="별명을 바꿔보세요"></input></div>
				<button className="buttonDesign change" onClick={this.onClickChange}>변경</button>
				<div className="leftInfo">전적</div>	
				<div className="leftInfo">승리</div><div className="rightInfo">{this.state.info.win}</div>
				<div className="leftInfo">패배</div><div className="rightInfo">{this.state.info.lose}</div>
				<div className="leftInfo">누적 점수</div><div className="rightInfo">{this.state.info.many}</div>
				<div className="leftInfo">최고 점수</div><div className="rightInfo">{this.state.info.max}</div>
				</div>
		</div>
		</div>;
	}
}
	



class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {mymy:false,count:"준비중",ready:"false",players:["",""],socket:null,tetris:{roomName:"고수만요",hold1:[],hold2:[],board1:[],board2:[],player:0,score1:0,score2:0,next1:[],next2:[],die1:"false",die2:"false",started:"false",combo1:0,combo2:0}};
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	componentDidMount() {
		this.socket = this.props.socket;
		fetch("/tetris");
		this.socket.on('GAME_STATE', (tetris) => { this.setState({ tetris }) });
		this.socket.on("GAME_END", () => {
				fetch("/tetris/game_over");
				console.log("!");
				});
		this.socket.on("WHO_IN_ROOM",(players) => { this.setState({ players }) });
		this.socket.on("READY",(ready) => {this.setState({ ready }) });
		this.socket.on("COUNTDOWN",(count) => {this.setState({ count }) });
		this.sendStart = ev => {
			ev.preventDefault();
			this.setState({ mymy : true });
			this.socket.emit("GAME_START",{});
		};
		this.sendQuit = ev => {
			ev.preventDefault();
			this.socket.emit("GAME_QUIT",{});
		};
	}
	
	handleKeyPress(e) {
		// key == 32 => space
		// key == 37 => left
		// key == 38 => up
		// key == 39 => right
		// key == 40 => n
		//
		fetch('/tetris?key='+e.keyCode);
	}
	
	render() {
		var floatleft={float:"left"};
		var lineStyle = {overflow:"hidden"};
		let button = null;
		let gameover1 = null;
		let gameover2 = null;
		let combo1 = null;
		let combo2 = null;
		let player1 = "";
		let player2 = "";
		let startButton = null;
		this.props.players.map(function(player,i) {
				if(i==0)
				{
					player1 = player;
				}
				if(i==1)
				{
					if(player == "null(null)" || player == "null")
					{
						player2 = "상대를 기다리는 중..";
					}
					else
					{
						player2 = player;
					}
				}
		});
		if(this.state.tetris.combo1 >= 2)
			combo1 = <h1 className="combo1-1">{this.state.tetris.combo1} COMBO!!</h1>;
		if(this.state.tetris.combo2 >= 2)
			combo2 = <h1 className="combo2-1">{this.state.tetris.combo2} COMBO!!</h1>;
		switch(this.state.count)
		{
			case "3":
			case "2":
			case "1":
			case "START":
				gameover1 = <h1 className="count1">{this.state.count}</h1>;
				gameover2 = <h1 className="count2">{this.state.count}</h1>;
			default:
				break;
		}
		if(this.state.tetris.started == "false" && !this.state.mymy)
		{

			if(this.state.tetris.player == 0)
				button = <button className="buttonDesign start" onClick={this.sendStart}>START</button>;
		}
		let quitButton = <div onClick={this.sendQuit} className="buttonDesign quit">QUIT</div>;
		if(this.state.tetris.die1 == "true")
			gameover1 = <h1 className="gameOver1">GAME OVER</h1>
		if(this.state.tetris.die2 == "true")
			gameover2 = <h1 className="gameOver2">GAME OVER</h1>
		return  <div className="App" tabIndex="0" onKeyDown={this.handleKeyPress}>
				<div className="tetris-header"><div className="header-name">JUNTAEKTRIS</div><div className="ROOM_NAME">방이름 :{this.state.tetris.roomName}</div>{quitButton}{button}</div>
				<div className="yeobaek"></div>	
				<div className="player1left"><div className="scoreboard"><div className="stitle">SCORE</div><div className="score">{this.state.tetris.score1}</div></div>
				<div className="hold"><div className="stitle">HOLD</div>
				<div className="holdblock">
				{
					this.state.tetris.hold1.map(function(ub) {
							var blocks = ub.map(function(block) {
									var style = {float:"left"};
									var classtyle = {
										col : block.value,
										val : block.color
										};
									var cx = classNames.bind(classtyle);
									var classes = cx('col','val');
									return <div style={style} className={classes}></div>;
								});
							return <div style={lineStyle}>{blocks}</div>;
							})
				}
				
				</div>
				</div></div>
				<div style={floatleft}>
				<div className="playerBoard">
				{gameover1}
				{combo1}
				{
					this.state.tetris.board1.map(function(ub) {
							var blocks = ub.map(function(block) {
									var style = { float:"left"};
									var classtyle = {
											col: block.value,
											val: block.color
									};
									var cx = classNames.bind(classtyle);
									var classes = cx('col','val');
									return <div style={style} className={classes}></div>;
							});
							return <div style={lineStyle} className="line">{blocks}</div>;
					})
				}
				</div>
				<div className="yeobaek2">
				<div className="next_title">NEXT</div>
				{
					this.state.tetris.next1.map(function(ub) {
							var ones = ub.map(function(ub2) {
							var blocks = ub2.map(function(block) {
									var style={float:"left"};
									var classtyle = {
										col: block.value,
										val: block.color
									};
									var cx = classNames.bind(classtyle);
									var classes = cx('col','val');
									return <div style={style} className={classes}></div>;
							});
							return <div style={lineStyle}>{blocks}</div>;
							})
							return <div className="ones"><div className="oneNext">{ones}</div></div>;
						})
				}
				</div>
					<div className="playerName">{player1}</div>
					</div>
		<div className="player2left"><div className="scoreboard"><div className="stitle">SCORE</div><div className="score">{this.state.tetris.score2}</div></div>
		<div className="hold"><div className="stitle">HOLD</div>
		<div className="holdblock">
		{
			this.state.tetris.hold2.map(function(ub) {
					var blocks = ub.map(function(block) {
							var style = {float:"left"};
							var classtyle = {
								col : block.value,
								val : block.color
								};
							var cx = classNames.bind(classtyle);
							var classes = cx('col','val');
							return <div style={style} className={classes}></div>;
							});
					return <div style={lineStyle}>{blocks}</div>;
					})
		}
				</div>
		</div></div>
				<div style={floatleft}>
				<div className="playerBoard">
				{gameover2}
				{combo2}
				{
					this.state.tetris.board2.map(function(ub) {
							var blocks = ub.map(function(block) {
									var style = {float:"left"};
									var classtyle = {
										col: block.value,
										val: block.color
									};
									var cx = classNames.bind(classtyle);
									var classes = cx('col','val');
									return <div style={style} className={classes}></div>;
							});
							return <div style={lineStyle} className="line">{blocks}</div>;
					})
				}
				</div>
				<div className="playerName">{player2}</div>
					</div>
				<div className="yeobaek2">
				<div className="next_title">NEXT</div>
				{
					this.state.tetris.next2.map(function(ub) {
							var ones = ub.map(function(ub2) {
							var blocks = ub2.map(function(block) {
									var style={float:"left"};
									var classtyle = {
										col: block.value,
										val: block.color
									};
									var cx = classNames.bind(classtyle);
									var classes = cx('col','val');
									return <div style={style} className={classes}></div>;
							});
							return <div className="line" style={lineStyle}>{blocks}</div>;
							})
							return <div className="ones"><div className="oneNext">{ones}</div></div>;

						})
				}
				</div>

				<div className="help">
					<div className="helpTitle">MANUAL</div>
					<div className="leftGuide">←</div><div className="rightGuide">LEFT MOVE</div>
					<div className="leftGuide">→</div><div className="rightGuide">RIGHT MOVE</div>
					<div className="leftGuide">↓</div><div className="rightGuide">SOFT DROP</div>
					<div className="leftGuide">↑</div><div className="rightGuide">ROTATE &nbsp;&nbsp;&nbsp;&nbsp;</div>
					<div className="leftGuide C">C</div><div className="rightGuide">HOLD</div>
					<div className="leftGuide D">SPACE</div><div className="last">DROP</div>
				</div>	

				</div>;
							
					
	}
}


export default App;
