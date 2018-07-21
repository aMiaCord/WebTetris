import React, { Component } from 'react';
import './App.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';
const ComponentA = (props) => (<div>
		  <div>key detected: {props.eventKey}</div>
		    <KeyboardEventHandler
			    handleKeys={['a', 'b', 'c']}
				    onKeyEvent={(key, e) => console.log(`do something upon keydown event of ${key}`)} />
					</div>);
var isRoom = false;
class App extends Component {
	componentDidMount() {
		fetch("/state")
		.then(res => res.json())
		.then(result => this.setState({ result }));
	}
	state = {result:[]}
	render() {
		if(this.state.result.result == "ok")
			return <Room />;
		else
			return <Lobby />;
	}
}


class Lobby extends Component {
	constructor(props) {
		super(props);
		this.onClickRoom = this.onClickRoom.bind(this);
	}
	state = {result:[]}
	componentDidMount() {
		fetch("/state")
		.then(res => res.json())
		.then(result => this.setState({ result }));
	}
	onClickRoom() {
		fetch("/tetris/start");
	}
	render() {
		return <div className="App">
				<button onClick={this.onClickRoom}>START</button>
				</div>;
	}
}
	



class Room extends Component {
	constructor(props) {
		super(props);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	state = {tetris: []}
	componentDidMount() {
		this.timerID = setInterval( () => this.tick(),90);

		//fetch('/tetris')
		//.then(res => res.json())
		//.then(tetris => this.setState({ tetris }));
	}
	tick() {
		fetch('/tetris')
		.then(res => res.json())
		.then(tetris => this.setState({ tetris }));
	}
		
/*
	render() {
		return       <div className="App">
			<h1>Users</h1>
			{this.state.users.map(user =>
			<div key = {user.id}>{user.username}</div>)}
	            </div>;
	}
	*/
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
		return  <div className="App" tabIndex="0" onKeyDown={this.handleKeyPress}>

				{
					this.state.tetris.map(function(ub) {
							var blocks = ub.blocks.map(function(block) {
									var style = { float:"left"};
									return <div style={style} className={block.value}></div>;
							});
							return <div style={lineStyle}>{blocks}</div>;
					})
				}
				</div>;
							
					
	}
}


export default App;
