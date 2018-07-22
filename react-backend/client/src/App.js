import React, { Component } from 'react';
import './App.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';
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
		this.state = {result:[]};
	}

	componentDidMount() {
		fetch("/state")
		.then(res => res.json())
		.then(result => this.setState({ result }));
	}
	changeStuff(result){
		this.setState({ result });
	}
	render() {
		if(this.state.result.result == "ok")
			return <Room />;
		else
			return <Lobby changeHandler={this.changeStuff.bind(this)}  />;
	}
}


class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {roomList:[]};
		this.onClickRoom = this.onClickRoom.bind(this);
		this.onCreateRoom = this.onCreateRoom.bind(this);
	}
	
	componentDidMount() {
		fetch("/lobby/list")
		.then(res => res.json())
		.then(roomList => this.setState({ roomList }));
	}
	onClickRoom(value) {
		fetch("/lobby/start?num="+value)
		.then(res => res.json())
		.then(result => this.props.changeHandler(result));
		//App.render();
	}
	onCreateRoom() {
		fetch("/lobby/create")
		.then(res => res.json())
		.then(result => this.props.changeHandler(result));
	}

	render() {
		return <div className="App">
			{this.state.roomList.map(room =>
					{if(room.player2 != "null")
						return <div>{room.roomNumber} : {room.player1} FULL</div>;
					else
						return <div>{room.roomNumber} : {room.player1} <button onClick={() => this.onClickRoom(room.roomNumber)}>{room.roomNumber}</button></div>;}
					)}
				<button onClick={this.onCreateRoom}>CREATE NEW ROOM</button>
				</div>;
	}
}
	



class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {tetris:{board1:[],board2:[],player:0,next1:[],next2:[]},isStart:{isStart:"false"}};
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.gameStart = this.gameStart.bind(this);
	}
	componentDidMount() {
		fetch('/tetris')
		.then(res => res.json())
		.then(tetris => this.setState({ tetris }));
		this.timerID = setInterval( () => this.tick(),90);

	}
	tick() {
		if(this.state.tetris.player == 1 || this.state.isStart.isStart == "start")
		{
			fetch('/tetris')
			.then(res => res.json())
			.then(tetris => this.setState({ tetris }));
		}
	}
		
	gameStart() {
		fetch('/tetris/start')
		.then(res => res.json())
		.then(isStart => this.setState({ isStart }));
	}
	handleKeyPress(e) {
		// key == 32 => space
		// key == 37 => left
		// key == 38 => up
		// key == 39 => right
		// key == 40 => down
		fetch('/tetris?key='+e.keyCode);
	}

	render() {
		var lineStyle = {overflow:"hidden"};
		let button = null;
		if(this.state.tetris.player==0  && this.state.isStart.isStart == "false")
			button = <button onClick={this.gameStart}>START</button>;
		else if(this.state.tetris.player==1)
			button = <button>READY</button>;
		return  <div className="App" tabIndex="0" onKeyDown={this.handleKeyPress}>
				<div className="header">{button}</div>
				<div className="yeobaek"></div>	
				<div className="playerBoard">
				{
					this.state.tetris.board1.map(function(ub) {
							var blocks = ub.blocks.map(function(block) {
									var style = { float:"left"};
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
				}
				</div>
				<div className="yeobaek2">
				{
					this.state.tetris.next1.map(function(ub) {
							var ones = ub.map(function(ub2) {
							var blocks = ub2.blocks.map(function(block) {
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
							return <div className="ones">{ones}</div>;
						})
				}
				</div>
				<div className="playerBoard">
				{
					this.state.tetris.board2.map(function(ub) {
							var blocks = ub.blocks.map(function(block) {
									var style = { float:"left"};
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
				}
				</div>
				<div className="yeobaek3">
				{
					this.state.tetris.next2.map(function(ub) {
							var ones = ub.map(function(ub2) {
							var blocks = ub2.blocks.map(function(block) {
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
							return <div className="ones">{ones}</div>;

						})
				}
				</div>



				</div>;
							
					
	}
}


export default App;
